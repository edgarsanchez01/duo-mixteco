import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations"; // 🧩 Traducción oficial al español
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";

import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#7A2F47", // vino
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        ...esES,
        signUp: {
          ...(esES.signUp ?? {}),
          start: {
            ...(esES.signUp?.start ?? {}),
            subtitle: "",
          },
        },
        signIn: {
          ...(esES.signIn ?? {}),
          start: {
            ...(esES.signIn?.start ?? {}),
            subtitle: "",
          },
        },
      }}
      appearance={{
        layout: {
          logoImageUrl: "/favicon.ico",
        },
        variables: {
          colorPrimary: "#7A2F47",
        },
      }}
    >
      <html lang="es">
        <body className={font.className}>
          <Toaster theme="light" richColors closeButton />
          <ExitModal />
          <HeartsModal />
          <PracticeModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
