import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyntheticData Studio",
  description: "Medical AI Data Synthesis Platform",
};

import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import PipelineStepper from "@/components/PipelineStepper";
import HelpTray from "@/components/docs/HelpTray";
import GuidedTutorial from "@/components/docs/GuidedTutorial";
import { HelpCircle } from "lucide-react";
import { useMedicalStore } from "@/store/useMedicalStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isHelpTrayOpen, setHelpTrayOpen } = useMedicalStore();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-medical-bg`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <header className="flex justify-between items-center">
                <Breadcrumbs />
                <PipelineStepper />
              </header>
              {children}
            </div>
          </main>

          <HelpTray />
          <GuidedTutorial />

          {/* Global Help Toggle */}
          <button 
            onClick={() => setHelpTrayOpen(!isHelpTrayOpen)}
            className="fixed bottom-8 right-8 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-black hover:scale-110 transition-all z-[90] active:scale-95 group overflow-hidden pointer-events-auto"
          >
             <div className="relative z-10 flex items-center gap-3">
                <HelpCircle className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] w-0 group-hover:w-16 transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap overflow-hidden">Ask AI</span>
             </div>
             <div className="absolute top-0 right-0 w-12 h-12 bg-medical-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </body>
    </html>
  );
}
