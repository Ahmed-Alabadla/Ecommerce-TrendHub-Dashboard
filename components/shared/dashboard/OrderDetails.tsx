import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/order";
import Image from "next/image";

export default function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="max-h-[500px] overflow-y-auto w-full">
      <Table className="w-full rounded-md">
        <TableHeader className="bg-muted/50 ">
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.orderItems.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                      <Image
                        width={32}
                        height={32}
                        src={item.product.imageCover}
                        alt={item.product.name}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {item.product.id}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  $
                  {item.product.priceAfterDiscount &&
                  item.product.priceAfterDiscount > 0
                    ? item.product.priceAfterDiscount
                    : item.product.price}
                </TableCell>
                <TableCell>
                  $
                  {item.product.priceAfterDiscount &&
                  item.product.priceAfterDiscount > 0
                    ? (
                        Number(item.product.priceAfterDiscount) *
                        Number(item.quantity)
                      ).toFixed(2)
                    : (
                        Number(item.product.price) * Number(item.quantity)
                      ).toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow className="border-none">
            <TableCell colSpan={3} className="text-right font-bold">
              Subtotal:
            </TableCell>
            <TableCell className="font-bold">
              $
              {order.totalOrderPrice > 0
                ? (
                    Number(order.totalOrderPrice) -
                    Number(order.shippingPrice) -
                    Number(order.taxPrice)
                  ).toFixed(2)
                : "0.00"}
            </TableCell>
          </TableRow>
          <TableRow className="border-none">
            <TableCell colSpan={3} className="text-right font-bold">
              Shipping:
            </TableCell>
            <TableCell className="font-medium">
              ${order.shippingPrice > 0 ? order.shippingPrice : "0.00"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-bold">
              Tax:
            </TableCell>
            <TableCell className="font-medium">
              ${order.taxPrice > 0 ? order.taxPrice : "0.00"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-bold">
              Total:
            </TableCell>
            <TableCell className="font-bold">
              ${order.totalOrderPrice > 0 ? order.totalOrderPrice : "0.00"}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
