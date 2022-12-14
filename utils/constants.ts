interface Menu {
  name: string;
  link: string;
}
// With trailng slash!
export const backendUrl = 'https://wp.bestpicture.pro/';
export const publicUrl = 'https://bestpicture.pro/';

export const wooShopBase = '/videos';

// TMP menu
export const menu: Menu[] = [
  {
    name: '2022',
    link: '/videos/2022',
  },
  {
    name: '2021',
    link: '/videos/2021',
  },
  {
    name: '2020',
    link: '/videos/2020',
  },
  {
    name: 'All events',
    link: '/videos',
  },
];

export const footerMenu: Menu[] = [
  // {
  //   name: 'About the author',
  //   link: '/about',
  // },
  {
    name: 'faq',
    link: '/faq',
  },
  {
    name: 'contact',
    link: '/contact',
  },
];

// screen sizes for # of cards calculation
export const WINDOW_SIZE_MEDIUM = 768;
export const WINDOW_SIZE_LARGE = 1024;
export const WINDOW_SIZE_EXTRALARGE = 1280;

// # of cards for different screen sizes
export const INITIAL_CARDS_SMALL = 7;
export const INITIAL_CARDS_MEDIUM = 7;
export const INITIAL_CARDS_LARGE = 11;
export const INITIAL_CARDS_EXTRALARGE = 14;

// Paypal and Stripe processing fee, %
export const processingFee = 5;
export const minProcessingFee = 1;
