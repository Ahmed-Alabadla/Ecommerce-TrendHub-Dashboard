import Loading from "@/app/loading";
import ProductDetails from "@/components/shared/dashboard/ProductDetails";
import { Suspense } from "react";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <ProductDetails id={id} />
    </Suspense>
  );
}
