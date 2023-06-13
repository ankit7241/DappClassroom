import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useEnsName, useEnsAvatar } from 'wagmi'

import Leave from "../assets/img/leave.svg";
import Notebook from "../assets/img/notebook.svg";

export default function HomeCard({ _data }) {

    const { data: EnsNameData } = useEnsName({
        address: _data?.teacherAddress,
        chainId: 5
    })

    const shortenAddress = (address, place) => {
        return (address.slice(0, place) + "..." + address.slice(-place))
    }

    return (
        <Container>

            <Top>
                <Link to={`/class/${_data.id}`}>
                    <h2>{_data.className}</h2>
                </Link>
                <h4>{_data.section}</h4>
                <p>
                    {
                        EnsNameData
                            ? <>{_data.teacherName} <span title={_data.teacherAddress}>({EnsNameData})</span></>
                            : <>{_data.teacherName} <span title={_data.teacherAddress}>({shortenAddress(_data.teacherAddress, 4)})</span></>
                    }
                </p>
            </Top>
            <Middle>
                {
                    (!_data.assignments || _data.assignments.length === 0)
                        ? <p>No work pending :)</p>
                        : <>
                            {_data?.assignments.map((item, ind) => {
                                if (ind < 2) {
                                    return (
                                        <div key={ind}>
                                            <p>Due {new Date(parseInt(item.deadline)).toLocaleString('default', { day: "numeric", month: 'long' })}</p>
                                            <h4>{item.name.length > 27 ? item.name.slice(0, 27) + "..." : item.name}</h4>
                                        </div>
                                    )
                                }
                            })}
                            <StyledLink to={`/class/${_data.id}`}>View All →</StyledLink>
                        </>
                }
            </Middle>
            <Bottom>
                <div><img src={Leave} alt="" /></div>
                <div><Link to={`/class/${_data.id}/1`}><img src={Notebook} alt="" /></Link></div>
            </Bottom>

        </Container >
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

        &:hover{
            text-decoration: underline;
        }
    }
    h4 {
        font-weight: 200;
        font-size: var(--font-sm);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.66);
    }
    p {
        display: flex;
        gap: 5px;

        font-weight: 300;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.75);

        span {
            font-size: var(--font-sm);
            color: rgba(255, 255, 255, 0.5);
        }
    }
`

const Middle = styled.div`
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 10px;

    width: 100%;
    height: 100%;

    & > p {  
        font-weight: 300;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.5);
        margin: auto;
    }

    & > div {
        display: flex;
        flex-direction: column;
        padding: 0px 5px;
        gap: 3px;
        cursor: pointer;
        width: 100%;
        flex: 1;

        p {
            font-weight: 300;
            font-size: var(--font-sm);
            line-height: 125%;
            color: rgba(255, 255, 255, 0.5);
        }
        h4 {
            font-weight: 300;
            font-size: var(--font-md);
            line-height: 125%;
            color: rgba(255, 255, 255, 0.75);
            transition: all 0.15s linear;
        }
        
        &:hover > h4 {
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
        }
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

const StyledLink = styled(Link)`
    font-weight: 300;
    font-size: var(--font-sm);
    line-height: 125%;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.15s linear;
    
    &:hover{
        font-weight: 400;
        color: rgba(255, 255, 255, 0.75);
    }
`