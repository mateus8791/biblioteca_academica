import { redirect } from "next/navigation";

export default function CheckoutIndex() {
  redirect("/checkout/sacola");
  return null;
}
