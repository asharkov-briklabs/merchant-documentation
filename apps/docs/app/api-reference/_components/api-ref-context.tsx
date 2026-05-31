"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Languages offered by the API-reference SDK/language selector. The chosen
 * language drives which request snippet the right-hand code rail shows, the
 * same way docs.stripe.com/api?lang=… does. `id` doubles as the key into an
 * <ApiExample>'s `request` map and as the `?lang=` query value.
 */
export const API_LANGUAGES = [
  { id: "curl", label: "cURL" },
  { id: "node", label: "Node" },
  { id: "python", label: "Python" },
  { id: "ruby", label: "Ruby" },
  { id: "go", label: "Go" },
  { id: "php", label: "PHP" },
] as const;

export type LangId = (typeof API_LANGUAGES)[number]["id"];

const DEFAULT_LANG: LangId = "node";
const STORAGE_KEY = "vinr-api-lang";

function isLangId(v: string | null): v is LangId {
  return !!v && API_LANGUAGES.some((l) => l.id === v);
}

/** A request/response example contributed by an <ApiExample> in the MDX flow. */
export interface ApiSample {
  id: string;
  title: string;
  /** HTTP verb shown in the rail header, e.g. "POST". */
  method?: string;
  /** Endpoint path shown in the rail header, e.g. "/v1/payments". */
  path?: string;
  /** Request snippet per language; the rail falls back to any present one. */
  request: Partial<Record<LangId, string>>;
  /** Response body (language-independent JSON). */
  response?: string;
}

interface ApiRefContextValue {
  lang: LangId;
  setLang: (l: LangId) => void;
  /** Samples in document order. */
  samples: ApiSample[];
  register: (s: ApiSample) => void;
  unregister: (id: string) => void;
  activeId: string | null;
  setActiveId: (id: string) => void;
}

const ApiRefContext = createContext<ApiRefContextValue | null>(null);

export function useApiRef(): ApiRefContextValue {
  const ctx = useContext(ApiRefContext);
  if (!ctx) {
    throw new Error("useApiRef must be used within <ApiRefProvider>");
  }
  return ctx;
}

export function ApiRefProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangId>(DEFAULT_LANG);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Samples are kept in a ref keyed by id (so register/unregister don't churn
  // identity) and mirrored to state in document order for rendering. Document
  // order = the order markers appear in the DOM, recomputed on each change.
  const samplesRef = useRef<Map<string, ApiSample>>(new Map());
  const [samples, setSamples] = useState<ApiSample[]>([]);

  const reorder = useCallback(() => {
    const map = samplesRef.current;
    if (typeof document === "undefined") {
      setSamples(Array.from(map.values()));
      return;
    }
    const ordered = Array.from(
      document.querySelectorAll<HTMLElement>("[data-api-example]"),
    )
      .map((el) => map.get(el.dataset.apiExample ?? ""))
      .filter((s): s is ApiSample => !!s);
    // Fall back to insertion order for any sample whose marker isn't mounted.
    const seen = new Set(ordered.map((s) => s.id));
    for (const s of map.values()) if (!seen.has(s.id)) ordered.push(s);
    setSamples(ordered);
  }, []);

  const register = useCallback(
    (s: ApiSample) => {
      samplesRef.current.set(s.id, s);
      reorder();
      setActiveId((cur) => cur ?? s.id);
    },
    [reorder],
  );

  const unregister = useCallback(
    (id: string) => {
      samplesRef.current.delete(id);
      reorder();
      setActiveId((cur) => (cur === id ? null : cur));
    },
    [reorder],
  );

  // Restore the persisted language and sync to the `?lang=` query param.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLangId(fromUrl)) setLangState(fromUrl);
    else if (isLangId(stored)) setLangState(stored);
  }, []);

  const setLang = useCallback((l: LangId) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", l);
      window.history.replaceState(null, "", url);
    } catch {
      /* storage / history unavailable — non-fatal */
    }
  }, []);

  const value = useMemo<ApiRefContextValue>(
    () => ({
      lang,
      setLang,
      samples,
      register,
      unregister,
      activeId,
      setActiveId,
    }),
    [lang, setLang, samples, register, unregister, activeId],
  );

  return (
    <ApiRefContext.Provider value={value}>{children}</ApiRefContext.Provider>
  );
}
