import '../styles/vendor/fonts/inter.css';
import '../styles/vendor/normalize.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout';
import Head from 'next/head';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';

import { backendUrl } from '../utils/constants';
import { setContext } from '@apollo/client/link/context';
import { CartProvider } from '../store/Cart';

function MyApp({ Component, pageProps }: AppProps) {
  const url = `${backendUrl}graphql`;

  const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const woocommerceSession = context.response.headers.get('woocommerce-session');
      if (woocommerceSession) localStorage.setItem('wcSession', woocommerceSession);
      return response;
    });
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'woocommerce-session':
          localStorage.wcSession != 'null' ? `Session ${localStorage.wcSession}` : '',
      },
    };
  });

  const httpLink = createHttpLink({ uri: url });

  const client = new ApolloClient({
    link: ApolloLink.from([afterwareLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <Layout>
          <Head>
            <meta charSet='utf-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta
              name='description'
              content='Dance events videos from videographer Vladimir Kluchenkov'
            />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </ApolloProvider>
  );
}

export default MyApp;
