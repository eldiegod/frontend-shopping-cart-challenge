import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../hooks/storeHook';

export const OrderSummary = observer(() => {
  const store = useStore();

  return (
    <aside className="summary">
      <h1 className="main">Order Summary</h1>
      <ul className="summary-items wrapper border">
        <li>
          <span className="summary-items-number">{store.checkout.totalItems} Items</span>
          <span className="summary-items-price">
            {store.checkout.totalWithoutDiscount}
            <span className="currency">€</span>
          </span>
        </li>
      </ul>
      <div className="summary-discounts wrapper-half border">
        <h2>Discounts</h2>
        <ul>
          <li>
            <span>2x1 CAP offer</span>
            <span>-{store.checkout.totalAmountSavedForItem('CAP')}€</span>
          </li>
          <li>
            <span>x3 Shirt offer</span>
            <span>-{store.checkout.totalAmountSavedForItem('TSHIRT')}€</span>
          </li>
          <li>
            <span>Promo code</span>
            <span>0€</span>
          </li>
        </ul>
      </div>
      <div className="summary-total wrapper">
        <ul>
          <li>
            <span className="summary-total-cost">Total cost</span>
            <span className="summary-total-price">{store.checkout.totalCost}€</span>
          </li>
        </ul>
        <button
          type="submit"
          onClick={() => {
            store.checkout.finalize();
          }}
        >
          Checkout
        </button>
      </div>
    </aside>
  );
});
