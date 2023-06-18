import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";
import { toast } from "react-toastify";

import storeFiles from "./storeOnIPFS"

export default async function createClass(className, section, teacherName, setLoadMessage, setShowModal) {
    setLoadMessage("Loading...")
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

            setLoadMessage("Fetching details...")
            try {
                const user = await PushAPI.user.create({
                    account: `eip155:${accounts[0]}`,
                    env: "staging",
                    signer: signer
                });
            }
            catch (e) {
                console.log(e)
            }
            const user = await PushAPI.user.get({
                account: `eip155:${accounts[0]}`,
                env: "staging",
            });

            // need to decrypt the encryptedPvtKey to pass in the api using helper function
            const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
                encryptedPGPPrivateKey: user.encryptedPrivateKey,
                signer: signer,
            });

            setLoadMessage("Creating Group Chat...")
            // actual api
            const response = await PushAPI.chat.createGroup({
                groupName: `${className}`,
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

            setLoadMessage("Uploading class data...")
            const metadata = JSON.stringify({
                className: `${className}`,
                section: `${section}`,
                teacherName: `${teacherName}`,
                adminPrivateKey: `${pgpDecryptedPvtKey}`,
                groupChatId: `${response.chatId}`,
            });
            const descriptionCID = await storeFiles(metadata);


            setLoadMessage("Creating Class...")
            let addClassfunc = await connectedContract.addClass(descriptionCID);

            await addClassfunc.wait();

            // Fetching total number of Classes
            let classIdCounter = 0;
            await connectedContract.classIdCounter().then((classIdCount) => {
                classIdCounter = `${classIdCount}`;
            });

            // Fetching latest Class code i.e. newly created class code
            let latestValue;
            for (let i = 0; i < classIdCounter; i++) {
                await connectedContract.classIds(i).then((classIdCount) => {
                    latestValue = `${classIdCount}`;
                });
            }

            setLoadMessage(null)

            toast.success(
                `Class created successfully! Your Classroom Code is : ${latestValue}`,
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
            setShowModal(false);
        } else {
            console.log("Ethereum object doesn't exist!");

            setLoadMessage(null)
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

        setLoadMessage(null)

        if (error.toString().includes("already exists")) {
            toast.error("Class name already exists, Please try a different name!", {
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
        else if (error.toString().includes("Address can only create up to 10 groups")) {
            toast.error("Maximum number of classrooms reached!", {
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
        else {
            toast.error("An unexpected error occurred! Please try again", {
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
}