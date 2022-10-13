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
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { GoogleAnalytics } from 'nextjs-google-analytics';

import * as Sentry from '@sentry/nextjs';

import { backendUrl } from '../utils/constants';
import { setContext } from '@apollo/client/link/context';
import { CartProvider } from '../store/Cart';
import { FlyCart } from '../components/flyCart';

function MyApp({ Component, pageProps, router }: AppProps) {
  const gqlUrl = `${backendUrl}graphql`;

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

  const httpLink = createHttpLink({ uri: gqlUrl });

  const client = new ApolloClient({
    link: ApolloLink.from([afterwareLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
  });

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

  Sentry.init({
    dsn: 'https://8320a69cec5d4dbfad19cb01a07c0989@o1123240.ingest.sentry.io/4503947518345216',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.25,
  });

  const pageUrl = backendUrl + router.route;

  return (
    <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'EUR' }}>
      <ApolloProvider client={client}>
        <CartProvider>
          <GoogleAnalytics trackPageViews />
          <Head>
            <meta charSet='utf-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
            <meta
              name='description'
              content='Dance events videos from videographer Vladimir Kluchenkov'
            />
          </Head>
          <Component {...pageProps} key={pageUrl} />
        </CartProvider>
      </ApolloProvider>
    </PayPalScriptProvider>
  );
}

export default MyApp;
