import { ethers } from "ethers";

export default async function getEnsData(address) {

    // const provider = new ethers.providers.JsonRpcProvider(
    //     `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
    //     'goerli'
    // )
    const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/eth"
    );

    try {
        const EnsName = await provider.lookupAddress(address)
        const EnsAvatar = await provider.getAvatar(address)
        return { EnsName, EnsAvatar }
    } catch (error) {
        console.error('Error fetching ENS data:', error)
        return { EnsName: '', EnsAvatar: '' }
    }
}
