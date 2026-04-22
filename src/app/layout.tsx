import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "DECORER - Gestión de Cartera",
  description: "Sistema inteligente para clasificar clientes y enviar recordatorios automáticos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jakarta.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased text-[var(--text-primary)] bg-[var(--bg-base)]">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
