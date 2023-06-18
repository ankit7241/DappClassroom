import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useLocation, useNavigate } from "react-router";

import isTeacher from "../../../utils/isTeacher";
import getEnsData from "../../../utils/getEnsData";
import fetchAssignmentsData from "../../../utils/getAssignments";

import Loading from "../../../components/Loading";
import Button from "../../../components/Button";

import { useAccount } from "wagmi";
import { CONTRACT_ADDRESS, ABI } from "../../../ContractDetails";


export default function Submissions({ classData }) {
    const { address } = useAccount()
    const navigate = useNavigate();
    const location = useLocation();

    const [assignments, setAssignments] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(null);

    const GiveMarks = async (
        studentAddress,
        assignmentId,
        classCode,
        marksGiven
    ) => {
        setIsLoading(true)
        setLoadingMsg("Loading...")
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();

                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    ABI,
                    signer
                );

                console.log(studentAddress);
                console.log(assignmentId);
                console.log(classCode);
                console.log(marksGiven);

                setLoadingMsg("Giving marks...")
                let giveMarks = await connectedContract.giveMarks(
                    classCode,
                    assignmentId,
                    marksGiven,
                    studentAddress
                );

                await giveMarks.wait();

                setIsLoading(false);
                setLoadingMsg(null)

                toast.success("Marks were given successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                console.log("Ethereum object doesn't exist!");
                setIsLoading(false);
                setLoadingMsg(null)
                toast.error("Some problem with Metamask! Please try again", {
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
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setLoadingMsg(null)
            toast.error("Some error was encountered while sending the message !", {
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
    };

    const fetchData = async (id) => {
        setIsLoading(true)
        setLoadingMsg("Loading...")
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    ABI,
                    signer
                );

                let classStudents;
                let classAssignmentIdCounter;

                setLoadingMsg("Fetching All data...")
                await connectedContract
                    .getClassAssignmentIdCounter(`${id}`)
                    .then((resp) => {
                        classAssignmentIdCounter = `${resp}`;
                    });

                await connectedContract.getClassStudents(`${id}`).then((resp) => {
                    classStudents = `${resp}`;
                });

                const classStudentArray = classStudents.split(",");

                console.log("Total assignments- ", classAssignmentIdCounter)
                console.log("Student Array - ", classStudentArray)

                const AllAssignmentData = [];

                setIsLoading(true)
                setLoadingMsg("Organizing data...")
                // Looping through all Assignments
                for (let k = 0; k < classAssignmentIdCounter; k++) {
                    let classCode;
                    let assignmentId;
                    let deadline;

                    let name;
                    let description;
                    let assignment;
                    let maxMarks;

                    const EachAssignmentData = [];

                    console.log("-- Assignment - ", k)

                    // Looping through all Students
                    for (let j = 0; j < classStudentArray.length; j++) {

                        console.log("-- -- Student - ", classStudentArray[j])

                        const resp = await fetchAssignmentsData(
                            id,
                            (hg) => { console.log(hg) },
                            classStudentArray[j]
                        );

                        console.log("Repsonse Student - ", resp)

                        if (resp.status === "Success") {
                            const assignmentData = resp.data;


                            // Loop for all assignments data
                            for (let i = 0; i < assignmentData.length; i++) {

                                console.log("-- -- -- Current Assignment ", assignmentData[i].assignmentId)
                                console.log(assignmentData[i])

                                // If current Assignment ID Iteration is equal to this loop iteration
                                if (`${assignmentData[i].assignmentId}` == k) {

                                    console.log(
                                        "-- -- -- Student : ",
                                        classStudentArray[j],
                                        "-- --- -- Assignment index : ",
                                        i
                                    );

                                    const { EnsName, EnsAvatar } = await getEnsData(classStudentArray[j]);

                                    const fetchedObject = {
                                        studentAddress: `${classStudentArray[j]}`,
                                        EnsName: EnsName,
                                        studentAssignment: `${assignmentData[i].studentAssignment}`,
                                        scoredMarks: `${assignmentData[i].scoredMarks}`,
                                        assigned: assignmentData[i].assigned,
                                        completed: assignmentData[i].completed,
                                        marked: assignmentData[i].marked,
                                    };

                                    console.log(fetchedObject)

                                    EachAssignmentData.push(fetchedObject);

                                    // This assignment Data
                                    classCode = `${assignmentData[i].classCode}`;
                                    assignmentId = `${assignmentData[i].assignmentId}`;
                                    deadline = `${assignmentData[i].deadline}`;
                                    name = `${assignmentData[i].name}`;
                                    description = `${assignmentData[i].description}`;
                                    assignment = `${assignmentData[i].assignment}`;
                                    maxMarks = `${assignmentData[i].maxMarks}`;
                                }
                            }

                        } else {
                            setIsLoading(false);
                            setLoadingMsg(null)

                            toast.error(resp.data.msg, {
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

                    const tempObj = {
                        classCode: `${classCode}`,
                        assignmentId: `${assignmentId}`,
                        deadline: `${deadline}`,
                        name: `${name}`,
                        description: `${description}`,
                        assignment: `${assignment}`,
                        maxMarks: `${maxMarks}`,
                        submissions: EachAssignmentData,
                    };

                    // Pushing in main array
                    AllAssignmentData.push(tempObj);
                }


                // ----------  Final Success ------------
                setAssignments(AllAssignmentData);
                console.log("Final Data", AllAssignmentData);
                setIsLoading(false)
                setLoadingMsg(null)

            } else {
                console.log("Ethereum object doesn't exist!");
                setIsLoading(false)
                setLoadingMsg(null)
                toast.error("Some problem with Metamask! Please try again", {
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
        } catch (error) {
            console.log(error);
            setIsLoading(false)
            setLoadingMsg(null)
            toast.error("Some error was encountered while sending the message !", {
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
    };

    const handleClick = async (item, submissionItem) => {
        const marksGiven = prompt(
            `Give marks for this assignment out of ${item.maxMarks}`
        );
        try {
            if (!isNaN(parseInt(marksGiven))) {
                await GiveMarks(
                    submissionItem.studentAddress,
                    item.assignmentId,
                    item.classCode,
                    parseInt(marksGiven)
                );
            } else {
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
        } catch (e) {
            console.log(e);
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

    return (

        <Container>
            {isLoading ? (
                <Loading text={loadingMsg} />
            ) : (
                <Main>
                    {assignments && assignments.length > 0
                        ? assignments.map((item, ind) => {
                            return (
                                <AssignmentPartDiv key={ind}>
                                    <TopDiv>
                                        <h2>{item.name}</h2>
                                        <OpenAssignmentP><a
                                            href={`https://ipfs.io/ipfs/${item.assignment}`}
                                            target="_blank"
                                        >
                                            Open Assignment →
                                        </a></OpenAssignmentP>
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
                                                            <p>
                                                                {
                                                                    submissionItem.EnsName
                                                                        ? <>
                                                                            {submissionItem.EnsName}
                                                                            <span>({submissionItem.studentAddress.slice(0, 6)}...{submissionItem.studentAddress.slice(-6)})</span>
                                                                        </>
                                                                        : submissionItem.studentAddress
                                                                }
                                                            </p>
                                                        </div>

                                                        {
                                                            submissionItem.completed || submissionItem.marked
                                                                ? <OpenAssignmentP><a
                                                                    href={`https://ipfs.io/ipfs/${submissionItem.studentAssignment}`}
                                                                    target="_blank"
                                                                >
                                                                    View Submission →
                                                                </a></OpenAssignmentP>
                                                                : null
                                                        }

                                                        <div style={{ justifyContent: "flex-end" }}>
                                                            {submissionItem.marked ? (
                                                                <p>Scored {submissionItem.scoredMarks}/{item.maxMarks}</p>
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

            span {
                margin-left: 7px;
                font-weight: 400;
                font-size: var(--font-sm);
                line-height: 125%;
                color: rgba(255, 255, 255, 0.33);
            }
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