import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portafolio | Keyli Alejandra Arévalo Paz",
  description: "Mi historia, mis aprendizajes y mis metas. Portafolio académico y proyectos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
