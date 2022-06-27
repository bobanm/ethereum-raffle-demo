import { ethers } from "ethers";

const ethersProvider = (web3Provider) => {
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();

    const getContractWriter = (contractAddress, contractAbi) =>
        new ethers.Contract(contractAddress, contractAbi, signer);

    const getContractReader = (contractAddress, contractAbi) =>
        new ethers.Contract(contractAddress, contractAbi, provider);

    return {
        getContractReader,
        getContractWriter,
        provider,
        signer
    };
};

export default ethersProvider;
