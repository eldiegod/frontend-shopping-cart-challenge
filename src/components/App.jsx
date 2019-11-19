import React from 'react';
import { observer } from 'mobx-react-lite';

import { Products } from './Products';
import { OrderSummary } from './OrderSummary';

export const App = observer(() => {
  return (
    <div id="root">
      <main className="App">
        <Products></Products>
        <OrderSummary></OrderSummary>
      </main>
    </div>
  );
});
