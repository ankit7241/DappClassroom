import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";
import { toast } from "react-toastify";

export default async function joinClass(code, setLoadMessage, setShowModal) {
	try {
		const { ethereum } = window;
		setLoadMessage("Loading...");

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

			setLoadMessage("Joining Class...");
			let joinClass = await connectedContract.joinClass(code);

			await joinClass.wait();

			let classDescCID;

			await connectedContract
				.getClassDescCID(`${code}`)
				.then((classIdCount) => {
					classDescCID = `${classIdCount}`;
				});

			setLoadMessage("Fetching Class Data...");
			const url = `https://ipfs.io/ipfs/${classDescCID}`;
			const res = await fetch(url);
			let fetchedData = await res.json();
			const data = JSON.parse(fetchedData);

			const groupDetails = await PushAPI.chat.getGroup({
				chatId: `${data.groupChatId}`,
				env: "staging",
			});

			const arrayOfPreviousMembers = groupDetails.members.map((name, index) => {
				const str = groupDetails.members[index].wallet.slice(7, 49);
				return str;
			});

			setLoadMessage("Adding you in the group...");
			// actual api
			await PushAPI.chat.updateGroup({
				chatId: `${data.groupChatId}`,
				groupName: `${groupDetails.groupName}`,
				groupDescription: `${groupDetails.groupDescription}`,
				members: [...arrayOfPreviousMembers, `${accounts[0]}`],
				groupImage: `${groupDetails.groupImage}`,
				admins: [`${groupDetails.groupCreator}`, `${accounts[0]}`],
				isPublic: true,
				account: `${groupDetails.groupCreator}`,
				env: "staging",
				pgpPrivateKey: data.adminPrivateKey, //decrypted private key
			});

			await PushAPI.chat.approve({
				status: "Approved",
				account: `${accounts[0]}`,
				senderAddress: `${data.groupChatId}`, // receiver's address or chatId of a group
				env: "staging",
			});

			setLoadMessage(null);
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
}
