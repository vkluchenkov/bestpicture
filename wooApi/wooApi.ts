import { gql } from '@apollo/client';

export const GET_CART = gql`
  query GetCart {
    cart {
      appliedCoupons {
        code
        description
        discountAmount(format: RAW)
      }
      contents {
        nodes {
          product {
            node {
              ... on SimpleProduct {
                name
                id: databaseId
                price(format: RAW)
              }
            }
          }
          key
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($keys: [ID]) {
    removeItemsFromCart(input: { keys: $keys }) {
      cart {
        appliedCoupons {
          code
          description
          discountAmount(format: RAW)
        }
        contents {
          nodes {
            product {
              node {
                ... on SimpleProduct {
                  name
                  id: databaseId
                  price(format: RAW)
                }
              }
            }
            key
          }
        }
      }
    }
  }
`;
