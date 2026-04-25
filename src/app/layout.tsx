import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Engineer OS | Elite Growth Platform",
  description: "The personal operating system for elite engineers. Track skills, build evidence, and compound your career value.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable}`}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div style={{ 
            flex: 1, 
            marginLeft: 'var(--sidebar-width)', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <Header />
            <main style={{ padding: '32px', flex: 1 }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
