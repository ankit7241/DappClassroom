import { ethers, BigNumber } from "ethers";

import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";

export default async function FetchClassData(id) {

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


            // Fetching All the Classes a user is enrolled in
            let userClassIds;
            await connectedContract
                .getUserClassCode()
                .then((classIdCount) => {
                    userClassIds = `${classIdCount}`;
                });

            // Making an Array of all class Ids a user is enrolled in
            const userClassIdArray = userClassIds.split(",").map(Number);

            if (id) {
                if (userClassIdArray.includes(parseInt(id))) {
                    let classDescCID;

                    await connectedContract
                        .getClassDescCID(`${id}`)
                        .then((resp) => {
                            classDescCID = `${resp}`;
                        });
                    const url = `https://ipfs.io/ipfs/${classDescCID}`;
                    const res = await fetch(url);
                    let fetchedData = await res.json();
                    const data = JSON.parse(fetchedData);

                    const className = data.className;
                    const section = data.section;
                    const teacherName = data.teacherName;

                    let classTeacherAddress;

                    await connectedContract
                        .getClassTeacherAddress(`${id}`)
                        .then((resp) => {
                            classTeacherAddress = `${resp}`;
                        });

                    const fetchedObject = {
                        id: `${id}`,
                        className: `${className}`,
                        section: `${section}`,
                        teacherName: `${teacherName}`,
                        teacherAddress: `${classTeacherAddress}`,
                        assignments: [],
                    };

                    return { status: "Success", data: fetchedObject };
                }
                else {
                    return { status: "Error", data: { msg: "You are not a member of this classroom!" } };
                }
            }
            else {
                const Data = await Promise.all(userClassIdArray.map(async (item) => {

                    let classDescCID;

                    await connectedContract
                        .getClassDescCID(`${item}`)
                        .then((resp) => {
                            classDescCID = `${resp}`;
                        });

                    const url = `https://ipfs.io/ipfs/${classDescCID}`;
                    const res = await fetch(url);
                    let fetchedData = await res.json();
                    const data = JSON.parse(fetchedData);

                    const className = data.className;
                    const section = data.section;
                    const teacherName = data.teacherName;

                    let classTeacherAddress;

                    await connectedContract
                        .getClassTeacherAddress(`${item}`)
                        .then((resp) => {
                            classTeacherAddress = `${resp}`;
                        });

                    const fetchedObject = {
                        id: `${item}`,
                        className: `${className}`,
                        section: `${section}`,
                        teacherName: `${teacherName}`,
                        teacherAddress: `${classTeacherAddress}`,
                        assignments: [],
                    };


                    return (fetchedObject)
                }));

                return { status: "Success", data: Data };
            }
        } else {
            console.log("Ethereum object doesn't exist!");
            return { status: "Error", data: { err: null, msg: "Some problem with Metamask! Please try again" } };
        }
    } catch (e) {
        console.error(e);

        if (e.error?.data?.message?.includes("Create class or join one")) {
            return { status: "Error", data: { err: e, msg: "You are not enrolled in any classroom!" } };
        }
        else {
            return { status: "Error", data: { err: e, msg: "Unexpected error occurred!" } };
        }
    }
}
