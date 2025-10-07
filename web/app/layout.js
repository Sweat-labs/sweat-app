import './globals.css';

export const metadata = {
  title: "SWEat Web",
  description: "Workout tracker frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b">
          <div className="mx-auto max-w-4xl p-4 flex items-center gap-4">
            <a href="/" className="text-lg font-semibold text-blue-600">
              SWEat Web
            </a>
            <nav className="text-sm">
              <a href="/" className="mr-4 text-gray-700 hover:text-blue-600">Home</a>
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

