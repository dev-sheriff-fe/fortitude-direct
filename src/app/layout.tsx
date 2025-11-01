// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Roboto } from "next/font/google";
// import "./globals.css";

// import Providers from "./Provider";

// import { Toaster } from "@/components/ui/sonner";
// import Script from "next/script";
// import { LocationProvider } from "@/components/Providers/location-provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const roboto = Roboto({
//   variable: '--font-roboto',
//   subsets: ['latin']
// })
// export const metadata: Metadata = {
//   title: process.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p'?"Help2Pay":'Fortitude',
//   description: "Revolutionising the e-commerce world",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const accentColor = process.env.NEXT_PUBLIC_ACCENT_COLOR || '#0652e9';
//   const accentForegroundColor = process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR || '#76a2fc';

//   return (
//     <html lang="en">
//       <head>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               (function() {
//                 try {
//                   document.documentElement.style.setProperty('--accent-env', '#${accentColor}');
//                   document.documentElement.style.setProperty('--accent-foreground-env', '#${accentForegroundColor}');
//                 } catch (e) {
//                   console.error('Error setting CSS variables from env:', e);
//                 }
//               })();
//             `,
//           }}
//         />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} ${roboto?.variable} antialiased font-roboto bg-[#f3f4f6]`}
//       >
//         {/* <Script 
//           src="https://cdn.jsdelivr.net/npm/tronweb/dist/TronWeb.js"
//           strategy="beforeInteractive"
//         /> */}
//         <Providers>
//           <LocationProvider autoDetect={true}>
//             {children}
//           </LocationProvider>
//         </Providers>
//         <Toaster/>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";

import Providers from "./Provider";
import { Toaster } from "@/components/ui/sonner";
import { LocationProvider } from "@/components/Providers/location-provider";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "../../wagmi.config";
import { headers } from "next/headers";
import { WalletProvider } from "@txnlab/use-wallet-react";
import AlgorandWalletProvider from "./AlgorandWalletProvider";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

const albertSans = {
  variable: '--font-albert-sans',
  className: 'font-albert-sans',
  style: 'normal',
};

export const metadata: Metadata = {
  title: process.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p' ? "Help2Pay" : 'Fortitude',
  description: "Revolutionising the e-commerce world",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  const accentColor = process.env.NEXT_PUBLIC_ACCENT_COLOR || '0652e9';
  const accentForegroundColor = process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR || '76a2fc';
  
  const selectedFont = process.env.NEXT_PUBLIC_FONT_FAMILY || 'roboto';
  const fontVariable = selectedFont === 'albert-sans' 
    ? albertSans.variable 
    : roboto.variable;
  
  const fontClassName = selectedFont === 'albert-sans' 
    ? 'font-albert-sans' 
    : 'font-roboto';

    const headersList = await headers();
    const initialState = cookieToInitialState(
      getConfig(),
      headersList.get("cookie") ?? ""
    );

  return (
    <html lang="en">
      <head>
        {selectedFont === 'albert-sans' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        )}
        
        <style>{`
          :root {
            --accent-env: #${accentColor};
            --accent-foreground-env: #${accentForegroundColor};
            --selected-font: ${selectedFont};
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontVariable} antialiased ${fontClassName} bg-[#f3f4f6]`}
      >
        <Providers initialState={initialState}>    
          <AlgorandWalletProvider>
            <LocationProvider autoDetect={true}>
            {children}
          </LocationProvider>
          </AlgorandWalletProvider>
        </Providers>
        <Toaster/>
      </body>
    </html>
  )
}