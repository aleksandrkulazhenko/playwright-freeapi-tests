export const ProductSchemaForValidationTests = {
  type: 'object',
  properties: {
    _id: { type: 'number' },
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

export const ProductSchemaForProductTests = {
  type: 'object',
  properties: {
    _id: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    price: { type: 'number', minimum: 0 },
    stock: { type: 'number', minimum: 0 },
    category: { type: 'string' },
  },
  required: ['_id', 'name', 'price', 'stock'],
};
