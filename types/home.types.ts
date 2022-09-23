export interface ProductCategory {
  count: number;
  name: string;
  slug: string;
  image: {
    large: string;
    small: string;
  };
  link: string;
  id: number;
  parent: {
    node: {
      name: string;
    };
  };
}

export interface HomeProps {
  productCategories: ProductCategory[];
}
