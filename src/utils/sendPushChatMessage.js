import { toast } from "react-toastify";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";
import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";

export default async function sendPushChatMessage(
	classData,
	textInp,
	setLoadMsg
) {
	setLoadMsg("Sending...");
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

			console.log("Connected", accounts[0]);

			let classDescCID;

			await connectedContract
				.getClassDescCID(classData?.id)
				.then((classIdCount) => {
					classDescCID = `${classIdCount}`;
				});

			const url = `https://ipfs.io/ipfs/${classDescCID}`;
			const res = await fetch(url);
			let fetchedData = await res.json();
			const data = JSON.parse(fetchedData);

			const user = await PushAPI.user.get({
				account: `eip155:${accounts[0]}`,
				env: "staging",
			});

			// need to decrypt the encryptedPvtKey to pass in the api using helper function
			const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
				encryptedPGPPrivateKey: user.encryptedPrivateKey,
				signer: signer,
			});

			// actual api
			const response = await PushAPI.chat.createGroup({
				groupName: `${textInp.slice(15)}`,
				groupDescription: "This is the oficial group for Dapp Classroom",
				members: [],
				groupImage:
					"bafkreigypfgxml3ly4hz5lm3l4wxue7xsn2bx7gdduduz7r5dubgrmt56a",
				admins: [],
				isPublic: true,
				account: `${accounts[0]}`,
				env: "staging",
				pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
			});

			// actual api
			await PushAPI.chat.send({
				messageContent: `${textInp} ****###@@${response.chatId}####***@@${pgpDecryptedPvtKey}`,
				messageType: "Text",
				receiverAddress: `${data.groupChatId}`,
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
}
