import { toast } from "react-toastify";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";
import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";

export default async function leaveClass(_data) {
    toast.info("Leaving class initiated", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
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

            let leaveClass = await connectedContract.leaveClass(_data.id);
            await leaveClass.wait();

            let classDescCID;

            await connectedContract
                .getClassDescCID(`${_data.id}`)
                .then((classIdCount) => {
                    classDescCID = `${classIdCount}`;
                });

            const url = `https://ipfs.io/ipfs/${classDescCID}`;
            const res = await fetch(url);
            let fetchedData = await res.json();
            const data = JSON.parse(fetchedData);

            const groupDetails = await PushAPI.chat.getGroup({
                chatId: `${data.groupChatId}`,
                env: "staging",
            });

            const arrayOfPreviousMembers = groupDetails.members
                .map((name, index) => {
                    const str = groupDetails.members[index].wallet.slice(7, 49);
                    if (str != `${accounts[0]}`) {
                        return str;
                    }
                })
                .filter((value) => value !== undefined);

            // actual api
            await PushAPI.chat.updateGroup({
                chatId: `${data.groupChatId}`,
                groupName: `${groupDetails.groupName}`,
                groupDescription: `${groupDetails.groupDescription}`,
                members: [...arrayOfPreviousMembers],
                groupImage: `${groupDetails.groupImage}`,
                admins: [`${groupDetails.groupCreator}`],
                isPublic: true,
                account: `${groupDetails.groupCreator}`,
                env: "staging",
                pgpPrivateKey: data.adminPrivateKey, //decrypted private key
            });

            toast.success("Left class successfully!", {
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
            "An Unexpected error occurred! Please try again",
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