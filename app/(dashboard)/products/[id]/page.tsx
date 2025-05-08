import ProductDetails from "@/components/shared/dashboard/ProductDetails";

interface Props {
  params: { id: string };
}

export default function ProductDetailsPage({ params }: Props) {
  return <ProductDetails id={params.id} />;
}
