import { Coupon } from "./coupon";
import { Product } from "./product";
import { User } from "./user";

export interface CartItem {
  id: number;
  quantity: number;
  color: string | null;
  createAt: string;
  updatedAt: string;
  product: Product;
  cart: Cart;
}

export interface Cart {
  id: number;
  totalPrice: number;
  totalPriceAfterDiscount: number | null;
  createAt: string;
  updatedAt: string;
  cartItems: CartItem[];
  coupon: Coupon | null;
  user: User;
}
