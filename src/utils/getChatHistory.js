import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";
import { CONTRACT_ADDRESS, ABI } from "../ContractDetails";

export default async function getChatHistory(id, setLoading) {
    setLoading(true)
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

            let classDescCID;
            const Data = [];

            await connectedContract
                .getClassDescCID(id)
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

            // conversation hash are also called link inside chat messages
            const conversationHash = await PushAPI.chat.conversationHash({
                account: `${accounts[0]}`,
                conversationId: `${data.groupChatId}`, // receiver's address or chatId of a group
                env: "staging",
            });

            // actual api
            const chatHistory = await PushAPI.chat.history({
                threadhash: conversationHash.threadHash,
                account: `${accounts[0]}`,
                limit: 30,
                toDecrypt: true,
                pgpPrivateKey: pgpDecryptedPvtKey,
                env: "staging",
            });

            chatHistory.forEach((item) => {
                const from = item.fromCAIP10.slice(7);
                const timestamp = item.timestamp;
                const message = item.messageContent;

                const msgObj = {
                    from: `${from}`,
                    timestamp: `${timestamp}`,
                    message: `${message}`,
                };

                Data.push(msgObj);
            });

            setLoading(false);
            return { status: "Success", data: Data };
        } else {
            console.log("Ethereum object doesn't exist!");
            setLoading(false);
            return { status: "Error", data: { err: null, msg: "Some problem with Metamask! Please try again" } };
        }
    } catch (error) {
        console.log(error);
        setLoading(false);
        if (error.toString().includes("user rejected signing")) {
            return { status: "Error", data: { err: error, msg: "Please sign messages to load chat history!!" } };
        }
        else if (error.toString().includes("Request failed with status code 400")) {
            return { status: "Error", data: { err: error, msg: "No Messages Found!" } };
        }
        else {
            return { status: "Error", data: { err: error, msg: "Unexpected error occurred!" } };
        }
    }
}