/**
 * @flow
 * @relayHash d675cab6716ce2e0ca1c29a9dcb282ee
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type homeRouteQueryResponse = {|
  +viewer: ?{| |};
|};
*/


/*
query homeRouteQuery(
  $filter: BillsSearchFilter!
  $count: Int!
  $cursor: String!
) {
  viewer {
    ...HomeScene_viewer
    id
  }
}

fragment HomeScene_viewer on Viewer {
  ...BillSearch_viewer
}

fragment BillSearch_viewer on Viewer {
  bills(filter: $filter, first: $count, after: $cursor) {
    edges {
      node {
        id
      }
    }
  }
  ...BillList_viewer
}

fragment BillList_viewer on Viewer {
  bills(filter: $filter, first: $count, after: $cursor) {
    count
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        __typename
        id
        ...BillCell_bill
      }
      cursor
    }
  }
}

fragment BillCell_bill on Bill {
  id
  documentNumber
  title
  summary
  updatedAt
  hearing {
    date
    id
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "filter",
        "type": "BillsSearchFilter!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "count",
        "type": "Int!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cursor",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "homeRouteQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "HomeScene_viewer",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "homeRouteQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "filter",
        "type": "BillsSearchFilter!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "count",
        "type": "Int!",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "cursor",
        "type": "String!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "homeRouteQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "after",
                "variableName": "cursor",
                "type": "String"
              },
              {
                "kind": "Variable",
                "name": "filter",
                "variableName": "filter",
                "type": "BillsSearchFilter"
              },
              {
                "kind": "Variable",
                "name": "first",
                "variableName": "count",
                "type": "Int"
              }
            ],
            "concreteType": "BillsSearch",
            "name": "bills",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "BillEdge",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "Bill",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "__typename",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "id",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "documentNumber",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "title",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "summary",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "updatedAt",
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": null,
                        "concreteType": "Hearing",
                        "name": "hearing",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "args": null,
                            "name": "id",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "count",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "hasNextPage",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "endCursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "after",
                "variableName": "cursor",
                "type": "String"
              },
              {
                "kind": "Variable",
                "name": "filter",
                "variableName": "filter",
                "type": "BillsSearchFilter"
              },
              {
                "kind": "Variable",
                "name": "first",
                "variableName": "count",
                "type": "Int"
              }
            ],
            "handle": "connection",
            "name": "bills",
            "key": "BillList_bills",
            "filters": [
              "filter"
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query homeRouteQuery(\n  $filter: BillsSearchFilter!\n  $count: Int!\n  $cursor: String!\n) {\n  viewer {\n    ...HomeScene_viewer\n    id\n  }\n}\n\nfragment HomeScene_viewer on Viewer {\n  ...BillSearch_viewer\n}\n\nfragment BillSearch_viewer on Viewer {\n  bills(filter: $filter, first: $count, after: $cursor) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n  ...BillList_viewer\n}\n\nfragment BillList_viewer on Viewer {\n  bills(filter: $filter, first: $count, after: $cursor) {\n    count\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      node {\n        __typename\n        id\n        ...BillCell_bill\n      }\n      cursor\n    }\n  }\n}\n\nfragment BillCell_bill on Bill {\n  id\n  documentNumber\n  title\n  summary\n  updatedAt\n  hearing {\n    date\n    id\n  }\n}\n"
};

module.exports = batch;
