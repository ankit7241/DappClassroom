import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { styled } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from './pages/Home';
import Class from './pages/Class';
import Error404 from './pages/Error404';



export default function App() {

    const AppendHeader = ({ Comp }) => {
        return (
            <>
                <Header />
                <Comp />
            </>
        )
    }
    const AppendFooter = ({ Comp }) => {
        return (
            <>
                <Comp />
                <Footer />
            </>
        )
    }
    const AppendHeaderFooter = ({ Comp }) => {
        return (
            <>
                <Header />
                <Comp />
                <Footer />
            </>
        )
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <AppendHeaderFooter Comp={Home} />,
        },
        {
            path: "/class/:classId",
            element: <AppendFooter Comp={Class} />,
        },
        {
            path: "/class/:classId/:tab",
            element: <AppendFooter Comp={Class} />,
        },
        {
            path: "*",
            element: <Error404 />,
        },
    ]);

    return (
        <Container>

            <ToastContainer />

            <RouterProvider router={router} />

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
