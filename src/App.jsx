import React from 'react';
import { styled } from 'styled-components';

import Header from "./components/Header";
import Home from './pages/Home';

export default function App() {

    return (
        <Container>
            <Header />

            <Home />

        </Container>
    )
}


const Container = styled.div`
    width: 100%;
    height: 100%;
    background: var(--bg);
    color: #fff;

    max-width: 100vw;
    overflow-x: hidden;
    min-height: 100vh;
    box-sizing: border-box;
    scroll-behavior: smooth;
    font-family: Groteska;

    display: flex;
    flex-direction: column;
    
`
