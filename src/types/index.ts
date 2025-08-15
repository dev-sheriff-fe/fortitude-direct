interface Image {
  id?: number | string;
  thumbnail?: string;
  original?: string;
  file_name?: string;
}

interface Address {
  country?: string;
  city?: string;
  state?: string;
  zip?: string;
  street_address?: string;
}

interface Settings {
  notifications?: {
    email?: string | null;
  };
  contact?: string;
  website?: string;
  location?: any[];
  socials?: any[];
}

interface Profile {
  id?: number;
  avatar?: Image;
  bio?: string;
  socials?: any;
  contact?: string;
  notifications?: any;
  customer_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface Owner {
  id?: number;
  name?: string;
  email?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active?: number;
  shop_id?: number | null;
  email_verified?: boolean;
  profile?: Profile;
}

interface Shop {
  id?: number;
  owner_id?: number;
  name?: string;
  slug?: string;
  description?: string;
  cover_image?: Image;
  logo?: Image;
  is_active?: number;
  address?: Address;
  settings?: Settings;
  notifications?: any;
  created_at?: string;
  updated_at?: string;
  orders_count?: number;
  products_count?: number;
  owner?: Owner;
}

interface Banner {
  id?: number;
  title?: string;
  type_id?: number;
  description?: string;
  image?: Image;
}

interface TypeSettings {
  isHome?: boolean;
  productCard?: string;
  layoutType?: string;
}

interface ProductType {
  id?: number;
  name?: string;
  language?: string;
  translated_languages?: string[];
  slug?: string;
  banners?: Banner[];
  promotional_sliders?: any[];
  settings?: TypeSettings;
  icon?: string;
}

interface CategoryPivot {
  product_id?: number;
  category_id?: number;
}

interface Category {
  id?: number;
  name?: string;
  slug?: string;
  language?: string;
  icon?: string;
  image?: any[];
  details?: any;
  parent?: any;
  type_id?: number;
  deleted_at?: string | null;
  parent_id?: number | null;
  translated_languages?: string[];
  pivot?: CategoryPivot;
}

export interface ProductProps {
  id?: number;
  name?: string;
  slug?: string;
  shop_id?: number;
  type?: ProductType;
  categories?: Category[];
  language?: string;
  translated_languages?: string[];
  product_type?: string;
  shop?: Shop;
  sale_price?: number;
  max_price?: number;
  min_price?: number;
  image?: Image;
  status?: string;
  price?: number;
  quantity?: number;
  unit?: string;
  sku?: string;
  sold_quantity?: number;
  in_flash_sale?: number;
}