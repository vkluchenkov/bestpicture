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
  subtotal(format: RAW)
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

export const APPLY_COUPON = gql`
  mutation ApplyCoupon($code: String!) {
    applyCoupon(input: { code: $code }) {
      ${cartData}
    }
  }
`;

export const REMOVE_COUPONS = gql`
  mutation RemoveCoupons($codes: [String]!) {
    removeCoupons(input: { codes: $codes }) {
      ${cartData}
    }
  }
`;

export const CHECKOUT_MUTATION = gql`
  mutation CheckoutMutation($input: CheckoutInput!) {
    checkout(input: $input) {
      ...CheckoutPayloadFragment
    }
  }

  fragment CheckoutPayloadFragment on CheckoutPayload {
    redirect
    result
    customer {
      id
      sessionToken
    }
    order {
      databaseId
      orderKey
    }
  }
`;
