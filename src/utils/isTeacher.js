import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";

export default async function isTeacher(id) {

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

            if (userClassIdArray.includes(parseInt(id))) {

                let classTeacherAddress;

                await connectedContract
                    .getClassTeacherAddress(`${id}`)
                    .then((resp) => {
                        classTeacherAddress = `${resp}`;
                    });

                if (accounts[0].toLowerCase() === classTeacherAddress.toLowerCase()) {
                    return { status: "Success", data: { teacherAddress: `${classTeacherAddress}`, data: true } };
                }
                else {
                    return { status: "Success", data: { teacherAddress: `${classTeacherAddress}`, data: false } };
                }
            }
            else {
                return { status: "Error", data: { msg: "You are not a member of this classroom!" } };
            }

        } else {
            console.log("Ethereum object doesn't exist!");
            return { status: "Error", data: { err: null, msg: "Some problem with Metamask! Please try again" } };
        }
    } catch (e) {
        console.error(e);

        if (e.error.data.message.includes("Create class or join one")) {
            return { status: "Error", data: { err: e, msg: "You are not enrolled in any classroom!" } };
        }
        else {
            return { status: "Error", data: { err: e, msg: "Unexpected error occurred!" } };
        }
    }
}