import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { toast } from 'react-toastify';

import isTeacher from "../../../utils/isTeacher"

import Button from '../../../components/Button';
import Loading from "../../../components/Loading"
import { ReactComponent as Plus } from "../../../assets/img/plus.svg"

import Modal from "./Modal"

export default function Assignments({ classData }) {

    const [assignments, setAssignments] = useState(null);
    const [isUserTeacher, setIsUserTeacher] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (id) => {
        setIsLoading(true)
        setAssignments(
            [
                { deadline: "1689532200000", name: "Assignment name #1", submitted: false },
                { deadline: "1689705000000", name: "Assignment name #2", submitted: true },
                { deadline: "1690123400000", name: "Assignment name #3", submitted: false },
            ],
        )
        setIsLoading(false)
    }

    useEffect(() => {
        (async () => {
            await fetchData(classData?.id);
        })();
        (async () => {
            const temp = await isTeacher(classData?.id);
            console.log(temp.data.data)
            if (temp.status === "Success") {
                setIsUserTeacher(temp.data.data)
            }
            else {
                toast.error(
                    temp.data.msg,
                    {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }
                );
            }
        })();
    }, [classData]);

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
                        : <Main>
                            {
                                isUserTeacher
                                    ? <TopDiv>
                                        <Button onClick={() => setShowModal(true)}>
                                            <Plus />
                                            Create Assignment
                                        </Button>
                                    </TopDiv>
                                    : undefined
                            }

                            <TileList>
                                {
                                    assignments && assignments.length > 0
                                        ? assignments.map((item, ind) => {
                                            return (
                                                <AssignmentTile key={ind}>
                                                    <div>
                                                        {
                                                            item.submitted
                                                                ? <div green="true"></div>
                                                                : new Date().getTime() < parseInt(item.deadline)
                                                                    ? <div yellow="true"></div>
                                                                    : <div red="true"></div>
                                                        }
                                                        <p>{item.name}</p>
                                                    </div>

                                                    <p>
                                                        Due{" "}
                                                        {new Date(parseInt(item.deadline)).toLocaleTimeString("en-us", { hour: "2-digit", minute: "2-digit" })} {new Date(parseInt(item.deadline)).toLocaleString('default', { day: "numeric", month: 'long' })}
                                                    </p>

                                                    <div style={{ justifyContent: "flex-end" }}>
                                                        {
                                                            item.submitted
                                                                ? <Button data-btn-type="view">View Work</Button>
                                                                : new Date().getTime() < parseInt(item.deadline)
                                                                    ? <Button data-btn-type="upload">Upload Work</Button>
                                                                    : <p>Deadline exceeded</p>
                                                        }
                                                    </div>

                                                </AssignmentTile>
                                            )
                                        })

                                        : <p>No assignments assigned to you yet</p>
                                }
                            </TileList>

                        </Main>
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
        max-width: 1000px;
    }
`

const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 50px;
    width: 100%;
`
const TopDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;

    button {
        padding: 7px 25px;
        font-size: var(--font-md);
        font-weight: 600;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        z-index: 1;
        
        svg {
            width: 30px;
            height: 30px;
        }
        svg > path {
            stroke: rgba(0, 0, 0, 0.75)
        }
    }
`
const TileList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;

    & > p {
        padding: 20% 0px;
        font-size: var(--font-lg);
        font-weight: 300;
        color: rgba(255,255, 255, 0.75);
    }
`
const AssignmentTile = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    gap: 5px;
    width: 100%;

    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    transition: all 0.2s linear;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;
        gap: 15px;
        flex: 1;

        & > div {
            width: 20px;
            height: 20px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.1);
        }

        & > div[green="true"] {
            background: var(--green);
        }
        & > div[yellow="true"] {
            background: var(--yellow);
        }
        & > div[red="true"] {
            background: var(--red);
        }

        & > p {
            font-family: Groteska;
            font-size: var(--font-md);
            line-height: 125%;
            color: rgba(255, 255, 255, 0.45);
        }
    }

    & > p {
        flex: 1;
        text-align: center;
        font-size: var(--font-md);
        line-height: 125%;
        color: rgba(255, 255, 255, 0.66);
    }

    & > div > button {
        padding: 7px 20px;
        width: 150px;
        font-size: var(--font-md);
        font-weight: 500;
    }

    button[data-btn-type="view"] {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.8);

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }
`