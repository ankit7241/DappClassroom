import React, { useState } from 'react';
import { styled } from 'styled-components';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';

import Button from '../../components/Button';

import avatar from "../../assets/img/placeholder_avatar.png"

export default function Input() {

    const { address } = useAccount()

    const { data: EnsNameData } = useEnsName({
        address: address
    })

    const { data: EnsAvatarData } = useEnsAvatar({
        name: EnsNameData
    })

    const [textInp, setTextInp] = useState("")

    return (
        <Container>
            <img src={EnsAvatarData ? EnsAvatarData : avatar} alt="" />
            <div>
                <textarea
                    type="text"
                    placeholder='Announce something to your class'
                    value={textInp}
                    onChange={(e) => setTextInp(e.target.value)}
                />
                <Button style={{ padding: "7px 20px" }}>Submit</Button>
            </div>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px 20px;
    gap: 15px;

    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;

    img {
        width: 35px;
        height: 35px;
    }

    div {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: right;
        gap: 10px;
    }

    textarea {
        font-family: Groteska;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.90);
        width: 100%;
        border: none;
        outline: none;
        background-color: transparent;
        height: 20px;
        resize: none;
        transition: all 0.1s linear;
        
        &::-webkit-scrollbar {
            width: 12px;
        }

        &::-webkit-scrollbar-track {
            border-radius: 10px;
            border: 0.5px solid rgba(255, 255, 255, 0.3);
        }
            
        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2); 
            border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3); 
        }
    }

    textarea:focus {
        min-height: 70px;
        resize: vertical;
    }

    textarea:focus ~ button {
        display: block;
    }

    button {
        display: none;
    }
`