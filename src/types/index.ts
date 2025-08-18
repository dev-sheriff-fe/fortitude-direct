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

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoggedInUser {
  accountType?: string | null;
  address?: string;
  appMenuList?: any | null;
  appSettingsDto?: any | null;
  appVersion?: string | null;
  branchID?: string;
  branchName?: string;
  businessName?: string;
  ccy?: string;
  country?: string;
  creditWallet?: boolean;
  customerTier?: string | null;
  deviceID?: string;
  email?: string;
  entityCode?: string;
  entityLogo?: string;
  entityName?: string;
  entityStyle?: string | null;
  entityType?: string;
  expiryDate?: string | null;
  externalAccount?: any | null;
  firstname?: string | null;
  forcePwdChange?: string;
  fullname?: string;
  hardTokenOtpValid?: boolean | null;
  language?: string | null;
  lastLoginDate?: string;
  medium?: string | null;
  menuInfoList?: any | null;
  merchantCode?: string;
  merchantGroupCode?: string;
  messageActionDto?: any | null;
  metaData?: any | null;
  mobileNo?: string;
  paymentMethodAllowed?: any | null;
  photoLinks?: any | null;
  pwd?: string;
  referalCode?: string;
  refreshToken?: string | null;
  responseCode?: string;
  responseMessage?: string;
  retryNo?: number;
  softTokenQrCodeLink?: string | null;
  storeCode?: string | null;
  supervisor?: string;
  supervisorPassword?: string | null;
  terminalId?: string;
  ticketID?: string;
  twoFactorLimit?: number;
  twoFactorType?: string;
  userID?: string;
  userPermissionList?: any | null;
  userRole?: string;
  userRoles?: any | null;
  username?: string;
  walletAcc?: string;
  walletBalance?: number;
  walletType?: number;
  twoFaLinked?: string;
}