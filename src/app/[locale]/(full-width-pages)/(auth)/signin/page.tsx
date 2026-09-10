import SignInForm from "@/domains/auth/presentation/sign-in-form";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.signIn" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function SignIn() {
  return <SignInForm />;
}
