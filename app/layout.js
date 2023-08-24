import "./globals.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "reactjs-popup/dist/index.css";
import Header from "../components/server/Header";
import { Providers } from "./providers";

export const metadata = {
  title: "Eltat",
  description: "eltat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-500">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
