FactoryGirl.define do
  factory :legislator do
    os_id { "ILB0000#{Faker::Number.unique.number(6)}" }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.email }
    phone_number { Faker::PhoneNumber }
    twitter_username { optional { Faker::Twitter.user } }
    district { '6A' }
    chamber { 'upper' }
  end
end