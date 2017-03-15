require "capybara"
require "capybara/dsl"

module Scraper
  class Task
    attr_reader :options, :logger

    include Capybara::DSL

    def initialize(options = {})
      @options = options
      @logger = Rails.logger
    end

    def run(chambers)
      logger.info("- starting scrape")

      # fake user agent to avoid getting redirected to error pages
      # find alternatives here: https://techblog.willshouse.com/2012/01/03/most-common-user-agents/
      page.driver.headers = {
        "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
      }

      # scrape and aggregate results from chamber pages
      add_committees_to_chambers(chambers)
      hearings = chambers.flat_map(&:committees).flat_map(&:hearings)
      bills = hearings.flat_map(&:bills)

      logger.info("\n- finished scrape:")
      logger.info("  new hearings: #{hearings.count(&:new_record?)}")
      logger.info("  new bills: #{bills.count(&:new_record?)}")
    end

    private

    # committee-hearings
    def add_committees_to_chambers(chambers)
      chambers.each do |chamber|
        add_unsaved_records(chamber, :committees, scrape_all_committees_for_chamber(chamber))
      end
    end

    def scrape_all_committees_for_chamber(chamber)
      # committee data is pulled in by xhr so we have to sleep, we could try
      # hitting that api directly (its data is much richer)
      visit(chamber.url)

      # click the month tab to view all the upcoming hearings
      month_tab = page.first("#CommitteeHearingTabstrip li a", text: "Month")
      month_tab&.click
      sleep(2)

      # get the all hearings from the monthly tab
      scrape_committees_for_chamber(chamber, chamber.url)
    end

    def scrape_committees_for_chamber(chamber, url, page_number = 0)
      logger.info("\n- visit chamber")
      logger.info("  name: #{chamber.name}")
      logger.info("  page: #{page_number}")

      # we're assumed to already be here on page_number 0
      if page_number != 0
        visit(url)
        sleep(2)
      end

      # short-circuit when there are no rows
      if page.has_css?(".t-no-data")
        return []
      end

      # find the next page's url before traversing
      next_page_url = find_next_page_url

      # create hearings, winding together scraped data and request data
      committee_hearings_reponse = CommitteeHearingsRequest.fetch(chamber, page_number)
      committee_hearing_rows = page.find_all("#CommitteeHearingTabstrip tbody tr")
      committees = committee_hearing_rows
        .map { |row| build_committee_hearing(row, committee_hearings_reponse) }
        .compact
        .map { |committee, hearing|
          bills = scrape_bills_for_hearing(hearing, hearing.url)
          add_unsaved_records(hearing, :bills, bills)
          committee
        }

      # aggregate the next page's results if it's available
      next_page_url.blank? ? committees : committees + scrape_committees_for_chamber(chamber, next_page_url, page_number + 1)
    end

    def build_committee_hearing(row, committee_hearings_reponse)
      columns = row.find_all("td", visible: false)

      # validate data
      committee_id = columns[0]&.text(:all)&.to_i
      if committee_id.blank?
        raise Error, "Failed to find committee id for row: #{row}"
      end

      committee_hearing_data = committee_hearings_reponse[committee_id]
      if committee_hearing_data.blank?
        logger.debug("Failed to find response data for committee id #{committee_id}, skipping")
        return nil
      end

      # build / update models, attaching hearing to committee if necessary
      committee = build_committee(columns, committee_hearing_data)
      hearing = build_hearing(columns, committee_hearing_data)
      add_unsaved_record(committee, :hearings, hearing)

      [committee, hearing]
    end

    def build_committee(columns, committee_hearing_data)
      committee = Committee.find_or_initialize_by({
        external_id: committee_hearing_data[:CommitteeId]
      })

      committee.assign_attributes({
        name: committee_hearing_data[:CommitteeDescription]
      })

      committee
    end

    def build_hearing(columns, committee_hearing_data)
      hearing_data = committee_hearing_data[:CommitteeHearing]

      hearing = Hearing.find_or_initialize_by({
        external_id: hearing_data[:HearingId]
      })

      hearing.assign_attributes({
        url: columns[3]&.find("a")["href"],
        location: committee_hearing_data[:Location],
        is_cancelled: hearing_data[:IsCancelled],
        allows_slips: hearing_data[:AllowSlips],
      })

      # reponse dates are in the form 'Date(<millis>)'
      date_millis_string = hearing_data[:ScheduledDateTime][/Date\((\d+)\)/, 1]
      hearing.assign_attributes({
        datetime: Time.zone.at(date_millis_string.to_f / 1000.0)
      })

      hearing
    end

    # bills
    def scrape_bills_for_hearing(hearing, url)
      logger.info("\n- visit hearing #{hearing.external_id}")
      logger.info("  url: #{url}")

      visit(url)

      # short-circuit when there are no rows
      if page.has_css?(".t-no-data")
        return []
      end

      # find the url of the next page before traversing
      next_page_url = find_next_page_url
      logger.info("  next?: #{!next_page_url.blank?}")

      # build bills from each row on this page
      bill_rows = page.find_all("#GridCurrentCommittees tbody tr")
      bills = bill_rows
        .map { |row| build_bill(row) }
        .compact
        .each { |bill| update_bill_synopsis(bill) }
      logger.info("  bills: #{bills.count}")

      # aggregate the next page's results if it's available
      next_page_url.blank? ? bills : bills + scrape_bills_for_hearing(hearing, next_page_url)
    end

    def build_bill(row)
      # there are ids in hidden columns
      columns = row.find_all("td", visible: false)

      # extract basic information for debugging (if possible)
      external_id = columns[0]&.text(:all)
      document_name = columns[2]&.text

      # short circuit if we can't find a link
      witness_slip_link = row.first(".slipiconbutton")
      if witness_slip_link.blank?
        logger.debug "- bill missing slip link: #{external_id} - #{document_name}"
      end

      if external_id.blank?
        raise Error, "Failed to find bill id for row: #{row}"
      end

      # skip sub-bills with hyphens in name for now
      if document_name.include?(" - ")
        logger.debug "- bill is modification: #{external_id} - #{document_name}, skipping"
        return nil
      end

      bill ||= Bill.find_or_initialize_by({
        external_id: external_id
      })

      bill.assign_attributes({
        document_name: document_name,
        sponsor_name: columns[3]&.text,
        description: columns[4]&.text,
        witness_slip_url: witness_slip_link.present? ? witness_slip_link["href"] : nil,
      })

      bill
    end

    def update_bill_synopsis(bill)
      return if options[:skip_synopsis]
      visit(bill.url)

      # matching based on header text is only way to grab element right now
      synopsis = page.first(:xpath, "//span[contains(text(),'Synopsis')]/following-sibling::span")
      bill.synopsis = synopsis&.text
    end

    # helpers
    def add_unsaved_record(model, association_name, record)
      model.association(association_name).add_to_target(record)
    end

    def add_unsaved_records(model, association_name, records)
      records.each { |record| add_unsaved_record(model, association_name, record) }
    end

    def find_next_page_url
      next_page_button = page.first(".t-arrow-next")&.first(:xpath, ".//..")
      has_next_page = next_page_button.present? && !next_page_button[:class].include?("t-state-disabled")
      has_next_page ? next_page_button["href"] : nil
    end
  end
end
