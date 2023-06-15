import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import HomeIcon from "../../assets/img/home_icon.svg"
import ConnectWalletButton from '../../components/ConnectWalletButton';

export default function Header({ classData, activeTab, setActiveTab }) {

    const navigate = useNavigate();


    return (
        <HeaderContainer>
            <Left>
                <Link to="/">
                    <div>
                        <img src={HomeIcon} alt="" />
                    </div>
                </Link>
                <p>{classData?.className}</p>
            </Left>

            <Middle>
                <div onClick={() => { setActiveTab(0); navigate(`/class/${classData.id}/0`) }}>
                    <p activetab={activeTab === 0 ? "true" : "false"}>Stream</p>
                </div>
                <div onClick={() => { setActiveTab(1); navigate(`/class/${classData.id}/1`) }}>
                    <p activetab={activeTab === 1 ? "true" : "false"}>Assignments</p>
                </div>
                <div onClick={() => { setActiveTab(2); navigate(`/class/${classData.id}/2`) }} >
                    <p activetab={activeTab === 2 ? "true" : "false"}>People</p>
                </div>
            </Middle>

            <Right>
                <ConnectWalletButton />
            </Right>
        </HeaderContainer>
    )
}
const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-center;
    align-items: center;
    padding: 0px 50px;
    padding-top: 40px;
`

const Left = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
    flex: 1;

    & > p {
        font-weight: 200;
        color: #fff;
        font-size: var(--font-lg);
        line-height: 125%;
        text-align: center;
    }

    div {
        img{
            width: 100%;
            height: 100%;
        }

        display: flex;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 35px;
        border-radius: 20px;
        padding: 7px;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
`
const Middle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 50px;
    flex: 1;

    & > div {
        cursor: pointer;
    }

    p {
        font-weight: 300;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.9);
        position: relative;
    }

    p::before{
        content: "";
        position: absolute;
        top: calc(100% + 7px);
        left: -10%;
        width: 120%;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 10px 10px 0px 0px;
    }

    & > div > p[activetab='true']::before {
        background: var(--primary-gradient);
    }
`

const Right = styled.div`
    flex: 1;
    display: flex;
    justify-content: right;
`