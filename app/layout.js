import "./globals.css";
import AppLayout from "@/components/AppLayout";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "BabyTips - Sistema de Administracion Pediatrica",
  description: "Sistema de administracion y control medico pediatrico - BabyTips, Tu Pediatra Con Estilo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
