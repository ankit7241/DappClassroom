import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../../ContractDetails";

import HomeCard from "../../components/HomeCard";
import ConnectWalletButton from "../../components/ConnectWalletButton";

export default function Home() {
	const { isConnected } = useAccount();

	const data = {
		id: "1686598245009",
		className: "Computer Club",
		section: "Section - H",
		teacherName: "Atharv Varshney",
		teacherAddress: "0x4d4DB20DcDc95A2D8B0e8ccB33D235209B15e5Ee",
		assignments: [],
	};

	const data2 = {
		id: "1686598276043",
		className: "Computer Science Club",
		section: "Section - H",
		teacherName: "Atharv Varshney",
		teacherAddress: "0xbdfC42145aF525009d3eE7027036777Ed96BF6A4",
		assignments: [
			{ deadline: "1689532200000", name: "Assignment name #1" },
			{
				deadline: "1689705000000",
				name: "Assignment name #2 Assignment name #2",
			},
			{
				deadline: "1689705000000",
				name: "Assignment name #2 Assignment name #2",
			},
			{ deadline: "1690223400000", name: "Assignment name #3" },
		],
	};

	const [classes, setClasses] = useState([
		data,
		data,
		data,
		data2,
		data,
		data,
		data,
		data,
	]);

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

	return isConnected ? (
		<CardContainer>
			{classes.map((item, ind) => {
				return <HomeCard key={ind} _data={item} />;
			})}
		</CardContainer>
	) : (
		<FallbackCont>
			<p>Please connect your wallet to continue!</p>
			<ConnectWalletButton />
		</FallbackCont>
	);
}

const CardContainer = styled.div`
	margin-top: 75px;
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	padding: 0px 50px;
	gap: 50px;
	flex: 1;
`;

const FallbackCont = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	gap: 30px;
	height: 100%;
	flex: 1;

	p {
		font-weight: 400;
		font-size: var(--font-xl);
		line-height: 125%;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.9);
	}
`;
