import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Margem",
  description: "Orientação inicial e caminhos de apoio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
