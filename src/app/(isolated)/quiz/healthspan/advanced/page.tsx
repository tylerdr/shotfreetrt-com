import { redirect } from "next/navigation";

// The previous "advanced" quiz collected lab values (total/free T, LH, FSH,
// prolactin, TSH, hematocrit, PSA) and scored them into a treatment-path
// recommendation. That is a diagnostic function this site does not perform.
// This URL stays live and redirects into the real, deterministic 6-question
// decision quiz instead of collecting lab values.
export default function AdvancedHealthspanQuizRedirectPage() {
  redirect("/quiz/healthspan");
}
