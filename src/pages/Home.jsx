import React from 'react';
import { styled } from 'styled-components';
import { useAccount } from 'wagmi';

import HomeCard from '../components/HomeCard';
import ConnectWalletButton from '../components/ConnectWalletButton';


export default function Home() {

    const { isConnected } = useAccount();

    const data = { className: "Computer Science Club", section: "Section - H", teacherName: "Atharv Varshney", teacherAddress: "0x4d4DB20DcDc95A2D8B0e8ccB33D235209B15e5Ee", assignments: [], }

    return (
        isConnected
            ? <CardContainer>
                <HomeCard data={data} />
                <HomeCard data={data} />
                <HomeCard data={data} />
                <HomeCard data={data} />
                <HomeCard data={data} />
                <HomeCard data={data} />
                <HomeCard data={data} />
                <HomeCard data={data} />
            </CardContainer>
            : <FallbackCont>
                <p>Please connect your wallet to continue!</p>
                <ConnectWalletButton />
            </FallbackCont>
    )
}



const CardContainer = styled.div`
    margin-top: 75px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 0px 50px;
    gap: 50px;
`

const FallbackCont = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 30px;
    height: 100%;
    flex: 1;

    p {
        font-weight: 400;
        font-size: var(--font-xl);
        line-height: 125%;
        letter-spacing: 0.05em;
        color: rgba(255, 255, 255, 0.90);
    }
`