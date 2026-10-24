import { ToastProvider } from "../contexts/toastContext";
import "./globals.css";
import { RedirectConfirmProvider } from "../contexts/redirectConfirmContext";
import { TanstackQueryProvider } from "./TanstackQueryProvider";
import { AuthProvider } from "../contexts/authContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <TanstackQueryProvider>
            <AuthProvider>
              <RedirectConfirmProvider>{children}</RedirectConfirmProvider>
            </AuthProvider>
          </TanstackQueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
