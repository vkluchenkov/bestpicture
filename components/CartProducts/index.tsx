import { useCart } from '../../store/Cart';
import styles from './CartProducts.module.css';

export const CartProducts: React.FC = () => {
  const [{ cart }, { removeProduct }] = useCart();

  const cartProducts = cart.contents.nodes;
  const cartFees = cart.fees;
  console.log(cartFees);
  const productList = !cartProducts
    ? []
    : cartProducts.map((p) => {
        const { id, name, price } = p.product.node;
        return (
          <li key={id} className={styles.cartItem}>
            <button
              className={styles.cartItem__remove}
              type='button'
              onClick={() => removeProduct(p.key!)}
            />
            <div className={styles.cartItem__info}>
              <h3 className={styles.cartItem__title}>{name}</h3>
              <p className={styles.cartItem__price}>{price ? '€' + price : 'FREE'}</p>
            </div>
          </li>
        );
      });

  return <ul className={styles.cartItems}>{productList}</ul>;
};
