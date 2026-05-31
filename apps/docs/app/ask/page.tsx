import { getTranslations } from "@/lib/translations";
import { AskClient } from "./ask-client";

export default function AskPage() {
  const t = getTranslations();
  return <AskClient t={t} />;
}
