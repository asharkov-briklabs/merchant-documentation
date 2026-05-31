import { getTranslations } from "@/lib/translations";
import { AskClient } from "./ask-client";

export default function AskPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = getTranslations(params.locale);
  return <AskClient locale={params.locale} t={t} />;
}
