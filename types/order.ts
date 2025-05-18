import { Product } from "./product";
import { User } from "./user";

export interface OrderItem {
  id: number;
  quantity: number;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
  order: Order;
}

export interface Order {
  id: number;
  orderNumber: string;
  shippingPrice: number;
  taxPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  shippingAddress: string;
  stripeCheckoutId: string;
  status: "pending" | "paid" | "cancelled" | "failed";
  createdAt: Date;
  updatedAt: Date;
  user: User;
  orderItems: OrderItem[];
}
