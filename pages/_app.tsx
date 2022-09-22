import '../styles/vendor/fonts/inter.css';
import '../styles/vendor/normalize.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>bestpicture.pro</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='Dance events videos from videographer Vladimir Kluchenkov'
        />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
