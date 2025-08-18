// import BillersPage from '@/pages/billers';
// import { link } from 'fs';

export const Routes = {
  dashboard: '/',
  login: '/login',
  logout: '/logout',
  register: '/register',
  two_fa:'/two_fa',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  adminMyShops: '/my-shops',
  profile: '/profile',
  verifyCoupons: '/coupons/verify',
  settings: '/settings',
  storeSettings: '/vendor/settings',
  storeKeepers: '/vendor/store_keepers',
  profileUpdate: '/profile-update',
  checkout: '/orders/checkout',
  terminalMonitoring: '/terminal_monitoring',
  transaction_type: '/transaction_type',
  create_transaction_type: '/transaction_type/create',
  reconciled_transactions: '/reconciled_transactions',
  ai_chat: '/ai_chat',
  bulk_activity: '/bulk_activity',
  // lending_products: '/lending_products',
  // virtual_account: '/virtual_accounts',
  pos:"/pos",
  pos_orders:'/pos/orders',
  pos_create_product: '/pos/create_product',
  pos_create_category: '/pos/create_category',
  money_transfer: '/money_transfer',
  send_money: '/money_transfer/send_money',
  link: '/admin/rest/src/pages/terminals/link.tsx',
  transfer_master_list: '/transfers',
  save_template: '/messaging_templates/create',
  fetch_templates: '/messaging_templates',
  lookup_data: '/lookup_data',
  create_lookup_data: '/lookup_data/create',
  maker_checker: '/maker_checker',
  bank_dashboard: '/bank-dashboard',
  scoring_template: '/scoring_template',
  generate_api_key: '/generate_api_key',
  // inventories:'/inventories',

  user: {
    ...routesFactory('/users'),
  },
  type: {
    ...routesFactory('/groups'),
  },
  category: {
    ...routesFactory('/categories'),
  },
  attribute: {
    ...routesFactory('/attributes'),
  },
  attributeValue: {
    ...routesFactory('/attribute-values'),
  },
  tag: {
    ...routesFactory('/tags'),
  },
  reviews: {
    ...routesFactory('/reviews'),
  },
  abuseReviews: {
    ...routesFactory('/abusive_reports'),
  },
  abuseReviewsReport: {
    ...routesFactory('/abusive_reports/reject'),
  },
  author: {
    ...routesFactory('/authors'),
  },
  coupon: {
    ...routesFactory('/coupons'),
  },
  manufacturer: {
    ...routesFactory('/manufacturers'),
  },
  order: {
    ...routesFactory('/orders'),
  },
  orderStatus: {
    ...routesFactory('/order-status'),
  },
  orderCreate: {
    ...routesFactory('/orders/create'),
  },
  product: {
    ...routesFactory('/products'),
  },
  report: {
    ...routesFactory('/reports'),
  },
  biller: {
    ...routesFactory('/billers'),
  },
  permissions: {
    ...routesFactory('/permissions'),
  },
  collection: {
    ...routesFactory('/collections'),
  },
  routing_rule: {
    ...routesFactory('/routing_rule'),
  },
  lending_products: {
    ...routesFactory('/lending_products'),
  },
  shop: {
    ...routesFactory('/shops'),
  },
  tax: {
    ...routesFactory('/taxes'),
  },
  shipping: {
    ...routesFactory('/shippings'),
  },
  merchant: {
    ...routesFactory('/merchants'),
  },
  approvals: {
    ...routesFactory('/approvals'),
  },
  terminal: {
    ...routesFactory('/terminals'),
  },
  virtual_account: {
    ...routesFactory('/virtual_accounts'),
  },
  // terminal_monitoring: {
  //   ...routesFactory('/terminal_monitoring'),
  // },
  transaction: {
    ...routesFactory('/transactions'),
  },
  withdraw: {
    ...routesFactory('/withdraws'),
  },
  staff: {
    ...routesFactory('/staffs'),
  },
  refund: {
    ...routesFactory('/refunds'),
  },
  question: {
    ...routesFactory('/questions'),
  },
  inventories: {
    ...routesFactory('/inventories'),
  },
  support: {
    ...routesFactory('/support'),
  },
  
};

function routesFactory(endpoint: string) {
  return {
    list: `${endpoint}`,
    create: `${endpoint}/create`,
    grant: `${endpoint}/grant`,
    editWithoutLang: (slug: string, shop?: string) => {
      return shop
        ? `/${shop}${endpoint}/${slug}/edit`
        : `${endpoint}/${slug}/edit`;
    },
    edit: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/edit`
        : `${language}${endpoint}/${slug}/edit`;
    },
    translate: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/translate`
        : `${language}${endpoint}/${slug}/translate`;
    },
    details: (slug: string) => `${endpoint}/${slug}`,
    editPage: (slug: string) => `${endpoint}/edit/${slug}`,
    products: `${endpoint}/products`,
    categories:`${endpoint}/categories`,
    orders: `${endpoint}/orders`,
    order_tracking: `${endpoint}/order_tracking`,
    create_products:`${endpoint}/create_products`,
    create_categories:`${endpoint}/create_categories`
  };
}
