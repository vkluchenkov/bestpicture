import { ApolloClient, InMemoryCache } from "@apollo/client";

const { BACKEND } = process.env;

export const client = new ApolloClient({
  uri: BACKEND,
  cache: new InMemoryCache(),
});
