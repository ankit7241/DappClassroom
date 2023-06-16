import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../../../ContractDetails";

import isTeacher from "../../../utils/isTeacher";

import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import { ReactComponent as Plus } from "../../../assets/img/plus.svg";

import Modal from "./Modal";
import AssignmentDetail from "./AssignmentDetail";

export default function Assignments({ classData }) {
	const [assignments, setAssignments] = useState(null);
	const [isUserTeacher, setIsUserTeacher] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedAssignment, setSelectedAssignment] = useState(null);
	const [assignmentId, setAssignmentId] = useState();

	const fetchData = async (id) => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				setIsLoading(true);
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					ABI,
					signer
				);
				const accounts = await ethereum.request({
					method: "eth_requestAccounts",
				});

				setAssignments([
					{
						deadline: "1689532200000",
						name: "Assignment name #1",
						description: "This is the description",
						assignment: "Please set a File here",
						maxMarks: "100",
						scroredMarks: null,
						assigned: true,
						completed: false,
						marked: false,
					},
					{
						deadline: "1689532200000",
						name: "Assignment name #1",
						description: "This is the description",
						assignment: "Please set a File here",
						maxMarks: "100",
						scroredMarks: null,
						assigned: false,
						completed: true,
						marked: false,
					},
					{
						deadline: "1689532200000",
						name: "Assignment name #1",
						description: "This is the description",
						assignment: "Please set a File here",
						maxMarks: "100",
						scroredMarks: "80",
						assigned: false,
						completed: false,
						marked: true,
					},
					{
						deadline: "1629532200000",
						name: "Assignment name #1",
						description: "This is the description",
						assignment: "Please set a File here",
						maxMarks: "100",
						scroredMarks: null,
						assigned: false,
						completed: false,
						marked: false,
					},
				]);

				let assignmentCount;

				await connectedContract
					.getClassAssignmentIdCounter(`${id}`)
					.then((classIdCount) => {
						assignmentCount = `${classIdCount}`;
					});

				const Data = [];

				for (let i = 0; i < assignmentCount; i++) {
					let assignmentDescCID;

					await connectedContract
						.getAssignmentDescriptionCID(`${id}`, `${i}`)
						.then((classIdCount) => {
							assignmentDescCID = `${classIdCount}`;
						});

					let studentStatus;

					await connectedContract
						.getStudentStatus(`${id}`, `${i}`)
						.then((classIdCount) => {
							studentStatus = `${classIdCount}`;
						});

					let studentMarks = 0;
					try {
						await connectedContract
							.getStudentMarks(`${id}`, `${i}`)
							.then((classIdCount) => {
								studentMarks = `${classIdCount}`;
							});
					} catch (error) {
						console.log(error);
					}

					let studentAssignment = null;
					try {
						await connectedContract
							.getStudentAssignmentCID(`${id}`, `${i}`)
							.then((classIdCount) => {
								studentAssignment = `${classIdCount}`;
							});
					} catch (error) {
						console.log(error);
					}

					let assigned;
					let completed;
					let marked;

					if (studentStatus == 0) {
						assigned = true;
						completed = false;
						marked = false;
					} else {
						if (studentStatus == 1) {
							assigned = false;
							completed = true;
							marked = false;
						} else {
							assigned = false;
							completed = false;
							marked = true;
						}
					}

					const url = `https://ipfs.io/ipfs/${assignmentDescCID}`;
					const res = await fetch(url);
					let fetchedData = await res.json();
					const data = JSON.parse(fetchedData);

					const fetchedObject = {
						classCode: `${id}`,
						assignmentId: `${i}`,
						deadline: `${data.deadline}`,
						name: `${data.assignmentName}`,
						description: `${data.assignmentDesc}`,
						assignment: `${data.assignmentFileCID}`,
						studentAssignment: `${studentAssignment}`,
						maxMarks: `${data.maximumMarks}`,
						scroredMarks: studentMarks,
						assigned: assigned,
						completed: completed,
						marked: marked,
					};

					console.log(fetchedObject);

					Data.push(fetchedObject);
				}

				setAssignments(Data);

				setIsLoading(false);
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
		}
	};

	useEffect(() => {
		// Fetching assignments data
		(async () => {
			await fetchData(classData?.id);
		})();

		// Checking if the user is a teacher
		(async () => {
			const temp = await isTeacher(classData?.id);
			console.log(temp.data.data);
			if (temp.status === "Success") {
				setIsUserTeacher(temp.data.data);
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
	}, [classData]);

	// On toggle of Modal, change the scroll mode of body
	useEffect(() => {
		if (showModal) {
			window.scroll(0, 0);
			document.body.style.overflowY = "hidden";
		} else {
			document.body.style.overflowY = "scroll";
		}
	}, [showModal]);

	return (
		<>
			{selectedAssignment ? (
				<AssignmentDetail
					data={selectedAssignment}
					isUserTeacher={isUserTeacher}
				/>
			) : (
				<>
					{showModal && (
						<Modal showModal={showModal} setShowModal={setShowModal} />
					)}
					<Container>
						{isLoading ? (
							<Loading />
						) : (
							<Main>
								{isUserTeacher && (
									<TopDiv>
										<Button onClick={() => setShowModal(true)}>
											<Plus />
											Create Assignment
										</Button>
									</TopDiv>
								)}

								<TileList>
									{assignments && assignments.length > 0 ? (
										assignments.map((item, ind) => {
											return (
												<AssignmentTile key={ind}>
													<div>
														{item.marked ? (
															<div green="true"></div>
														) : item.completed ? (
															<div yellow="true"></div>
														) : item.assigned ? (
															<div pink="true"></div>
														) : new Date().getTime() >
														  parseInt(item.deadline) ? (
															<div red="true"></div>
														) : null}
														<p>{item.name}</p>
													</div>

													<p>
														{item.marked ? (
															`Scored ${item.scroredMarks}/${item.maxMarks}`
														) : (
															<>
																Due{" "}
																{new Date(
																	parseInt(item.deadline)
																).toLocaleTimeString("en-us", {
																	hour: "2-digit",
																	minute: "2-digit",
																})}{" "}
																{new Date(
																	parseInt(item.deadline)
																).toLocaleString("default", {
																	day: "numeric",
																	month: "long",
																})}
															</>
														)}
													</p>

													<div style={{ justifyContent: "flex-end" }}>
														{item.marked ? (
															<Button
																data-btn-type="view"
																onClick={() => {
																	setSelectedAssignment(item);
																}}
															>
																View Work
															</Button>
														) : item.completed ? (
															<Button
																data-btn-type="view"
																onClick={() => {
																	setSelectedAssignment(item);
																}}
															>
																View Work
															</Button>
														) : item.assigned ? (
															<Button
																data-btn-type="upload"
																onClick={() => {
																	setSelectedAssignment(item);
																}}
															>
																Upload Work
															</Button>
														) : new Date().getTime() >
														  parseInt(item.deadline) ? (
															<p>Deadline exceeded</p>
														) : null}
													</div>
												</AssignmentTile>
											);
										})
									) : (
										<p>No assignments assigned to you yet</p>
									)}
								</TileList>
							</Main>
						)}
					</Container>
				</>
			)}{" "}
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

	& > div {
		max-width: 1000px;
	}
`;

const Main = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 50px;
	width: 100%;
`;
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
			stroke: rgba(0, 0, 0, 0.75);
		}
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
`;
