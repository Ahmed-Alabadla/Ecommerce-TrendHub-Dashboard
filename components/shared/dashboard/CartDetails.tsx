import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItem } from "@/types/cart";
import Image from "next/image";

export default function CartDetails({ cartItems }: { cartItems: CartItem[] }) {
  let totalPrice = 0;

  return (
    <div className="max-h-[500px] overflow-y-auto w-full">
      <Table className="w-full rounded-md">
        <TableHeader className="bg-muted/50 ">
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => {
            totalPrice =
              totalPrice +
              Number(item.product.priceAfterDiscount || item.product.price) *
                Number(item.quantity);
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
                <TableCell>
                  {item.color ? (
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.color}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  $
                  {Number(
                    item.product.priceAfterDiscount || item.product.price
                  ).toFixed(2)}
                </TableCell>
                <TableCell>
                  $
                  {(
                    Number(
                      item.product.priceAfterDiscount || item.product.price
                    ) * Number(item.quantity)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">
              Total:
            </TableCell>
            <TableCell className="font-bold">
              ${totalPrice.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
