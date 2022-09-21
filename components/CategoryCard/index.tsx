import Image from 'next/image';
import Link from 'next/link';
import { CategoryCardProps } from '../../types/categoryCard.types';
import { backendUrl } from '../../utils/constants';
import styles from './categoryCard.module.css';

export const CategoryCard: React.FC<CategoryCardProps> = ({ productCategory, isLarge }) => {
  const videos = productCategory.count == 1 ? '1 video' : `${productCategory.count} videos`;
  const url = productCategory.link.replace(`${backendUrl}product-category`, 'videos');

  return (
    <Link href={url}>
      <div
        className={
          isLarge ? styles.categoryCard + ' ' + styles.categoryCard_large : styles.categoryCard
        }
      >
        <div
          className={
            isLarge ? styles.imageWrapper + ' ' + styles.imageWrapper_large : styles.imageWrapper
          }
        >
          <Image
            src={productCategory.image.small}
            alt={productCategory.name}
            layout='fill'
            objectFit='cover'
            objectPosition='center'
            className={styles.image}
            priority={isLarge}
          />
        </div>
        <h2 className={isLarge ? styles.title + ' ' + styles.title_large : styles.title}>
          {productCategory.name}
        </h2>
        <p className={isLarge ? styles.count + ' ' + styles.count_large : styles.count}>{videos}</p>
      </div>
    </Link>
  );
};
