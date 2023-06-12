import React from 'react';
import { styled } from 'styled-components';

import Leave from "../assets/img/leave.svg";
import Notebook from "../assets/img/notebook.svg";

export default function HomeCard({ data }) {

    const shortenAddress = (address, place) => {
        return (address.slice(0, place) + "..." + address.slice(-place))
    }

    return (
        <Container>

            <Top>
                <h2>{data.className}</h2>
                <h4>{data.section}</h4>
                <p>{data.teacherName} <span>({shortenAddress(data.teacherAddress, 4)})</span></p>
            </Top>
            <Middle>
                <p>{(!data.assignments || data.assignments.length === 0) && "No work pending :)"}</p>
            </Middle>
            <Bottom>
                <div><img src={Leave} alt="" /></div>
                <div><img src={Notebook} alt="" /></div>
            </Bottom>

        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;

    width: 300px;
    height: 300px;

    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
`

const Top = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 8px;

    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px 10px 0px 0px;

    h2 { 
        font-weight: 400;
        font-size: var(--font-lg);
        line-height: 125%;
        letter-spacing: 0.05em;
        color: rgba(255, 255, 255, 0.90);
    }
    h4 {
        font-weight: 300;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.80);
    }
    p {
        display: flex;
        gap: 5px;

        font-weight: 200;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.66);

        span {
            font-size: var(--font-sm);
            color: rgba(255, 255, 255, 0.5);
        }
    }
`

const Middle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 10px;

    width: 100%;
    height: 100%;

    p {  
        font-weight: 300;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.5);
    }
`

const Bottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 10px 10px;
    gap: 10px;

    width: 100%;

    div {

        img{
            width: 100%;
            height: 100%;
        }

        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        padding: 5px;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
`