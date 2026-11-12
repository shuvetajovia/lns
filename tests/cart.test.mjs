import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addCartItem,setCartQuantity} from '../src/lib/cart.js';
const product={id:1,name:'Rice',weight:'500g',price:100,stock:3};
test('variants share stock and cart quantity updates use current inventory',()=>{
  let cart=addCartItem([],product,2);
  cart=addCartItem(cart,product,2,{weight:'1kg',price:190});
  assert.equal(cart.reduce((sum,item)=>sum+item.qty,0),3);
  assert.equal(cart[1].qty,1);
  cart=setCartQuantity(cart,[{...product,stock:2}],cart[0].cartId,3);
  assert.equal(cart.reduce((sum,item)=>sum+item.qty,0),2);
  assert.deepEqual(setCartQuantity(cart,[{...product,isOutOfStock:true}],cart[0].cartId,3).filter(item=>item.cartId===cart[0].cartId),[]);
  assert.throws(()=>addCartItem([],product,-1),/positive whole/);
  assert.throws(()=>addCartItem([],{...product,stock:0}),/unavailable/);
});
