import { redirect } from "next/navigation";

// This URL used to render a "Purchase Complete" page after a Stripe
// checkout (?session_id=...). The purchase flow (BuyButton, /api/checkout)
// was removed this session because the guide's PDF was already public with
// no gate and no Stripe key was ever configured — nothing was actually
// verifying a purchase here. This route stays live as a compatibility
// redirect for old links (including ones carrying a stale session_id) and
// sends visitors to the real, free guide instead of a 404 or a false
// "purchase verified" claim.
export default function LongevityBlueprintSuccessRedirectPage() {
  redirect("/guides/longevity-blueprint");
}
