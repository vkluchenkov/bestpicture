import type { GetStaticProps, NextPage } from 'next';
import { gql } from '@apollo/client';
import Head from 'next/head';
import Image from 'next/image';
import { client } from '../api';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';

interface ProductCategory {
  count: number;
  name: string;
  slig: String;
  image: {
    large: string;
    small: string;
  };
}

interface HomeProps {
  productCategories: ProductCategory[];
}

const Home: NextPage<HomeProps> = ({ productCategories }) => {
  useEffect(() => {
    if (productCategories) console.log(productCategories);
  }, [productCategories]);

  return <></>;
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
        }
      }
    }
  `;

  const { data } = await client.query({
    query: CATEGORIES,
  });

  const productCategories = data.productCategories.nodes;

  return { props: { productCategories }, revalidate: 30 };
};

export default Home;
