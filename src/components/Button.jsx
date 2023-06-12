import React from 'react'
import { styled } from 'styled-components'

export default function Button(props) {
    return (
        <Btn {...props}>
            {props.children}
        </Btn>
    )
}

const Btn = styled.button`
    font-family: Groteska;
    font-size: var(--font-md);
    line-height: 125%;
    text-align: center;
    color: #000000;

    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 30px;
    background: var(--primary-gradient);
    border-radius: 20px;
    border: none;
    outline: none;
    transition: all 0.2s linear;

    &:hover {
        transform: scale(1.05);
    }
`
