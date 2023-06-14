import React, { useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";

import Button from "../Button";

export default function Modal({ setShowModal, showModal }) {
	const [className, setClassName] = useState("");
	const [section, setSection] = useState("");
	const [teacherName, setTeacherName] = useState("");

	const [code, setCode] = useState("");
	const CONTRACT_ADDRESS = "0x95CD7c5003Cb25e51b26B1956E570409E6B8C6d8";
	const ABI = [
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
				{
					internalType: "string",
					name: "descriptionCID",
					type: "string",
				},
			],
			name: "addAssignment",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "string",
					name: "className",
					type: "string",
				},
			],
			name: "addClass",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "assignmentCode",
					type: "uint256",
				},
				{
					internalType: "string",
					name: "assignmentCID",
					type: "string",
				},
			],
			name: "completedAssigment",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "assignmentCode",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "marks",
					type: "uint256",
				},
				{
					internalType: "address",
					name: "studentAddress",
					type: "address",
				},
			],
			name: "giveMarks",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
			],
			name: "joinClass",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
			],
			name: "leaveClass",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "string",
					name: "name",
					type: "string",
				},
			],
			name: "registration",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			inputs: [],
			name: "classIdCounter",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			name: "classIds",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "assignmentCode",
					type: "uint256",
				},
			],
			name: "getAssignmentDescriptionCID",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
			],
			name: "getClassAssignmentIdCounter",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
			],
			name: "getClassExists",
			outputs: [
				{
					internalType: "bool",
					name: "",
					type: "bool",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
			],
			name: "getClassName",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
			],
			name: "getClassTeacherAddress",
			outputs: [
				{
					internalType: "address",
					name: "",
					type: "address",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "assignmentCode",
					type: "uint256",
				},
			],
			name: "getStudentAssignmentCID",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "assignmentCode",
					type: "uint256",
				},
			],
			name: "getStudentMarks",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "uint256",
					name: "classCode",
					type: "uint256",
				},
				{
					internalType: "uint256",
					name: "assignmentCode",
					type: "uint256",
				},
			],
			name: "getStudentStatus",
			outputs: [
				{
					internalType: "enum DappClassroom.AssignmentStatus",
					name: "",
					type: "uint8",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [],
			name: "getUserClassCode",
			outputs: [
				{
					internalType: "uint256[]",
					name: "",
					type: "uint256[]",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [],
			name: "getUserName",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
	];

	function getAccessToken() {
		return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1MDQ3MDFlNEE1QTdGYzZDN2E1MTVEOWQ2NzliMWYwRUJlOTJCQzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwMzE3NzMxMjUsIm5hbWUiOiJEZW1vV2ViM1N0b3JhZ2UifQ.weNDPksDEyYK9yPiGK1MScTvW28Wi958gzcttMFrVF4";
	}

	function makeStorageClient() {
		return new Web3Storage({ token: getAccessToken() });
	}

	async function makeFileObjects(questions) {
		const blob = new Blob([JSON.stringify(questions)], {
			type: "application/json",
		});

		const files = [new File([blob], "nftInfo.json")];
		console.log(files);
		return files;
	}

	async function storeFiles(questions) {
		console.log("Uploading data to IPFS with web3.storage....");

		const files = await makeFileObjects(questions);
		const client = makeStorageClient();
		const cid = await client.put(files, { wrapWithDirectory: false });

		return cid;
	}

	const handleCreate = async () => {
		// Write a function to join over here and at after success, write this --->

		try {
			console.log("Begin");
			const { ethereum } = window;

			if (ethereum) {
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

				console.log("Connected", accounts[0]);
				console.log(className);

				const metadata = JSON.stringify({
					className: `${className}`,
					section: `${section}`,
					teacherName: `${teacherName}`,
				});

				console.log(metadata);

				const descriptionCID = await storeFiles(metadata);

				let addClassfunc = await connectedContract.addClass(descriptionCID);
				console.log("Adding Class: Process started");
				await addClassfunc.wait();

				console.log("Adding Class: Process fininshed");

				let classIdCounter = 0;

				await connectedContract.classIdCounter().then((classIdCount) => {
					classIdCounter = `${classIdCount}`;
				});

				console.log(classIdCounter);

				let latestValue;

				for (let i = 0; i < classIdCounter; i++) {
					await connectedContract.classIds(i).then((classIdCount) => {
						console.log(`Class Id of index ${i} is : ${classIdCount}`);
						latestValue = `${classIdCount}`;
					});
				}

				console.log("Latest value : ", latestValue);

				toast.success(
					`Class created successfully! Your Classroom Code is : ${latestValue}`,
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
				setShowModal(false);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
			toast.error("An unexpected error occurred!", {
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

	const handleJoin = async () => {
		// Write a function to join over here and at after success, write this --->

		try {
			console.log("Begin");
			const { ethereum } = window;

			if (ethereum) {
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

				console.log("Connected", accounts[0]);

				let joinClass = await connectedContract.joinClass(code);
				console.log("Joining Class: Process started");
				await joinClass.wait();

				console.log("Joining Class: Process fininshed");

				toast.success("Class joined successfully!", {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "dark",
				});
				setShowModal(false);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
			toast.error(
				"The provided class code does not exist. Please check again and then try !",
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

	return (
		<Container onClick={() => setShowModal(false)}>
			<Main onClick={(e) => e.stopPropagation()}>
				<h2>Add class</h2>

				<div>
					<input
						type="text"
						placeholder="Class Name e.g. Computer Science Club"
						value={className}
						onChange={(e) => setClassName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Section e.g. H"
						value={section}
						onChange={(e) => setSection(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Teacher Name e.g. Atharv Varshney"
						value={teacherName}
						onChange={(e) => setTeacherName(e.target.value)}
					/>
					<StyledButton onClick={handleCreate}>Create Class</StyledButton>
				</div>

				<Divider>
					<p>OR</p>
				</Divider>

				<div>
					<input
						type="text"
						placeholder="Enter Class Code e.g. 1986598276043"
						value={code}
						onChange={(e) => setCode(e.target.value)}
					/>
					<StyledButton onClick={handleJoin}>Join Class</StyledButton>
				</div>
			</Main>
		</Container>
	);
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
`;

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
		color: rgba(255, 255, 255, 0.9);
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
			color: rgba(255, 255, 255, 0.8);
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
`;

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
`;
const StyledButton = styled(Button)`
	border-radius: 10px;
	font-weight: 500;
	padding: 10px;
`;
