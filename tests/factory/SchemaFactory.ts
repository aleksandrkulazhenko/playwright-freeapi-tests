export const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    price: { type: 'number' },
    description: { type: 'string' },
    stock: { type: 'number' },
    category: { type: 'string' },
    brand: { type: 'string' },
    rating: { type: 'number' },
    discountPercentage: { type: 'number' },
    thumbnail: { type: 'string' },
    images: { type: 'array' },
  },
  required: ['id', 'title', 'price', 'description', 'stock', 'category'],
};
