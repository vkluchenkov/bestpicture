import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { initializeApollo, addApolloState } from '../../../utils/apolloClient';

interface Product {
  id: string;
  name: string;
  slug: string;
  menuOrder: number;
  image: {
    large: string;
    small: string;
  };
}

interface CategoryProps {
  products: Product[];
}

interface ListCategory {
  slug: string;
  parent: {
    node: {
      slug: string;
    };
  };
}

const Category: NextPage<CategoryProps> = ({ products }) => {
  const router = useRouter();
  const { category } = router.query;

  const productsMap = products.map((p) => (
    <div key={p.id}>
      <p>{p.name}</p>
      <p>{p.id}</p>
    </div>
  ));

  return (
    <>
      {category}
      {productsMap}
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

  return addApolloState(apolloClient, { props: { products }, revalidate: 30 });
};

export default Category;
