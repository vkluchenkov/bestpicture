import type { GetStaticProps, NextPage } from 'next';
import { client } from '../api';
import { gql } from '@apollo/client';
import styles from '../styles/Home.module.css';
import Head from 'next/head';

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
import Link from 'next/link';

const Home: NextPage<HomeProps> = ({ productCategories }) => {
  const [CardsQty, setCardsQty] = useState(INITIAL_CARDS_SMALL);

  const handleResize = () => {
    if (window.innerWidth < WINDOW_SIZE_MEDIUM) {
      setCardsQty(INITIAL_CARDS_SMALL);
    }
    if (window.innerWidth >= WINDOW_SIZE_MEDIUM && window.innerWidth < WINDOW_SIZE_LARGE) {
      setCardsQty(INITIAL_CARDS_MEDIUM);
    }
    if (window.innerWidth >= WINDOW_SIZE_LARGE && window.innerWidth < WINDOW_SIZE_EXTRALARGE) {
      setCardsQty(INITIAL_CARDS_LARGE);
    }
    if (window.innerWidth >= WINDOW_SIZE_EXTRALARGE) {
      setCardsQty(INITIAL_CARDS_EXTRALARGE);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categoryCards = productCategories.map((c, index) => {
    if (index <= CardsQty - 1) return <CategoryCard productCategory={c} key={c.id} />;
  });

  return (
    <>
      <h1 className={styles.title}>Latest events</h1>
      <div className={styles.cardsContainer}>{categoryCards}</div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const CATEGORIES = gql`
    query getCategories {
      productCategories(where: { childless: true, orderby: TERM_ORDER, order: DESC }) {
        nodes {
          count
          name
          slug
          image {
            large: sourceUrl(size: MEDIUM)
            small: sourceUrl(size: WOOCOMMERCE_SINGLE)
          }
          link
          id
        }
      }
    }
  `;

  const { data } = await client.query({
    query: CATEGORIES,
  });

  const productCategories: ProductCategory[] = data.productCategories.nodes;

  return { props: { productCategories }, revalidate: 30 };
};

export default Home;
