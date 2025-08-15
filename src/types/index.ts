export interface ProductProps {
  picture?: string;
  id?: number;
  code?: string;
  category?: string;
  topCategory?: string | null;
  name?: string;
  description?: string;
  qtyInStore?: number;
  costPrice?: number;
  salePrice?: number;
  oldPrice?: number;
  ccy?: string;
  pictureList?: string[];
  color?: string;
  itemSize?: string;
  model?: string | null;
  barCode?: string;
  expiryDate?: string | null;
  unit?: string;
}

export interface Category {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  sector?: string | null;
  logo?: string;
  tags?: string | null;
  topCategory?: string | null;
  qty?: number | null;
}