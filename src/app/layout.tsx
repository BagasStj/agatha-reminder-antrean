import Link from 'next/link';
import './globals.css'; // Pastikan ini diimpor untuk styling

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <ul className="navbar-menu">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/data-display">Data Display</Link></li>
          </ul>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}