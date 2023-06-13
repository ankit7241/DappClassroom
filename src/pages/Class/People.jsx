import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { toast } from 'react-toastify';

import CopyIcon from "../../assets/img/copy.svg"

import Input from './Input';

export default function People({ classData }) {


    return (
        <Container>

            <Main>
                People
            </Main>


        </Container>
    )
}

const Container = styled.div`
    margin-top: 75px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    flex: 1;

    & > div {
        max-width: 1000px;
    }
`

const Main = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 30px;
`