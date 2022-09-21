export interface Product {
  id: string;
  name: string;
  slug: string;
  menuOrder: number;
  image: {
    large: string;
    small: string;
  };
}

export interface CategoryProps {
  products: Product[];
}

export interface ListCategory {
  slug: string;
  parent: {
    node: {
      slug: string;
    };
  };
}
