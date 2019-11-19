import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/storeHook';

export const Products = observer(() => {
  const store = useStore();
  const { cart } = store.checkout;

  return (
    <section className="products">
      <h1 className="main">Shopping cart</h1>
      <ul className="products-list tableHead">
        <li className="products-list-title row">
          <div className="col-product">Product details</div>
          <div className="col-quantity">Quantity</div>
          <div className="col-price">Price</div>
          <div className="col-total">Total</div>
        </li>
      </ul>
      <ul className="products-list">
        {store.availableProducts.map(product => (
          <li key={product.code} className="product row">
            <div className="col-product">
              <figure className="product-image">
                <img src={product.imgSrc} alt={product.name} />
                <div className="product-description">
                  <h1>{product.name}</h1>
                  <p className="product-code">Product code {product.code}</p>
                </div>
              </figure>
            </div>
            <div className="col-quantity">
              <button
                className="count"
                onClick={() => {
                  store.checkout.remove(product.code);
                }}
              >
                -
              </button>
              <input
                type="text"
                className="product-quantity"
                onChange={e => {
                  const parsedValue = parseInt(e.target.value);
                  if (typeof parsedValue == 'number') {
                    store.checkout.setQuantityOf(product.code, parsedValue);
                  }
                }}
                value={cart.get(product.code).quantity}
              />
              <button
                className="count"
                onClick={() => {
                  store.checkout.scan(product.code);
                }}
              >
                +
              </button>
            </div>
            <div className="col-price">
              <span className="product-price">{product.price}</span>
              <span className="product-currency currency">€</span>
            </div>
            <div className="col-total">
              <span className="product-price">{cart.get(product.code).quantity * product.price}</span>
              <span className="product-currency currency">€</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});
