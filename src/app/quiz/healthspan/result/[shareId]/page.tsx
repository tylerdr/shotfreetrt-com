import { redirect } from "next/navigation";

// Old shared-result links encoded a fabricated "TRT candidacy score" and a
// "Roast Me" result presentation. That sharing mechanism is retired and not
// rebuilt: answers now live only in the quiz taker's own browser memory, so
// there is nothing durable to decode or redisplay. This keeps the URL alive
// (no dead link) and sends visitors to a fresh, real quiz instead of a
// fabricated score.
export default async function SharedHealthspanResultRedirectPage() {
  redirect("/quiz/healthspan");
}
