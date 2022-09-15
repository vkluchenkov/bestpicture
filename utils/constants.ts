interface Menu {
  name: string;
  link: string;
}

// TMP menu
export const menu: Menu[] = [
  {
    name: '2022',
    link: '/2022',
  },
  {
    name: '2021',
    link: '/2021',
  },
  {
    name: '2020',
    link: '/2020',
  },
  {
    name: 'Older events',
    link: '/older',
  },
];

// screen sizes for # of cards calculation
export const WINDOW_SIZE_MEDIUM = 768;
export const WINDOW_SIZE_LARGE = 1024;
export const WINDOW_SIZE_EXTRALARGE = 1028;

// # of cards for different screen sizes
export const INITIAL_CARDS_SMALL = 6;
export const INITIAL_CARDS_MEDIUM = 7;
export const INITIAL_CARDS_LARGE = 8;
export const INITIAL_CARDS_EXTRALARGE = 10;
