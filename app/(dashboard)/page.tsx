export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
  return <div>Welcome Home</div>;
}
