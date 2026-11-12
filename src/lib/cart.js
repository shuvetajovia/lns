// Product variants share one product-level stock pool.
export function addCartItem(cart, product, quantity=1, variant=null) {
  const requested=Number(quantity);
  if(!Number.isSafeInteger(requested)||requested<=0) throw new Error('Enter a positive whole quantity.');
  if(product.isOutOfStock || !Number.isSafeInteger(product.stock) || product.stock<=0) throw new Error('This product is unavailable.');
  const weight=variant?.weight || product.weight;
  const cartId=`${product.id}-${weight}`;
  const existing=cart.find(item=>item.cartId===cartId);
  const otherQty=cart.filter(item=>item.id===product.id && item.cartId!==cartId).reduce((sum,item)=>sum+item.qty,0);
  const qty=Math.min((existing?.qty||0)+requested,Math.max(0,product.stock-otherQty));
  if(qty<=0) throw new Error('All available stock is already in your cart.');
  const item={...product,cartId,variantWeight:weight,price:variant?.price??product.price,oldPrice:variant?.oldPrice??product.oldPrice,qty};
  return existing?cart.map(row=>row.cartId===cartId?item:row):[...cart,item];
}
export function setCartQuantity(cart, products, cartId, quantity) {
  if(!Number.isSafeInteger(quantity)||quantity<0) throw new Error('Enter a valid whole quantity.');
  return cart.map(item=>{
    if(item.cartId!==cartId)return item;
    const product=products.find(row=>row.id===item.id);
    const others=cart.filter(row=>row.id===item.id&&row.cartId!==cartId).reduce((sum,row)=>sum+row.qty,0);
    return {...item,qty:Math.min(quantity,Math.max(0,(product?.isOutOfStock?0:product?.stock||0)-others))};
  }).filter(item=>item.qty>0);
}
