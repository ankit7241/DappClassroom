import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { toast } from 'react-toastify';

import Button from '../../../components/Button';
import Loading from "../../../components/Loading"

import Modal from "./Modal"

export default function AssignmentDetail({ data, isUserTeacher }) {

    const [showModal, setShowModal] = useState(false);
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitWork = async () => {
        // Enter your function here
        toast.success("Your work is submitted successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    // On toggle of Modal, change the scroll mode of body
    useEffect(() => {
        if (showModal) {
            window.scroll(0, 0)
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "scroll";
        }
    }, [showModal]);



    return (
        <>
            {showModal && <Modal showModal={showModal} setShowModal={setShowModal} />}
            <Container>
                {
                    isLoading
                        ? <Loading />
                        : <div>
                            <Main>
                                <TopDiv>
                                    <h2>{data.name}</h2>
                                    <div>
                                        <p>Maximum Marks: {data.maxMarks}</p>
                                        <p>
                                            Due{" "}
                                            {new Date(parseInt(data.deadline)).toLocaleTimeString("en-us", { hour: "2-digit", minute: "2-digit" })} {new Date(parseInt(data.deadline)).toLocaleString('default', { day: "numeric", month: 'long' })}
                                        </p>
                                    </div>
                                </TopDiv>
                                <DescDiv>
                                    <p>{data.description}</p>
                                </DescDiv>
                                <p>Open Assignment →</p>
                            </Main>
                            <Right>
                                <div>
                                    <h3>Your work</h3>
                                    {
                                        data.assigned
                                            ? <p data-type="grey">Assigned</p>
                                            : data.completed
                                                ? <p data-type="yellow">Submitted</p>
                                                : data.marked
                                                    ? <p data-type="green">{`Scored: ${data.scroredMarks}`}</p>
                                                    : new Date().getTime() > parseInt(data.deadline) && <p data-type="red">Deadline exceeded</p>
                                    }
                                </div>
                                {
                                    data.assigned
                                        ? <>
                                            <input
                                                type="file"
                                                placeholder="Upload assignment file"
                                                accept="image/png, image/jpeg"
                                                onChange={(e) => setAssignmentFile(e.target.files[0])}
                                            />
                                            <Button onClick={async () => { await submitWork() }}>Submit Work</Button>
                                        </>
                                        : <p>Open Your Work →</p>
                                }
                            </Right>
                        </div>
                }

            </Container>
        </>
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
        width: 100%;
        max-width: 1000px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        gap: 50px;
    }
`

const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 50px;
    width: 66%;

    & > p {
        font-size: var(--font-md);
        font-weight: 300;
        line-height: 125%;
        color: rgba(255, 255, 255, 0.66);
        transition: all 0.3s linear;
        cursor: pointer;

        &:hover {
            /* transform: scale(1.1); */
            color: rgba(255, 255, 255, 0.9);
            letter-spacing: 0.1em;
        }
    }
`
const TopDiv = styled.div`

    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    h2 {
        font-size: var(--font-xxl);
        font-weight: 500;
        line-height: 125%;
        color: rgba(255, 255, 255, 0.9);
    }

    div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;

        p {
            font-size: var(--font-md);
            font-weight: 300;
            line-height: 125%;
            color: rgba(255, 255, 255, 0.75);
        }
    }
`
const DescDiv = styled.div`
    background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;
    padding: 20px;
    width: 100%;

    p {
        font-size: var(--font-md);
        font-weight: 400;
        line-height: 125%;
        color: rgba(255, 255, 255, 0.9);
    }
`

const Right = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
	gap: 30px;
	width: 33%;

	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;

    & > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    
        h3 {
            font-weight: 500;
            font-size: var(--font-lg);
            line-height: 125%;
            color: rgba(255, 255, 255, 0.75);
        }

        p {
            font-size: var(--font-md);
            font-weight: 300;
            line-height: 125%;
            color: rgba(255, 255, 255, 0.75);
        }
	}

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
		color: rgba(255, 255, 255, 0.8);
    }

    button {
        padding: 10px 20px;
        font-weight: 500;
    }

    & > p {
        font-size: var(--font-md);
        font-weight: 300;
        line-height: 125%;
        color: rgba(255, 255, 255, 0.66);
        transition: all 0.3s linear;
        cursor: pointer;
        text-align: center;

        &:hover {
            color: rgba(255, 255, 255, 0.9);
            letter-spacing: 0.1em;
        }
    }
`