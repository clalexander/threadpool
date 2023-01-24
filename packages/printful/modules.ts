import ordersModule from './modules/orders';
import productsModule from './modules/products';
import variantsModule from './modules/variants';
import webhooksModule from './modules/webhooks';

const modules = {
  orders: ordersModule,
  products: productsModule,
  variants: variantsModule,
  webhooks: webhooksModule,
};

export default modules;
