import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata = {
  title: "BabyTips - Sistema de Administracion Pediatrica",
  description: "Sistema de administracion y control medico pediatrico - BabyTips, Tu Pediatra Con Estilo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
