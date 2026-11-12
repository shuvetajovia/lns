import { AYURVEDA_PRODUCTS } from '../src/data/products.js';
export const dbProducts = AYURVEDA_PRODUCTS.map(product => ({
  id:product.id,name:product.name,tamil_name:product.tamilName,sanskrit_name:product.sanskritName,
  price:product.price,old_price:product.oldPrice,category:product.category,category_id:product.categoryId,
  image:product.image,gallery:product.gallery || [],weight:product.weight,
  variants:product.variants || [],stock:100,is_out_of_stock:false,
  is_best_seller:product.isBestSeller,description:product.description
}));
export const mockProfile = {id:'00000000-0000-4000-8000-000000000002',full_name:'Test Patron',phone:'9876543210',address:{doorNo:'1',street:'Temple street',pincode:'600001',district:'Chennai'}};
export function dataResponse(url) {
  if (url.includes('/rest/v1/products')) return dbProducts;
  if (url.includes('/rest/v1/areas')) return [{id:1,district:'Chennai',is_active:true}];
  if (url.includes('/rest/v1/profiles')) return mockProfile;
  return [];
}
