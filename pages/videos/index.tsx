import { gql } from '@apollo/client';
import { GetStaticProps, NextPage } from 'next';
import { CategoryCard } from '../../components/CategoryCard';
import { ProductCategory } from '../../types/home.types';
import { addApolloState, initializeApollo } from '../../utils/apolloClient';
import styles from '../../styles/Videos.module.css';
import Head from 'next/head';

interface VideosProps {
  categories: Record<string, ProductCategory[]>;
  parents: string[];
}

const Videos: NextPage<VideosProps> = ({ categories, parents }) => {
  const mapped = parents.map((parent, index) => {
    const cards = categories[parent].map((category) => {
      if (category.name != 'Uncategorized')
        return <CategoryCard productCategory={category} key={category.id} />;
    });

    return (
      <div key={index}>
        <h2 className={styles.title}>Events {parent}</h2>
        <div className={styles.cardsContainer}>{cards}</div>
      </div>
    );
  });
  return (
    <>
      <Head>
        <title>All events | bestpicture.pro</title>
      </Head>
      {mapped}
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  const CATEGORIES = gql`
    query getCategories {
      productCategories(where: { childless: true, orderby: TERM_ORDER, order: DESC }, first: 1000) {
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
  const parents = productCategories.map((c) => c.parent.node.name);
  const uniqueParents = Array.from(new Set(parents)).sort().reverse();

  let sortedCategories: Record<string, ProductCategory[]> = {};

  uniqueParents.forEach((parent) => {
    const filtered = productCategories.filter((category) => category.parent.node.name == parent);
    sortedCategories[parent] = filtered;
  });

  return addApolloState(apolloClient, {
    props: { categories: sortedCategories, parents: uniqueParents },
    revalidate: 30,
  });
};

export default Videos;
