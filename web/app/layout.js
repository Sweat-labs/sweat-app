import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "SWEat Web",
  description: "Workout tracker frontend for the SWEat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
