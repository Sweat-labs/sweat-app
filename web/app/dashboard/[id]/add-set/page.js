import AddSetClient from "./AddSetClient";

export default async function Page({ params }) {
  const { id } = await params; // Next.js 15: params is a Promise
  return <AddSetClient id={id} />;
}
