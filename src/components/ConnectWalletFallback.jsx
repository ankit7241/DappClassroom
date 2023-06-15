import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import { styled } from 'styled-components';


export default function ConnectWalletFallback() {
    return (
        <FallbackCont>
            <p>Please connect your wallet to continue!</p>
            <ConnectWalletButton />
        </FallbackCont>
    )
}

const FallbackCont = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	gap: 30px;
	height: 100%;
    width: 100%;
	flex: 1;

    img {
        height: 200px;
    }

	p {
		font-weight: 400;
		font-size: var(--font-lg);
		line-height: 125%;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.9);
	}

    div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    button {
        padding: 10px 30px;
    }

    button:nth-child(1) {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.75);
    }
`;