import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import './css/main.css';

import { Provider } from './hooks/storeHook';
import storeInstance from './rootStore';

ReactDOM.render(
  <Provider store={storeInstance}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
