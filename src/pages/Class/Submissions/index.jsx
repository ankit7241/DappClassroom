import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

import isTeacher from "../../../utils/isTeacher";

import Loading from "../../../components/Loading";
import Button from "../../../components/Button";
import { useAccount } from "wagmi";


export default function Submissions({ classData }) {
    const { address } = useAccount()
    const navigate = useNavigate();
    const location = useLocation();

    const [assignments, setAssignments] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const GiveMarks = async (studentAddress, assignmentId, classCode, marksGiven) => {
        setIsLoading(true);

        console.log(studentAddress)
        console.log(assignmentId)
        console.log(classCode)
        console.log(marksGiven)

        setIsLoading(false);
    };

    const fetchData = async (id) => {
        setIsLoading(true);

        setAssignments(
            [
                {
                    classCode: "2314",
                    assignmentId: "7174",
                    name: "Assignment #1",
                    description: "This is the assignment description",
                    assignment: "https://google.com/",
                    deadline: "1687372200000",
                    maxMarks: "100",
                    submissions: [
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: null,
                            assigned: false,
                            completed: true,
                            marked: false,
                        },
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: null,
                            assigned: false,
                            completed: true,
                            marked: false,
                        },
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: null,
                            assigned: false,
                            completed: true,
                            marked: false,
                        },
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: "80",
                            assigned: false,
                            completed: false,
                            marked: true,
                        }
                    ]
                },
                {
                    classCode: "2314",
                    assignmentId: "7674",
                    name: "Assignment #2",
                    description: "This is the assignment description",
                    assignment: "https://google.com/",
                    deadline: "1687372200000",
                    maxMarks: "100",
                    submissions: [
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: null,
                            assigned: true,
                            completed: false,
                            marked: false,
                        },
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: null,
                            assigned: false,
                            completed: true,
                            marked: false,
                        },
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: "80",
                            assigned: false,
                            completed: false,
                            marked: true,
                        }
                    ]
                },
                {
                    classCode: "2314",
                    assignmentId: "7674",
                    name: "Assignment #3",
                    description: "This is the assignment description",
                    assignment: "https://google.com/",
                    deadline: "1686421800000",
                    maxMarks: "100",
                    submissions: [
                        {
                            studentAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
                            studentAssignment: "https://google.com/",
                            scroredMarks: null,
                            assigned: true,
                            completed: false,
                            marked: false,
                        }
                    ]
                }
            ]
        )

        setIsLoading(false);
    };

    useEffect(() => {
        if (classData && classData.id) {
            (async () => {
                await fetchData(classData?.id);
            })();
            (async () => {
                const temp = await isTeacher(classData?.id);
                if (temp.status === "Success") {
                    if (!temp.data.data) {
                        navigate(`/${location.pathname.split("/")[1]}/${location.pathname.split("/")[2]}/0`)
                    }
                } else {
                    toast.error(temp.data.msg, {
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
            })();
        }
    }, [classData]);

    const handleClick = async (item, submissionItem) => {
        const marksGiven = prompt(`Give marks for this assignment out of ${item.maxMarks}`)
        try {
            if (!isNaN(parseInt(marksGiven))) {
                await GiveMarks(
                    submissionItem.studentAddress,
                    item.assignmentId,
                    item.classCode,
                    parseInt(marksGiven)
                )
            }
            else {
                toast.error("Invalid marks given!", {
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
        }
        catch (e) {
            console.log(e)
            toast.error("Invalid marks given!", {
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
    }

    return (

        <Container>
            {isLoading ? (
                <Loading />
            ) : (
                <Main>
                    {assignments && assignments.length > 0
                        ? assignments.map((item, ind) => {
                            return (
                                <AssignmentPartDiv>
                                    <TopDiv>
                                        <h2>{item.name}</h2>
                                        <OpenAssignmentP>Open Assignment →</OpenAssignmentP>
                                        <p>Maximum Marks: {item.maxMarks}</p>
                                        <p>
                                            Due{" "}
                                            {new Date(parseInt(item.deadline)).toLocaleTimeString(
                                                "en-us",
                                                { hour: "2-digit", minute: "2-digit" }
                                            )}{" "}
                                            {new Date(parseInt(item.deadline)).toLocaleString(
                                                "default",
                                                { day: "numeric", month: "long" }
                                            )}
                                        </p>
                                    </TopDiv>
                                    <TileList>
                                        {item.submissions.map((submissionItem, index) => {
                                            if (address !== submissionItem.studentAddress) {
                                                return (
                                                    <AssignmentTile key={index}>
                                                        <div>
                                                            {
                                                                submissionItem.marked ? (
                                                                    <div green="true"></div>
                                                                ) : submissionItem.completed ? (
                                                                    <div yellow="true"></div>
                                                                ) : submissionItem.assigned
                                                                    ? new Date().getTime() > parseInt(item.deadline)
                                                                        ? <div red="true"></div>
                                                                        : <div pink="true"></div>
                                                                    : null
                                                            }
                                                            <p>{submissionItem.studentAddress}</p>
                                                        </div>

                                                        {
                                                            new Date().getTime() > parseInt(item.deadline)
                                                                ? null
                                                                : <OpenAssignmentP>View Submission →</OpenAssignmentP>
                                                        }

                                                        <div style={{ justifyContent: "flex-end" }}>
                                                            {submissionItem.marked ? (
                                                                <p>Scored {submissionItem.scroredMarks}/{item.maxMarks}</p>
                                                            ) : submissionItem.completed ? (
                                                                <Button
                                                                    data-btn-type="view"
                                                                    onClick={async () => {
                                                                        await handleClick(item, submissionItem)
                                                                    }}
                                                                >
                                                                    Give Marks
                                                                </Button>
                                                            ) : submissionItem.assigned
                                                                ? new Date().getTime() > parseInt(item.deadline)
                                                                    ? <p red="true">Not submitted</p>
                                                                    : <p>Waiting for submission</p>
                                                                : null}
                                                        </div>
                                                    </AssignmentTile>
                                                );
                                            }
                                        })}
                                    </TileList>
                                </AssignmentPartDiv>
                            )
                        })
                        : <p>No assignments found</p>
                    }
                </Main>
            )}
        </Container>
    );
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
`;

const Main = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 75px;
	width: 100%;
`;
const AssignmentPartDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 30px;
	width: 100%;
`;
const TopDiv = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
    align-items: center;
	justify-content: space-between;

    padding-bottom: 15px;
    padding: 15px 20px;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.33);
    background-color: rgba(255, 255, 255, 0.12);

	h2 {
		font-size: var(--font-xl);
		font-weight: 500;
		line-height: 125%;
		color: rgba(255, 255, 255, 0.9);
	}

    p {
        font-size: var(--font-md);
        font-weight: 300;
        line-height: 125%;
        color: rgba(255, 255, 255, 0.75);
    }
`;
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
		color: rgba(255, 255, 255, 0.75);
	}
`;
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
		& > div[pink="true"] {
			background: var(--pink);
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

    p[red="true"]{
        color: var(--red);
    }
`;
const OpenAssignmentP = styled.p`
	font-size: var(--font-md);
	font-weight: 300;
	line-height: 125%;
	color: rgba(255, 255, 255, 0.66);
	transition: all 0.3s linear;
	cursor: pointer;
	text-align: center;

	&:hover {
		color: rgba(255, 255, 255, 0.9) !important;
	    transform: scale(1.05);
	}
`