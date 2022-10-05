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

const Home: NextPage<HomeProps> = ({ productCategories }) => {
  const router = useRouter();
  const { asPath, isReady } = router;
  const { download_file } = router.query;

  const [cardsQty, setCardsQty] = useState(INITIAL_CARDS_SMALL);
  const [largeCardsQty, setLargeCardsQty] = useState(0);

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

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (download_file && asPath && isReady) window.open(backendUrl + asPath.slice(1), '_self');
  }, [download_file, asPath, isReady]);

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
    <>
      <Head>
        <title>bestpicture.pro</title>
      </Head>
      <h1 className={styles.title}>Latest events</h1>
      <div className={styles.cardsContainer}>{categoryCards}</div>
      <Button
        type='button'
        isLarge
        className={styles.button}
        onClick={() => router.push('/videos/all')}
      >
        View all events
      </Button>
    </>
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
