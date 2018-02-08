// @flow
import * as React from 'react'
import { createRefetchContainer, graphql } from 'react-relay'
import type { RelayRefetchProp } from 'react-relay'
import styled from 'react-emotion'
import { throttle } from 'lodash'
import { SearchField } from './SearchField'
import { SearchFilters } from './SearchFilters'
import { BillList } from './BillList'
import { LoadingIndicator } from '../LoadingIndicator'
import { mixins } from '@/styles'
import type { Viewer, SearchParams } from '@/types'

type Props = {
  viewer: ?Viewer,
  pageSize?: number,
  params?: SearchParams,
  onChange?: (SearchParams) => void,
  relay: RelayRefetchProp
}

type State = {
  params: SearchParams,
  disablesAnimation: boolean
}

let BillSearch = class BillSearch extends React.Component<*, Props, State> {
  state = {
    params: {
      query: '',
      ...(this.props.params || {})
    },
    disablesAnimation: false
  }

  // actions
  filterBills = throttle((params: SearchParams) => {
    const { onChange, relay } = this.props

    // callback the change handler
    onChange && onChange(params)

    // fetch the bills with updated params
    this.setState({ disablesAnimation: true })
    relay.refetch({ params }, null, (error: ?Error) => {
      if (error) {
        console.error(`error updaing query: ${error.toString()}`)
      }

      // HACK: completion comes back before render
      global.requestAnimationFrame(() => {
        this.setState({ disablesAnimation: false })
      })
    })
  }, 300)

  // events
  didChangeParams = (params) => {
    this.setState({ params })
    this.filterBills(params)
  }

  // lifecycle
  render () {
    const {
      viewer,
      pageSize
    } = this.props

    const {
      params,
      disablesAnimation
    } = this.state

    return (
      <Search>
        <SearchField
          params={params}
          onChange={this.didChangeParams}
        />
        <Body>
          <SearchFilters
            params={params}
            onChange={this.didChangeParams}
          />
          <Bills>
            <LoadingIndicator
              isLoading={!viewer}
            />
            {viewer && (
              <BillList
                viewer={viewer}
                pageSize={pageSize}
                isAnimated={!disablesAnimation}
              />
            )}
          </Bills>
        </Body>
      </Search>
    )
  }
}

BillSearch = createRefetchContainer(BillSearch,
  graphql`
    fragment BillSearch_viewer on Viewer {
      bills(
        params: $params,
        first: $count,
        after: $cursor
      ) @connection(key: "BillSearch_bills") {
        edges {
          node {
            id
          }
        }
      }
      ...BillList_viewer
    }
  `,
  graphql`
    query BillSearchQuery(
      $params: BillsSearchParams!,
      $count: Int!,
      $cursor: String!
    ) {
      viewer {
        ...BillSearch_viewer
      }
    }
  `
)

const Search = styled.div`
  ${mixins.flexColumn};
`

const Body = styled.div`
  ${mixins.pageWidth};
  align-self: center;
`

const Bills = styled.div`
  position: relative;
  margin-top: 40px;
`

export { BillSearch }
