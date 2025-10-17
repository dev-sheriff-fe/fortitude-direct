// wagmi.config.ts
import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import {baseSepolia} from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    // connectors: [
    //   injected({ target: 'metaMask' }), // This will work with MetaMask
    // ],
    connectors:[
      metaMask({
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY!
      })
    ],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}