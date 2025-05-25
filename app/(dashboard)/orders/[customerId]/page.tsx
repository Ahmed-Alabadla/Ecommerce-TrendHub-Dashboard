import { Metadata } from "next";

import OrdersClient from "./OrdersClient";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage and track customer orders",
};

export default async function CartsPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <OrdersClient customerId={customerId} />
    </Suspense>
  );
}
