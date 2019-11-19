import React, { useContext } from 'react';

const StoreContext = React.createContext();

const Provider = props => {
  const { store } = props;
  return <StoreContext.Provider value={{ store }}>{props.children}</StoreContext.Provider>;
};

const useStore = () => {
  const { store } = useContext(StoreContext);
  return store;
};

export { Provider, useStore };
