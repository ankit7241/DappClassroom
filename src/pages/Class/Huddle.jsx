import { HuddleIframe } from "@huddle01/iframe";
import { useEventListner } from "@huddle01/iframe";
import { iframeApi } from "@huddle01/iframe";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS, ABI } from "../../ContractDetails";

export default function Huddle({ id }) {
	const [roomId, setRoomId] = useState();
	const roomIdRef = useRef(roomId);
	roomIdRef.current = roomId;
	const [isLoading, setIsLoading] = useState(true);

	async function FetchClassData() {
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

				let classTeacherAddress;

				await connectedContract
					.getClassTeacherAddress(id)
					.then((classIdCount) => {
						classTeacherAddress = `${classIdCount}`;
					});

				if (classTeacherAddress.toLowerCase() === accounts[0].toLowerCase()) {
					const response = await axios.post(
						"https://api.huddle01.com/api/v1/create-iframe-room",
						{
							title: "DappClassroom",
							roomLocked: false,
						},
						{
							headers: {
								"Content-Type": "application/json",
								"x-api-key": "u9pq0Qh4zJ5MYKsynBW2MoBJDQRZOj65",
							},
						}
					);
					console.log(response.data.data.roomId);
					setRoomId(response.data.data.roomId);
					let changeMeetCode = await connectedContract.changeMeetCode(
						id,
						response.data.data.roomId
					);
					await changeMeetCode.wait();
				} else {
					let classMeetCode;

					await connectedContract.getClassMeetCode(id).then((classIdCount) => {
						classMeetCode = `${classIdCount}`;
					});

					console.log("Fetched Class Data");
					console.log(classMeetCode);

					setRoomId(classMeetCode);
				}
				setIsLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (id) {
			(async () => {
				await FetchClassData();
			})();
		}
	}, [id]);

	useEventListner("lobby:initialized", (data) => {
		iframeApi.initialize({
			redirectUrlOnLeave: "http://localhost:3002/",
			background:
				"https://ipfs.io/ipfs/bafybeih57dsp2gopifd7bnghpbr7vx6yxjtoxynlyr27bsc7zyesi4reqe/image.png",
		});
	});
	if (isLoading) {
		return <div>Loading...</div>; // Render loading state while fetching data
	}

	return (
		<HuddleIframe
			roomUrl={"https://iframe.huddle01.com/" + roomIdRef.current}
			height="700px"
			width="100%"
		/>
	);
}
