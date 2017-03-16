class ImportBillDetailsJob < ApplicationJob
  queue_as :default

  rescue_from(Scraper::Task::Error) do |error|
    puts error
  end

  def perform(bill)
    scraper = make_scraper(bill)
    bill_attrs = scraper.run(bill)
    bill.update!(bill_attrs)
  end

  def make_scraper(bill)
    Scraper::BillDetailsTask.new(bill)
  end
end