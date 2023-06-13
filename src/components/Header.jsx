import React from 'react';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';

import AddClass from './AddClass';
import ConnectWalletButton from './ConnectWalletButton';

import Logo from "../assets/img/logo_transparent.svg";

export default function Header() {

    return (
        <Container>

            <Link to="/">
                <Branding>
                    <img src={Logo} alt="" />
                    <p>Dapp Classroom</p>
                </Branding>
            </Link>

            <Right>
                <AddClass />

                <ConnectWalletButton />
            </Right>

        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px 75px;
    padding-top: 40px;
`

const Branding = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 15px;

    & > img {
        height: 30px;
    }
    
    & > p {
        font-weight: 200;
        color: #fff;
        font-size: var(--font-xl);
        line-height: 125%;
        text-align: center;
    }
`

const Right = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 40px;

    & > img {
        width: 44px;
        height: 44px;
        background-color: none;
        transition: all 0.2s linear;
        border-radius: 22px;
        cursor: pointer;
    }

    & > img:hover{
        background-color: rgba(255, 255, 255, 0.1);
    }
`