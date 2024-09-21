import { useCart } from '../../store/Cart';
import { cropFee } from '../../utils/constants';
import styles from './CartProducts.module.css';

export const CartProducts: React.FC = () => {
  const [{ cart }, { removeProduct }] = useCart();

  const cartProducts = cart.contents.nodes;
  const productList = !cartProducts
    ? []
    : cartProducts.map((p) => {
        const extraData = p.extraData;
        const { id, name, price } = p.product.node;

        const isVertical = extraData.find((d) => d.key === 'is_vertical' && d.value === 'true');
        const isSquare = extraData.find((d) => d.key === 'is_square' && d.value === 'true');
        // const isVertical = { key: 'is_vertical', value: 'true' };
        // const isVertical = undefined;

        const getFinalPrice = () => {
          const productPrice = price ? parseFloat(price.replace('€', '')) : 0;
          if (isVertical && isSquare) {
            return productPrice + cropFee * 2;
          }
          if (isVertical) {
            return productPrice + cropFee;
          }
          if (isSquare) {
            return productPrice + cropFee;
          }
          return productPrice;
        };

        const getLineItemName = () => {
          const lineNamePrice = price ? price : 'FREE';
          if (isVertical || isSquare) {
            return name + ' (' + lineNamePrice + ')';
          }
          return name;
        };

        return (
          <li key={id} className={styles.cartItem}>
            <button
              className={styles.cartItem__remove}
              type='button'
              onClick={() => removeProduct(p.key!)}
            />
            <div className={styles.cartItem__infoWrapper}>
              <div className={styles.cartItem__info}>
                <h3 className={styles.cartItem__title}>{getLineItemName()}</h3>
                {isVertical && (
                  <p className={styles.cartItem__price_crop}>
                    Vertical crop (€{cropFee.toFixed(2)})
                  </p>
                )}
                {isSquare && (
                  <p className={styles.cartItem__price_crop}>Square crop (€{cropFee.toFixed(2)})</p>
                )}
              </div>
              <p className={styles.cartItem__price}>
                {getFinalPrice() === 0 ? 'FREE' : '€' + getFinalPrice().toFixed(2)}
              </p>
            </div>
          </li>
        );
      });

  return <ul className={styles.cartItems}>{productList}</ul>;
};
