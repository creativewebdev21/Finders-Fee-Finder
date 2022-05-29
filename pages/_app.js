import '../styles/globals.css'

import { AppWrapper } from '../context/appContext.js'; // import based on where you put it

import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains(
  [chain.mainnet, /* chain.rinkeby, */ /* chain.polygon, chain.optimism, chain.arbitrum */],
  [
    apiProvider.alchemy(process.env.NEXT_PUBLIC_ALCHEMY_ID),
    apiProvider.fallback()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider } from 'wagmi';





function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains} theme={midnightTheme({      
        accentColor: 'white',
        accentColorForeground: 'black',
        borderRadius: "none",
        overlayBlur: 'large',
        fontStack: 'system'
      })}>
          <AppWrapper>
            <Component {...pageProps} />
          </AppWrapper>
        </RainbowKitProvider>
    </WagmiProvider>          
  )
}

export default MyApp
