import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutContent } from "@/components/designer/layout/LayoutContent";
import { ModeProvider } from "@/context/ModeContext";
import { NavigatorProvider } from "@/context/NavigatorContext";
import { PagesProvider } from "@/context/PagesContext";
import { AppProvider } from "@/context/AppContext";
import { RouteThemeProvider } from "@/context/RouteThemeProvider";
import { LocaleProvider } from "@/context/LocaleContext";
// import { StagewiseToolbar } from "@stagewise/toolbar-next";
// import ReactPlugin from "@stagewise-plugins/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App Template",
  description: "A clean template for building web applications",
  icons: {
    icon: [
      { url: '/spring/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/spring/favicon.svg', type: 'image/svg+xml' }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/spring/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} bg-[#1E1E1E]`}>
        <RouteThemeProvider>
          <AppProvider>
            <ModeProvider>
              <NavigatorProvider>
                <PagesProvider>
                  <LocaleProvider>
                    <LayoutContent>{children}</LayoutContent>
                  </LocaleProvider>
                </PagesProvider>
              </NavigatorProvider>
            </ModeProvider>
          </AppProvider>
        </RouteThemeProvider>
        {/* <StagewiseToolbar config={{ plugins: [ReactPlugin] }} /> */}
      </body>
    </html>
  );
}
