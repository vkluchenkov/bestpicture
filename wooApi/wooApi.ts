import { gql } from '@apollo/client';

const cartData = `cart {
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
    itemCount
  }
  total(format: RAW)
}`;

export const GET_CART = gql`
  query GetCart {
    ${cartData}
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($keys: [ID]) {
    removeItemsFromCart(input: { keys: $keys }) {
      ${cartData}
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!) {
    addToCart(input: { productId: $productId }) {
      ${cartData}
    }
  }
`;
