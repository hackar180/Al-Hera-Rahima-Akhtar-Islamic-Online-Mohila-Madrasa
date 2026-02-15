
export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: string;
  mrp: number;
  dp: number;
  pv: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export type ViewState = 'home' | 'cart' | 'admin' | 'checkout';
