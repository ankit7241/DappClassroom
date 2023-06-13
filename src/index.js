import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi';
import { filecoin, filecoinHyperspace, filecoinCalibration, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        filecoin,
        filecoinCalibration,
    ],
    [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_API_KEY }), publicProvider()]
);


const { connectors } = getDefaultWallets({
    appName: 'Dapp Classroom',
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <App />
            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>
);

reportWebVitals();
