import React, { useState } from 'react';
import { styled } from 'styled-components';
// import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';

import Button from '../../components/Button';

import avatar from "../../assets/img/placeholder_avatar.png"

export default function Message({ data }) {

    // const { data: EnsNameData } = useEnsName({
    //     address: data.from,
    //     chainId: 5
    // })

    // const { data: EnsAvatarData } = useEnsAvatar({
    //     name: data.from,
    //     chainId: 5
    // })

    const shortenAddress = (address, place) => {
        return (address.slice(0, place) + "..." + address.slice(-place))
    }

    const [textInp, setTextInp] = useState("")

    return (
        <Container>
            <Top>
                {/* <img src={EnsAvatarData ? EnsAvatarData : avatar} alt="" /> */}
                <img src={avatar} alt="" />
                <div>
                    <p>{
                        // EnsNameData
                        //     ? <>{data.fromName} <span title={data.from}>({EnsNameData})</span></>
                        //     : <>{data.fromName} <span title={data.from}>({shortenAddress(data.from, 4)})</span></>
                        <>{data.fromName} <span title={data.from}>({shortenAddress(data.from, 4)})</span></>
                    }</p>
                    <p>{new Date(parseInt(data.timestamp)).toLocaleTimeString("en-us", { hour: "2-digit", minute: "2-digit" })} {new Date(parseInt(data.timestamp)).toLocaleString('default', { day: "numeric", month: 'long' })}</p>
                </div>
            </Top>
            <p>{data.message}</p>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 15px 20px;
    gap: 30px;

    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;

    & > p {
        font-weight: 300;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.75);
        white-space: pre-wrap;
        cursor: default;
    }
`

const Top = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;

    img {
        width: 35px;
        height: 35px;
    }

    & > div {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    & > div > p:nth-child(1) {
        font-weight: 300;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.66);

        span {
            font-size: var(--font-sm);
            color: rgba(255, 255, 255, 0.5);
        }
    }

    & > div > p:nth-child(2) {
        font-weight: 300;
        font-size: var(--font-sm);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.33);
    }
`