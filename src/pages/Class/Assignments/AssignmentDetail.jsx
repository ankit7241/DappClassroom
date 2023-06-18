import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../../../ContractDetails";
import { storeImage } from "../../../utils/storeOnIPFS";

import Button from "../../../components/Button";
import Loading from "../../../components/Loading";

export default function AssignmentDetail({ data, isUserTeacher, setSelectedAssignment }) {

    const [assignmentFile, setAssignmentFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(null);

    const submitWork = async () => {
        setLoadingText("Loading...")
        setIsLoading(true);
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

                setLoadingText("Uploading work...")
                const assignmentFileCID = await storeImage(assignmentFile);

                setLoadingText("Submitting...")
                let completedAssigment = await connectedContract.completedAssigment(
                    data.classCode,
                    data.assignmentId,
                    `${assignmentFileCID}`
                );

                await completedAssigment.wait();

                toast.success("Assignment submitted successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });

                setIsLoading(false);
                setLoadingText(null);
                setSelectedAssignment(null)
            } else {
                console.log("Ethereum object doesn't exist!");

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

                setIsLoading(false);
                setLoadingText(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                "The provided class code does not exist. Please check and try again!",
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

            setIsLoading(false);
            setLoadingText(null);
        }
    };

    return (
        <>
            <Container data-center={isLoading ? "true" : "false"}>
                {isLoading ? (
                    <Loading text={loadingText} />
                ) : (
                    <div>
                        <Main>
                            <TopDiv>
                                <h2>{data.name}</h2>
                                <div>
                                    <p>Maximum Marks: {data.maxMarks}</p>
                                    <p>
                                        Due{" "}
                                        {new Date(parseInt(data.deadline)).toLocaleTimeString(
                                            "en-us",
                                            { hour: "2-digit", minute: "2-digit" }
                                        )}{" "}
                                        {new Date(parseInt(data.deadline)).toLocaleString(
                                            "default",
                                            { day: "numeric", month: "long" }
                                        )}
                                    </p>
                                </div>
                            </TopDiv>
                            <DescDiv>
                                <p>{data.description}</p>
                            </DescDiv>
                            <a
                                href={`https://ipfs.io/ipfs/${data.assignment}`}
                                target="_blank"
                            >
                                Open Assignment →
                            </a>
                        </Main>
                        <Right>
                            <div>
                                <h3>Your work</h3>
                                {data.assigned ? (
                                    <p data-type="grey">Assigned</p>
                                ) : data.completed ? (
                                    <p data-type="yellow">Submitted</p>
                                ) : data.marked ? (
                                    <p data-type="green">{`Scored: ${data.scoredMarks}`}</p>
                                ) : (
                                    new Date().getTime() > parseInt(data.deadline) && (
                                        <p data-type="red">Deadline exceeded</p>
                                    )
                                )}
                            </div>
                            {data.assigned ? (
                                <>
                                    <input
                                        type="file"
                                        placeholder="Upload assignment file"
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => setAssignmentFile(e.target.files[0])}
                                    />
                                    <Button
                                        onClick={async () => {
                                            await submitWork();
                                        }}
                                    >
                                        Submit Work
                                    </Button>
                                </>
                            ) : (
                                <a
                                    href={`https://ipfs.io/ipfs/${data.studentAssignment}`}
                                    target="_blank"
                                >
                                    Open Your Work →
                                </a>
                            )}
                        </Right>
                    </div>
                )}
            </Container>
        </>
    );
}

const Container = styled.div`
	margin-top: 75px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 30px;
	flex: 1;

    &[data-center="true"] {
        justify-content: center;
    }

	& > div {
		width: 100%;
		max-width: 1000px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		gap: 50px;
	}
`;

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
`;
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
`;
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
`;

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
`;
