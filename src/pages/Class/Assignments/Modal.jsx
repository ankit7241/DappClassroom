import React, { useState } from "react";
import { styled } from "styled-components";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../../../ContractDetails";
import { toast } from "react-toastify";

import Button from "../../../components/Button";
import storeFiles from "../../../utils/storeOnIPFS";

export default function Modal({ id, setShowModal, showModal }) {
	const [assignmentName, setAssignmentName] = useState("");
	const [assignmentDesc, setAssignmentDesc] = useState("");
	const [assignmentFile, setAssignmentFile] = useState("");
	const [deadline, setDeadline] = useState(
		new Date().toISOString().split(":")[0] + ":00"
	);
	const [marks, setMarks] = useState(
		new Date().toISOString().split(":")[0] + ":00"
	);

	const [loadMessage, setLoadMessage] = useState(null);

	const handleCreate = async () => {
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
				const accounts = await ethereum.request({
					method: "eth_requestAccounts",
				});

				const assignmentFileCID = await storeFiles(assignmentFile);

				const submissionDeadline = new Date(deadline).getTime();

				// Add your function here
				const metadata = JSON.stringify({
					assignmentName: `${assignmentName}`,
					assignmentDesc: `${assignmentDesc}`,
					asignmentFileCID: `${assignmentFileCID}`,
					deadline: `${submissionDeadline}`,
					maximumMarks: `${marks}`,
				});
				const descriptionCID = await storeFiles(metadata);

				let addAssignment = await connectedContract.addAssignment(
					id,
					descriptionCID
				);

				await addAssignment.wait();

				// let classDescCID;

				// await connectedContract
				// 	.getClassDescCID(`${code}`)
				// 	.then((classIdCount) => {
				// 		classDescCID = `${classIdCount}`;
				// 	});

				// const url = `https://ipfs.io/ipfs/${classDescCID}`;
				// const res = await fetch(url);
				// let fetchedData = await res.json();
				// const data = JSON.parse(fetchedData);

				toast.success("Assignment created successfully!", {
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
				setLoadMessage(null);

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

	return (
		<Container onClick={() => setShowModal(false)}>
			<Main onClick={(e) => e.stopPropagation()}>
				<h2>Add Assignment</h2>

				<div>
					<input
						type="text"
						placeholder="Assignment Name"
						value={assignmentName}
						onChange={(e) => setAssignmentName(e.target.value)}
					/>
					<textarea
						type="text"
						placeholder="Enter assignment description"
						value={assignmentDesc}
						onChange={(e) => setAssignmentDesc(e.target.value)}
					/>
					<input
						type="file"
						placeholder="Upload assignment file"
						accept="image/png, image/jpeg"
						onChange={(e) => setAssignmentFile(e.target.files[0])}
					/>
					<div>
						<input
							type="datetime-local"
							placeholder="Select Deadline"
							value={deadline}
							onChange={(e) => setDeadline(e.target.value)}
						/>
						<input
							type="number"
							placeholder="Maximum marks"
							value={marks}
							onChange={(e) => setMarks(e.target.value)}
						/>
					</div>

					<StyledButton onClick={handleCreate}>
						{loadMessage ? (
							<>
								{loadMessage} <Loader />
							</>
						) : (
							"Create assignment"
						)}
					</StyledButton>
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
	z-index: 2;
`;

const Main = styled.div`
	z-index: 3;
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

		input,
		textarea {
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

		textarea {
			height: 100px;
			resize: vertical;
		}

		div {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 10px;
			width: 100%;

			input {
				flex: 1;
			}
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
const StyledButton = styled(Button)`
	border-radius: 10px;
	font-weight: 500;
	padding: 10px;

	svg {
		display: inline;
		width: 25px;
		height: 25px;
		color: rgba(255, 255, 255, 0.05);
		fill: var(--bg);
		animation: spin 0.75s infinite linear;
		margin-left: 7px;
	}
`;

const Loader = () => {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 100 101"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
				fill="currentColor"
			/>
			<path
				d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
				fill="currentFill"
			/>
		</svg>
	);
};
