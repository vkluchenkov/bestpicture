import Image from 'next/image';
import { CategoryCardProps } from '../../types/categoryCard.types';
import styles from './categoryCard.module.css';

export const CategoryCard: React.FC<CategoryCardProps> = ({ productCategory }) => {
  const videos = () => {
    if (productCategory.count == 1) return '1 video';
    else return `${productCategory.count} videos`;
  };

  return (
    <div className={styles.categoryCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={productCategory.image.small}
          alt={productCategory.name}
          layout='fill'
          objectFit='cover'
          objectPosition='center'
        />
      </div>
      <h2 className={styles.title}>{productCategory.name}</h2>
      <p className={styles.count}>{videos()}</p>
    </div>
  );
};
