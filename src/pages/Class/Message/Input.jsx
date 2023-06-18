import React, { useState } from "react";
import { styled } from "styled-components";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

// import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

import Button from "../../../components/Button";

import avatar from "../../../assets/img/placeholder_avatar.png";
import { toast } from "react-toastify";

export default function Input({ data }) {
	const { address } = useAccount();

	// const { data: EnsNameData } = useEnsName({
	//     address: address,
	// });

	// const { data: EnsAvatarData } = useEnsAvatar({
	//     name: EnsNameData,
	// });

	const [loadMsg, setLoadMsg] = useState(null);
	const [alreadyExists, setAlreadyExists] = useState(false);

	const [textInp, setTextInp] = useState("");

	const sendMessage = async () => {
		setLoadMsg("Loading...");
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const accounts = await ethereum.request({
					method: "eth_requestAccounts",
				});

				const message = data.message;

				const startMarker = "****###@@";
				const endMarker = "####***@@";

				const startIndex = message.indexOf(startMarker) + startMarker.length;
				const endIndex = message.indexOf(endMarker);

				const chatId = message.substring(startIndex, endIndex);

				const pvtKeyStartIndex = endIndex + endMarker.length;
				const pvtKey = message.substring(pvtKeyStartIndex);

				const user = await PushAPI.user.get({
					account: `eip155:${accounts[0]}`,
					env: "staging",
				});

				// need to decrypt the encryptedPvtKey to pass in the api using helper function
				const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
					encryptedPGPPrivateKey: user.encryptedPrivateKey,
					signer: signer,
				});
				const groupDetails = await PushAPI.chat.getGroup({
					chatId: `${chatId}`,
					env: "staging",
				});

				const arrayOfPreviousMembers = await Promise.all(
					groupDetails.members.map((name, index) => {
						const str = groupDetails.members[index].wallet.slice(7, 49);
						if (accounts[0] == str) {
							setAlreadyExists(true);
						}
						return str;
					})
				);

				console.log(arrayOfPreviousMembers);
				// try {
				//     await PushAPI.chat.updateGroup({
				//         chatId: `${chatId}`,
				//         groupName: `${groupDetails.groupName}`,
				//         groupDescription: `${groupDetails.groupDescription}`,
				//         members: [...arrayOfPreviousMembers, `${accounts[0]}`],
				//         groupImage: `${groupDetails.groupImage}`,
				//         admins: [`${groupDetails.groupCreator}`, `${accounts[0]}`],
				//         isPublic: true,
				//         account: `${groupDetails.groupCreator}`,
				//         env: "staging",
				//         pgpPrivateKey: pvtKey, //decrypted private key
				//     });

				//     await PushAPI.chat.approve({
				//         status: "Approved",
				//         account: `${accounts[0]}`,
				//         senderAddress: `${chatId}`, // receiver's address or chatId of a group
				//         env: "staging",
				//     });
				// } catch (error) { }

				if (!alreadyExists) {
					await PushAPI.chat.updateGroup({
						chatId: `${chatId}`,
						groupName: `${groupDetails.groupName}`,
						groupDescription: `${groupDetails.groupDescription}`,
						members: [...arrayOfPreviousMembers, `${accounts[0]}`],
						groupImage: `${groupDetails.groupImage}`,
						admins: [`${groupDetails.groupCreator}`, `${accounts[0]}`],
						isPublic: true,
						account: `${groupDetails.groupCreator}`,
						env: "staging",
						pgpPrivateKey: pvtKey, //decrypted private key
					});

					await PushAPI.chat.approve({
						status: "Approved",
						account: `${accounts[0]}`,
						senderAddress: `${chatId}`, // receiver's address or chatId of a group
						env: "staging",
					});
				}

				setLoadMsg("Sending Message...");

				// actual api
				await PushAPI.chat.send({
					messageContent: `${textInp}`,
					messageType: "Text",
					receiverAddress: `${chatId}`,
					signer: signer,
					pgpPrivateKey: pgpDecryptedPvtKey,
					env: "staging",
				});

				setLoadMsg(null);
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
				setLoadMsg(null);
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
			setLoadMsg(null);
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
			{/* <img src={EnsAvatarData ? EnsAvatarData : avatar} alt="" /> */}
			<img src={avatar} alt="" />
			<div>
				<textarea
					type="text"
					placeholder="Announce something to your class"
					value={textInp}
					onChange={(e) => setTextInp(e.target.value)}
				/>
				<Button style={{ padding: "7px 20px" }} onClick={sendMessage}>
					{loadMsg ? loadMsg : "Submit"}
				</Button>
			</div>
		</Container>
	);
}

const Container = styled.div`
	display: flex !important;
	flex-direction: row !important;
	align-items: center;
	padding: 15px 20px;
	gap: 15px !important;
	width: 100% !important;

	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;

	img {
		width: 35px;
		height: 35px;
	}

	div {
		width: 100% !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: right !important;
		gap: 10px !important;
	}

	button {
		width: 100%;
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
