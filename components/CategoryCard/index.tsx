import Image from 'next/image';
import Link from 'next/link';
import { CategoryCardProps } from '../../types/categoryCard.types';
import { backendUrl } from '../../utils/constants';
import styles from './categoryCard.module.css';

export const CategoryCard: React.FC<CategoryCardProps> = ({ productCategory }) => {
  const videos = productCategory.count == 1 ? '1 video' : `${productCategory.count} videos`;
  const url = productCategory.link.replace(`${backendUrl}product-category`, 'videos');

  return (
    <Link href={url}>
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
        <p className={styles.count}>{videos}</p>
      </div>
    </Link>
  );
};
