import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_LANGUAGE = "en";
const LANGUAGES = ["en", "bg"] as const;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathLocale = LANGUAGES.find(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathLocale) {
    const url = new URL(`/${DEFAULT_LANGUAGE}${pathname}`, request.url);
    return NextResponse.rewrite(url);
  }

  if (pathLocale === DEFAULT_LANGUAGE) {
    const stripped = pathname.slice(`/${pathLocale}`.length) || "/";
    return NextResponse.redirect(new URL(stripped, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|llms.txt|assets).*)",
  ],
};
