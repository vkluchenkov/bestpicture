import { gql } from '@apollo/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CategoryCard } from '../../components/CategoryCard';
import { ProductCategory } from '../../types/home.types';
import { addApolloState, initializeApollo } from '../../utils/apolloClient';
import styles from '../../styles/Videos.module.css';
import { ListCategory } from '../../types/categoryListing.types';

interface YearProps {
  categories: Record<string, ProductCategory[]>;
}

const Year: NextPage<YearProps> = ({ categories }) => {
  const router = useRouter();
  const { year } = router.query;

  const cards = categories[year as string].map((category) => {
    if (category.name == 'Uncategorized') return <></>;
    return <CategoryCard productCategory={category} key={category.id} />;
  });

  return (
    <>
      <Head>
        <title>Events {year} | bestpicture.pro</title>
      </Head>
      <h2 className={styles.title}>Events {year}</h2>
      <div className={styles.cardsContainer}>{cards}</div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
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
  const uniqueParents = Array.from(new Set(parents));

  const paths = uniqueParents.map((year: string) => {
    return {
      params: {
        year: year,
      },
    };
  });

  return addApolloState(apolloClient, {
    paths,
    fallback: 'blocking',
  });
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
    props: { categories: sortedCategories },
    revalidate: 30,
  });
};

export default Year;
