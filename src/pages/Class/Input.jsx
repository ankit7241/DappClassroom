import React, { useState } from "react";
import { styled } from "styled-components";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

import Button from "../../components/Button";
import { CONTRACT_ADDRESS, ABI } from "../../ContractDetails";

import avatar from "../../assets/img/placeholder_avatar.png";

export default function Input({ classData }) {
	const { address } = useAccount();

	const { data: EnsNameData } = useEnsName({
		address: address,
	});

	const { data: EnsAvatarData } = useEnsAvatar({
		name: EnsNameData,
	});

	const [textInp, setTextInp] = useState("");

	const sendMessage = async () => {
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

				let getClassDescCID = await connectedContract
					.getClassDescCID(classData?.id)
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

				const groupDetails = await PushAPI.chat.getGroup({
					chatId: `${data.groupChatId}`,
					env: "staging",
				});
				console.log(groupDetails);

				// actual api
				const response = await PushAPI.chat.send({
					messageContent: `${textInp}`,
					messageType: "Text", // can be "Text" | "Image" | "File" | "GIF"
					receiverAddress: `${data.groupChatId}`,
					signer: signer,
					pgpPrivateKey: pgpDecryptedPvtKey,
					env: "staging",
				});
				console.log(response);

				toast.success("Message was sent to the class successfully!", {
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
			}
		} catch (error) {
			console.log(error);
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

	return (
		<Container>
			<img src={EnsAvatarData ? EnsAvatarData : avatar} alt="" />
			<div>
				<textarea
					type="text"
					placeholder="Announce something to your class"
					value={textInp}
					onChange={(e) => setTextInp(e.target.value)}
				/>
				<Button style={{ padding: "7px 20px" }} onClick={sendMessage}>
					Submit
				</Button>
			</div>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 15px 20px;
	gap: 15px;

	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;

	img {
		width: 35px;
		height: 35px;
	}

	div {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: right;
		gap: 10px;
	}

	textarea {
		font-family: Groteska;
		font-size: var(--font-md);
		line-height: 125%;
		color: rgba(255, 255, 255, 0.9);
		width: 100%;
		border: none;
		outline: none;
		background-color: transparent;
		height: 20px;
		resize: none;
		transition: all 0.1s linear;

		&::-webkit-scrollbar {
			width: 12px;
		}

		&::-webkit-scrollbar-track {
			border-radius: 10px;
			border: 0.5px solid rgba(255, 255, 255, 0.3);
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(255, 255, 255, 0.2);
			border-radius: 10px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: rgba(255, 255, 255, 0.3);
		}
	}

	textarea:focus {
		min-height: 70px;
		resize: vertical;
	}

	textarea:focus ~ button {
		display: block;
	}
`;
