import { Invitation } from "@/components/Invitation";

/**
 * Home — the entire invitation is one orchestrated client experience:
 * loading → gate ritual → living hero → continuous storybook scroll.
 * Guest personalization comes from `?to=` (read client-side in the Gate).
 */
export default function HomePage() {
  return <Invitation />;
}
