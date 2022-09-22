import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { initializeApollo, addApolloState } from '../../../utils/apolloClient';
import { CategoryProps, Product, ListCategory } from '../../../types/categoryListing.types';
import styles from '../../../styles/Category.module.css';
import { ProductCard } from '../../../components/ProductCard';
import Head from 'next/head';

const Category: NextPage<CategoryProps> = ({ products, categoryName }) => {
  const router = useRouter();

  const productsMap = products.map((p) => <ProductCard product={p} key={p.id} />);

  if (router.isFallback) return <div>Is Loading</div>;

  return (
    <>
      <Head>
        <title>{categoryName} | bestpicture.pro</title>
      </Head>
      <h1 className={styles.title}>{categoryName}</h1>
      <section className={styles.products__section}>
        <ul className={styles.products}>{productsMap}</ul>
      </section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const CATEGORIES = gql`
    query getCategoriesList {
      productCategories(where: { childless: true }, first: 10000) {
        nodes {
          slug
          parent {
            node {
              slug
            }
          }
        }
      }
    }
  `;

  const { data } = await apolloClient.query({
    query: CATEGORIES,
  });

  const paths = data.productCategories.nodes.map((c: ListCategory) => {
    return {
      params: {
        category: c.slug,
        year: c.parent.node.slug,
      },
    };
  });

  return addApolloState(apolloClient, {
    paths,
    fallback: 'blocking',
  });
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  const CATEGORY = gql`
  query getCategory {
    productCategory(id: "${params!.category}", idType: SLUG) {
      count
      name
      products(first: 1000) {
        nodes {
          id
          name
          slug
          menuOrder
          image {
            large: sourceUrl
            small: sourceUrl(size: WOOCOMMERCE_SINGLE)
          }
          ... on SimpleProduct {
            price(format: RAW)
          }
        }
      }
    }
  }
  `;

  const { data } = await apolloClient.query({
    query: CATEGORY,
  });

  const products = data.productCategory.products.nodes
    .slice()
    .sort((a: Product, b: Product) => a.menuOrder - b.menuOrder);

  return addApolloState(apolloClient, {
    props: { products, categoryName: data.productCategory.name },
    revalidate: 30,
  });
};

export default Category;
