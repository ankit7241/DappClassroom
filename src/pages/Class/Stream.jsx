import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

import CopyIcon from "../../assets/img/copy.svg";

import Input from "./Input";
import Message from "./Message";
import Home from "../Home/index.jsx";
import { CONTRACT_ADDRESS, ABI } from "../../ContractDetails";

export default function Stream({ classData }) {
	const shortenAddress = (address, place) => {
		return address?.slice(0, place) + "..." + address?.slice(-place);
	};

	const handleCopy = (txt) => {
		navigator.clipboard.writeText(txt);
		toast.success("Class code copied successfully", {
			position: "top-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	};

	const [msgData, setMsgData] = useState(null);

	const fetchData = async (id) => {
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

				let classDescCID;
				const Data = [];

				let getClassDescCID = await connectedContract
					.getClassDescCID(id)
					.then((classIdCount) => {
						classDescCID = `${classIdCount}`;
					});

				const url = `https://ipfs.io/ipfs/${classDescCID}`;
				const res = await fetch(url);
				let fetchedData = await res.json();
				const data = JSON.parse(fetchedData);
				console.log(data);

				const user = await PushAPI.user.get({
					account: `eip155:${accounts[0]}`,
					env: "staging",
				});
				console.log(user);

				// need to decrypt the encryptedPvtKey to pass in the api using helper function
				const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
					encryptedPGPPrivateKey: user.encryptedPrivateKey,
					signer: signer,
				});

				// conversation hash are also called link inside chat messages
				const conversationHash = await PushAPI.chat.conversationHash({
					account: `${accounts[0]}`,
					conversationId: `${data.groupChatId}`, // receiver's address or chatId of a group
					env: "staging",
				});

				// actual api
				const chatHistory = await PushAPI.chat.history({
					threadhash: conversationHash.threadHash,
					account: `${accounts[0]}`,
					limit: 30,
					toDecrypt: true,
					pgpPrivateKey: pgpDecryptedPvtKey,
					env: "staging",
				});

				const arrayOfAllMessages = chatHistory.map((name, index) => {
					const from = chatHistory[index].fromCAIP10.slice(7);
					const fromName = "Ankit Choudhary";
					const timestamp = chatHistory[index].timestamp;

					const message = chatHistory[index].messageContent;

					const fetchedObject = {
						from: `${from}`,
						fromName: `${fromName}`,
						timestamp: `${timestamp}`,
						message: `${message}`,
					};

					Data.push(fetchedObject);
				});

				console.log(chatHistory);
				setMsgData(Data);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		(async () => {
			await fetchData(classData?.id);
		})();
	}, [classData]);

	return (
		<Container>
			<Top>
				<h2>{classData?.className}</h2>
				<h4>{classData?.section}</h4>
				<p>
					{classData?.teacherName}{" "}
					<span>({shortenAddress(classData?.teacherAddress, 4)})</span>
				</p>
			</Top>

			<Main>
				<Left>
					<CodeDiv>
						<h3>Class code</h3>
						<div onClick={() => handleCopy(classData?.id)}>
							<p>{classData?.id}</p>
							<img src={CopyIcon} alt="" />
						</div>
					</CodeDiv>

					<AssignmentsDiv>
						<h3>Upcoming</h3>

						{classData?.assignments.map((item, ind) => {
							return (
								<div key={ind}>
									<p>
										Due{" "}
										{new Date(parseInt(item.deadline)).toLocaleString(
											"default",
											{ day: "numeric", month: "long" }
										)}
									</p>
									<h4>
										{item.name.length > 15
											? item.name.slice(0, 15) + "..."
											: item.name}
									</h4>
								</div>
							);
						})}
					</AssignmentsDiv>
				</Left>

				<Right>
					<Input classData={classData} />
					{msgData?.map((item) => {
						return <Message data={item} />;
					})}
				</Right>
			</Main>
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

const Top = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding: 20px 30px;
	gap: 10px;

	width: 100%;
	height: 200px;

	background: rgba(255, 255, 255, 0.08);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;

	h2 {
		font-weight: 400;
		font-size: var(--font-xl);
		line-height: 125%;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 1);
	}
	h4 {
		font-weight: 300;
		font-size: var(--font-lg);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.9);
	}
	p {
		display: flex;
		gap: 5px;

		font-weight: 200;
		font-size: var(--font-md);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.66);

		span {
			font-size: var(--font-sm);
			color: rgba(255, 255, 255, 0.5);
		}
	}
`;

const Main = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	gap: 30px;
`;
const Left = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;

	& > div {
		display: flex;
		flex-direction: column;
		padding: 20px;
		gap: 20px;
		width: 200px;

		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 15px;

		h3 {
			font-weight: 400;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.75);
		}
	}
`;
const Right = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	flex: 1;
`;

const CodeDiv = styled.div`
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 15px;
		cursor: pointer;

		p {
			font-weight: 400;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 1);
		}
	}
`;

const AssignmentsDiv = styled.div`
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0px;
		gap: 5px;
		cursor: pointer;

		p {
			font-weight: 300;
			font-size: var(--font-sm);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.5);
		}
		h4 {
			font-weight: 300;
			font-size: var(--font-md);
			line-height: 125%;
			color: rgba(255, 255, 255, 0.75);
			transition: all 0.15s linear;
		}

		&:hover > h4 {
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
		}
	}
`;
