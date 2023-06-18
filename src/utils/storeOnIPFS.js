import { Web3Storage } from "web3.storage";

export function makeStorageClient() {
    return new Web3Storage({ token: process.env.REACT_APP_ACCESS_TOKEN });
}

export async function makeFileObjects(data) {
    const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
    });

    const files = [new File([blob], "nftInfo.json")];
    console.log(files);
    return files;
}

export default async function storeFiles(data) {
    console.log("Uploading data to IPFS with web3.storage....");

    const files = await makeFileObjects(data);
    const client = makeStorageClient();
    const cid = await client.put(files, { wrapWithDirectory: false });

    console.log(files, client, cid)

    return cid;
}

export const storeImage = async (files) => {
    console.log("Uploading image to IPFS with web3.storage....");
    const client = makeStorageClient();
    const cid = await client.put([files], { wrapWithDirectory: false });
    console.log("Stored Image with cid:", cid);
    return cid;
};