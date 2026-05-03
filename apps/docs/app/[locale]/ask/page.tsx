import { getTranslations } from "@/lib/translations";
import { AskClient } from "./ask-client";

export default function AskPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = getTranslations(params.locale);
  return (
    <AskClient
      locale={params.locale}
      translations={{
        askTitle: t.askTitle,
        askSubtitle: t.askSubtitle,
        askPlaceholder: t.askPlaceholder,
        askDisclaimer: t.askDisclaimer,
        backToDocs: t.backToDocs,
        aiAssistant: t.aiAssistant,
        docs: t.docs,
        api: t.api,
        askAi: t.askAi,
        suggestions: [
          t.askSuggestion1,
          t.askSuggestion2,
          t.askSuggestion3,
          t.askSuggestion4,
        ],
      }}
    />
  );
}
