import type { GetStaticProps, NextPage } from 'next';
import { gql } from '@apollo/client';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { initializeApollo, addApolloState } from '../utils/apolloClient';

import { ProductCategory, HomeProps } from '../types/home.types';
import { CategoryCard } from '../components/CategoryCard';

import {
  INITIAL_CARDS_SMALL,
  WINDOW_SIZE_MEDIUM,
  WINDOW_SIZE_LARGE,
  INITIAL_CARDS_MEDIUM,
  WINDOW_SIZE_EXTRALARGE,
  INITIAL_CARDS_LARGE,
  INITIAL_CARDS_EXTRALARGE,
  backendUrl,
} from '../utils/constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../ui-kit/Button';
import { Layout } from '../components/Layout';

const Home: NextPage<HomeProps> = ({ productCategories }) => {
  // tmp
  const wc = process.env.NEXT_PUBLIC_WORDPRESS_URL!;
  console.log(wc);

  const router = useRouter();

  const [cardsQty, setCardsQty] = useState(INITIAL_CARDS_SMALL);
  const [largeCardsQty, setLargeCardsQty] = useState(0);
  const [isLoader, setIsLoader] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < WINDOW_SIZE_MEDIUM) {
      setCardsQty(INITIAL_CARDS_SMALL);
      setLargeCardsQty(0);
    }
    if (window.innerWidth >= WINDOW_SIZE_MEDIUM && window.innerWidth < WINDOW_SIZE_LARGE) {
      setCardsQty(INITIAL_CARDS_MEDIUM);
      setLargeCardsQty(1);
    }
    if (window.innerWidth >= WINDOW_SIZE_LARGE && window.innerWidth < WINDOW_SIZE_EXTRALARGE) {
      setCardsQty(INITIAL_CARDS_LARGE);
      setLargeCardsQty(2);
    }
    if (window.innerWidth >= WINDOW_SIZE_EXTRALARGE) {
      setCardsQty(INITIAL_CARDS_EXTRALARGE);
      setLargeCardsQty(2);
    }
  };

  // Forward email download links to wordpress to handle
  useEffect(() => {
    setIsLoader(true);
    const url = new URL(location.href);
    const isDownload = url.searchParams.get('download_file');
    const redirectUrl = location.href.replace(location.origin, backendUrl.slice(0, -1));
    if (isDownload) window.open(redirectUrl, '_self');
    else setIsLoader(false);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categoryCards = productCategories.map((c, index) => {
    if (index <= cardsQty - 1) {
      if (index <= largeCardsQty - 1)
        return (
          <div className={styles.card__large} key={c.id}>
            <CategoryCard productCategory={c} isLarge />
          </div>
        );
      else
        return (
          <div className={styles.card__small} key={c.id}>
            <CategoryCard productCategory={c} />
          </div>
        );
    }
  });

  return (
    <Layout>
      <Head>
        <title>bestpicture.pro</title>
      </Head>
      <h1 className={styles.title}>Latest events</h1>
      <div className={styles.cardsContainer}>{categoryCards}</div>
      <Button
        type='button'
        isLarge
        className={styles.button}
        onClick={() => router.push('/videos')}
      >
        View all events
      </Button>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  const CATEGORIES = gql`
    query getCategories {
      productCategories(where: { childless: true, orderby: TERM_ORDER, order: DESC }, first: 14) {
        nodes {
          count
          name
          slug
          image {
            large: sourceUrl(size: MEDIUM)
            small: sourceUrl(size: WOOCOMMERCE_SINGLE)
          }
          link
          id: databaseId
          parent {
            node {
              name
            }
          }
        }
      }
    }
  `;

  const { data } = await apolloClient.query({
    query: CATEGORIES,
  });

  const productCategories: ProductCategory[] = data.productCategories.nodes;

  return addApolloState(apolloClient, { props: { productCategories }, revalidate: 30 });
};

export default Home;
