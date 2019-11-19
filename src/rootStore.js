import { types, onSnapshot } from 'mobx-state-tree';

const Product = types
  .model('Product', {
    name: types.string,
    imgSrc: types.string,
    code: types.identifier,
    price: types.number,
    quantity: types.optional(types.integer, 0),
  })
  .volatile(self => ({
    pricingRule: (quantity, price) => ({ itemTotal: quantity * price, itemDiscount: 0 }),
  }))
  .views(self => ({
    get totalWithoutDiscount() {
      return self.price * self.quantity;
    },
    get total() {
      return self.pricingRule(self.quantity, self.price).itemTotal;
    },
    get discount() {
      return self.pricingRule(self.quantity, self.price).itemDiscount;
    },
  }))
  .actions(self => ({
    setPricingRule: (pricingRule = self.pricingRule) => {
      self.pricingRule = pricingRule;
    },
  }));

const Checkout = types
  .model('Checkout', {
    cart: types.map(Product),
  })
  .views(self => ({
    get totalWithoutDiscount() {
      const totalCost = Array.from(self.cart.values()).reduce(
        (acc, product) => acc + product.totalWithoutDiscount,
        0,
      );
      return totalCost;
    },
    get totalCost() {
      const totalCost = Array.from(self.cart.values()).reduce((acc, product) => acc + product.total, 0);
      console.log(totalCost);
      return totalCost;
    },
    get totalItems() {
      return Array.from(self.cart.values()).reduce((acc, product) => acc + product.quantity, 0);
    },
    // total amount of cash saved from the applied discount on the item
    totalAmountSavedForItem(itemCode) {
      return self.cart.get(itemCode).discount;
    },
  }))
  .actions(self => ({
    // used for initial setup of the cart
    setProducts(products = []) {
      products.forEach(product => {
        self.cart.set(product.code, product);
      });
    },
    setDiscountRules(discountRules) {
      discountRules.forEach(discountRule => {
        self.cart.get(discountRule.itemCode).setPricingRule(discountRule.pricingRule);
      });
    },
    // sets all items quantities to 0
    clear() {
      Array.from(self.cart.keys()).forEach(productName => {
        self.setQuantityOf(productName, 0);
      });
    },
    scan(code) {
      const product = self.cart.get(code);
      if (product) {
        self.cart.set(code, { ...product, quantity: product.quantity + 1 });
      }
    },
    setQuantityOf(code, quantity = 1) {
      const product = self.cart.get(code);
      if (product) {
        self.cart.set(code, { ...product, quantity });
      }
    },
    remove(code) {
      const product = self.cart.get(code);
      // don't allow negative quantities
      if (product && product.quantity > 0) {
        self.cart.set(code, { ...product, quantity: product.quantity - 1 });
      }
    },
    finalize() {
      window.alert('Your order was proccessed successfully.');
      self.clear();
    },
  }));

export const RootStore = types
  .model('RootStore', {
    availableProducts: types.array(Product),
    checkout: Checkout,
  })
  .actions(self => ({}));

const availableProducts = [
  { name: 'Cabify Shirt', imgSrc: 'img/shirt.png', code: 'TSHIRT', price: 20 },
  { name: 'Cabify Mug', imgSrc: 'img/mug.png', code: 'MUG', price: 7.5 },
  { name: 'Cabify Cap', imgSrc: 'img/cap.png', code: 'CAP', price: 10 },
];

const discountRules = [
  {
    itemCode: 'CAP',
    // 2-for-1 for any amount of the same items
    pricingRule: (amount, price) => {
      const itemTotal = (Math.floor(amount / 2) + (amount % 2)) * price;
      const itemDiscount = amount * price - itemTotal;
      return { itemTotal, itemDiscount };
    },
    // 2-for-1 that can only be applied once per itemCode per order
    // pricingRule: (amount, price) => {
    //   const itemTotal = (amount > 1 ? amount - 1 : amount) * price;
    //   const itemDiscount = amount * price - itemTotal;
    //   return { itemTotal, itemDiscount };
    // },
  },
  {
    itemCode: 'TSHIRT',
    //bulk discounts: buying x or more of a product, the price of that product is reduced
    pricingRule: (amount, price) => {
      const priceReduction = 1;
      const numberOfItemsNeededForDiscount = 3;
      const itemTotal = amount * (amount >= numberOfItemsNeededForDiscount ? price - priceReduction : price);
      const itemDiscount = amount * price - itemTotal;
      return { itemTotal, itemDiscount };
    },
  },
];

const initialSnapshot = {
  availableProducts,
  checkout: {
    cart: {},
  },
};

const storeInstance = RootStore.create(initialSnapshot);

// set up the cart with *cero* of each available item
storeInstance.checkout.setProducts(
  availableProducts.map(product => {
    return { ...product, quantity: 0 };
  }),
);

// set up the Pricing Rules that grant discounts on purchases
storeInstance.checkout.setDiscountRules(discountRules);

// logs every state update for debuging purposes
onSnapshot(storeInstance, newSnapshot => {
  console.dir(newSnapshot);
});

export default storeInstance;
