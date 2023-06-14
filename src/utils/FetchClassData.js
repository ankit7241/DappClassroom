import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";

import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";

export default async function FetchClassData() {
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

			// console.log("Connected", accounts[0]);

			let userClassIds;

			let getUserClassCode = await connectedContract
				.getUserClassCode()
				.then((classIdCount) => {
					userClassIds = `${classIdCount}`;
				});

			let classIdCounter;

			await connectedContract.classIdCounter().then((classIdCount) => {
				classIdCounter = `${classIdCount}`;
			});

			// console.log(classIdCounter);
			let userClassIdArray = userClassIds.split(",").map(Number);

			// console.log(userClassIdArray);
			const Data = [];

			for (let j = 0; j < userClassIdArray.length; j++) {
				for (let i = 0; i < classIdCounter; i++) {
					await connectedContract.classIds(i).then(async (classIdCount) => {
						let classTeacherAddress;

						let getClassTeacherAddress = await connectedContract
							.getClassTeacherAddress(`${classIdCount}`)
							.then((classIdCount) => {
								classTeacherAddress = `${classIdCount}`;
							});

						// console.log(userClassIdArray[j]);
						if (
							userClassIdArray[j] == `${classIdCount}` ||
							accounts[0] == `${classTeacherAddress}`
						) {
							console.log("Yes");

							let classDescCID;

							let getClassDescCID = await connectedContract
								.getClassDescCID(`${classIdCount}`)
								.then((classIdCount) => {
									classDescCID = `${classIdCount}`;
								});
							const url = `https://ipfs.io/ipfs/${classDescCID}`;
							const res = await fetch(url);
							let fetchedData = await res.json();
							const data = JSON.parse(fetchedData);
							// console.log(data);

							const className = data.className;
							const section = data.section;
							const teacherName = data.teacherName;

							// console.log(className, section, teacherName);
							let classTeacherAddress;

							let getClassTeacherAddress = await connectedContract
								.getClassTeacherAddress(`${classIdCount}`)
								.then((classIdCount) => {
									classTeacherAddress = `${classIdCount}`;
								});

							const fetchedObject = {
								id: `${classIdCount}`,
								className: `${className}`,
								section: `${section}`,
								teacherName: `${teacherName}`,
								teacherAddress: `${classTeacherAddress}`,
								assignments: [],
							};

							Data.push(fetchedObject);
						}
					});
				}
			}

			return { status: "Success", data: Data };
		} else {
			console.log("Ethereum object doesn't exist!");
		}
	} catch (e) {
		console.log(e);
		return { status: "Error", data: e };
	}
}
