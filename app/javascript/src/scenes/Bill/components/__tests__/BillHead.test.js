/* eslint-env jest */
import * as React from 'react'
import { shallow } from 'enzyme'
import { defaultsDeep } from 'lodash'
import { addHours } from 'date-fns'
import { BillHead } from '../BillHead'
import { now } from '@/functions'

// subject
let subject

const defaults = {
  bill: {
    documentNumber: 'HB1234',
    title: 'Foo',
    summary: 'A bill, fantastic',
  }
}

function loadSubject (props = {}) {
  subject = shallow(<BillHead {...defaultsDeep(props, defaults)} />)
}

// specs
afterEach(() => {
  subject = null
})

describe('#render', () => {
  it('renders properly', () => {
    loadSubject()
    expect(subject).toMatchSnapshot()
  })
})