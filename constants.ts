import { Product } from './types';

export const MOCK_BRANDS = ['Nike', 'Adidas', 'Carhartt', 'Ralph Lauren', 'Stussy', 'Arc\'teryx', 'Stone Island'];
export const MOCK_SIZES = ['S', 'M', 'L', 'XL', 'US 9', 'US 10', 'US 8.5'];

// Initial dummy data
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Vintage Nike Spellout Hoodie',
    brand: 'Nike',
    size: 'L',
    price: 15.00,
    currency: 'EUR',
    imageUrl: 'https://picsum.photos/200/200?random=1',
    condition: 'Good',
    timestamp: Date.now() - 10000,
    viewCount: 42,
    isSnipe: true,
  },
  {
    id: '2',
    title: 'Carhartt Double Knee Pants',
    brand: 'Carhartt',
    size: '32x32',
    price: 35.00,
    currency: 'EUR',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    condition: 'Very Good',
    timestamp: Date.now() - 60000,
    viewCount: 12,
    isSnipe: false,
  },
  {
    id: '3',
    title: 'Stussy 8 Ball Tee',
    brand: 'Stussy',
    size: 'M',
    price: 20.00,
    currency: 'EUR',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    condition: 'New',
    timestamp: Date.now() - 120000,
    viewCount: 5,
    isSnipe: true,
  }
];
