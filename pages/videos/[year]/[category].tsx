import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { gql } from '@apollo/client';
import { initializeApollo, addApolloState } from '../../../utils/apolloClient';
import { CategoryProps, Product, ListCategory } from '../../../types/categoryListing.types';
import styles from '../../../styles/Category.module.css';
import { ProductCard } from '../../../components/ProductCard';
import Head from 'next/head';
import { useCart } from '../../../store/Cart';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { truncate } from 'fs';
import { Layout } from '../../../components/Layout';

const Category: NextPage<CategoryProps> = ({ products, categoryName }) => {
  const router = useRouter();
  const { year, category } = router.query;

  const [{ cart, isLoading }, {}] = useCart();

  const [categoryPath, setCategoryPath] = useState<string>('');

  useEffect(() => {
    setCategoryPath(window.location.href.split('#')[0]);
  }, []);

  const productsMap = products.map((p) => {
    const isInCart = cart.contents.nodes.some(
      (cartProduct) => cartProduct.product.node.id === p.id
    );

    return <ProductCard product={p} isInCart={isInCart} key={p.id} categoryPath={categoryPath} />;
  });

  return (
    <Layout>
      <Head>
        <title>
          {(year as string) + ' > '} {categoryName} | bestpicture.pro
        </title>
      </Head>
      <h1 className={styles.title}>{(year as string) + ' > ' + categoryName}</h1>
      <section className={styles.products__section}>
        <ul className={styles.products}>{productsMap}</ul>
      </section>
    </Layout>
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
          id: databaseId
          name
          slug
          menuOrder
          image {
            large: sourceUrl
            small: sourceUrl(size: WOOCOMMERCE_SINGLE)
          }
          ... on SimpleProduct {
            price
          }
        }
      }
    }
  }
  `;

  const { data } = await apolloClient.query({
    query: CATEGORY,
  });

  if (!data.productCategory) {
    return addApolloState(apolloClient, {
      notFound: true,
      revalidate: 30,
    });
  }

  const products = data.productCategory.products.nodes
    .slice()
    .sort((a: Product, b: Product) => a.menuOrder - b.menuOrder);

  return addApolloState(apolloClient, {
    props: { products, categoryName: data.productCategory.name },
    revalidate: 30,
  });
};

export default Category;
