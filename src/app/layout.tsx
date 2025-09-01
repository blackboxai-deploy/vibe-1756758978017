import './globals.css';

export const metadata = {
  title: 'Notion-like Productivity App',
  description: 'A modern productivity workspace with block-based editing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}