// Quick test to verify the AI Gift API response structure
const { searchRealAmazonProducts } = require('./server/amazon-product-api.ts');

console.log('Testing Amazon Product Search...');

const products = searchRealAmazonProducts('technology', ['Technology']);
console.log('Sample Product:');
console.log({
  title: products[0]?.title,
  image: products[0]?.image,
  price: products[0]?.price,
  affiliateUrl: products[0]?.affiliateUrl
});