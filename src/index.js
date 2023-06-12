import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { filecoin, filecoinHyperspace, filecoinCalibration } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        filecoin,
        filecoinHyperspace,
        filecoinCalibration,
    ],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: 'Dapp Classroom',
    projectId: 'YOUR_PROJECT_ID',
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
