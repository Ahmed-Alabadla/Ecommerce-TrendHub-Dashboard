import ProductDetails from "@/components/shared/dashboard/ProductDetails";

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = params;

  return <ProductDetails id={id} />;
}
