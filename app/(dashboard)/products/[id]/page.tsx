import ProductDetails from "@/components/shared/dashboard/ProductDetails";

export default function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductDetails id={params.id} />;
}
