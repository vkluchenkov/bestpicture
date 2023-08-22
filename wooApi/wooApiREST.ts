import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

console.log(process.env.WC_CONSUMER_KEY);

export const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: 'wc/v3',
});
