import { Web3Storage } from "web3.storage";

export function getAccessToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1MDQ3MDFlNEE1QTdGYzZDN2E1MTVEOWQ2NzliMWYwRUJlOTJCQzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwMzE3NzMxMjUsIm5hbWUiOiJEZW1vV2ViM1N0b3JhZ2UifQ.weNDPksDEyYK9yPiGK1MScTvW28Wi958gzcttMFrVF4";
}

export function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
}

export async function makeFileObjects(questions) {
    const blob = new Blob([JSON.stringify(questions)], {
        type: "application/json",
    });

    const files = [new File([blob], "nftInfo.json")];
    console.log(files);
    return files;
}

export default async function storeFiles(questions) {
    console.log("Uploading data to IPFS with web3.storage....");

    const files = await makeFileObjects(questions);
    const client = makeStorageClient();
    const cid = await client.put(files, { wrapWithDirectory: false });

    return cid;
}