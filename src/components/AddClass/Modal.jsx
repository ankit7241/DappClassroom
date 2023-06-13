import React, { useState } from 'react';
import { styled } from 'styled-components';
import { toast } from 'react-toastify';

import Button from '../Button';


export default function Modal({ setShowModal, showModal }) {

    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");
    const [teacherName, setTeacherName] = useState("");

    const [code, setCode] = useState("");

    const handleCreate = () => {
        // Write a function to join over here and at after success, write this ---> 
        toast.success('Class created successfully!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setShowModal(false)

        // And if any error occurs, write this --->

        // toast.error('An unexpected error occurred!', {
        //     position: "top-center",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        // });
    }

    const handleJoin = () => {
        // Write a function to join over here and at after success, write this --->
        toast.success('Class created successfully!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setShowModal(false)

        // And if any error occurs, write this --->

        // toast.error('An unexpected error occurred!', {
        //     position: "top-center",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "dark",
        // });
    }

    return (
        <Container onClick={() => setShowModal(false)}>
            <Main onClick={(e) => e.stopPropagation()}>
                <h2>Add class</h2>

                <div>
                    <input
                        type="text"
                        placeholder='Class Name e.g. Computer Science Club'
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Section e.g. H'
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder='Teacher Name e.g. Atharv Varshney'
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                    />
                    <StyledButton onClick={handleCreate}>Create Class</StyledButton>
                </div>

                <Divider><p>OR</p></Divider>

                <div>
                    <input
                        type="text"
                        placeholder='Enter Class Code e.g. 1986598276043'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <StyledButton onClick={handleJoin}>Join Class</StyledButton>
                </div>

            </Main>
        </Container>
    )
}

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    `

const Main = styled.div`
    width: 50%;
    background-color: var(--bg);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 20px 40px;

    padding-bottom: 40px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;

    h2 {
        font-weight: 500;
        font-size: var(--font-xxl);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.90);
    }

    div {
        width: 75%;
        display: flex;
        flex-direction: column;
        gap: 15px;

        input {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 10px 20px;
            gap: 15px;

            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            outline: none;

            font-family: Groteska;
            font-size: var(--font-md);
            line-height: 125%;
            color: rgba(255, 255, 255, 0.80);
        }
    }

    p {
        font-size: var(--font-sm);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.75);
        width: 100%;
        text-align: center;
        position: relative;
        z-index: 3;
    }

`

const Divider = styled.div`
    width: 75%;
    position: relative;
    &::before {
        z-index: 2;
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 4ch;
        height: 100%;
        background-color: var(--bg);
    }
        
    &::after {
        z-index: 1;
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 2px;
        background-color: rgba(255, 255, 255, 0.3);
    }
`
const StyledButton = styled(Button)`
    border-radius: 10px;
    font-weight: 500;
    padding: 10px;
`