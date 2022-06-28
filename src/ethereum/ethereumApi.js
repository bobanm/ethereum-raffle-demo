import { BigNumber, ethers } from "ethers";
import {
    abi as raffleAbi,
    contractAddress as raffleContractAddress
} from "./raffleContract";
import ethersProvider from "./ethereumProvider";

const ethereumApiFactory = (web3Provider) => {
    const { getContractReader, getContractWriter, provider, signer } =
        ethersProvider(web3Provider);

    const getEstimatedGasPrice = async (func, args) => {
        const contract = getContractWriter(raffleContractAddress, raffleAbi);
        const gasPrice = await provider.getGasPrice();

        let newArgs = [];
        if (args) {
            newArgs = [...args];
        }
        const functionGasFees = args
            ? await contract.estimateGas[func](1)
            : await contract.estimateGas[func](null);
        const gasLimit = gasPrice * functionGasFees * 1.2;

        return { gasPrice, gasLimit: Math.ceil(gasLimit) };
    };

    const getRaffleDetails = async () => {
        const contractReader = getContractWriter(
            raffleContractAddress,
            raffleAbi
        );

        const [
            costPerTicket,
            potBalance,
            numberOfParticipants,
            winningTicket,
            winnersTakeOfThePot,
            raffleClosed
        ] = await contractReader.getRaffleInformation();

        console.log(`contract address: ${contractReader.address}`);
        console.log(`cost per ticket: ${costPerTicket.toString()}`);
        console.log(`pot balance: ${potBalance.toString()}`);
        console.log(`number of participants: ${numberOfParticipants.toString()}`);
        console.log(`winning ticket: ${winningTicket}`);
        console.log(`winner's take: ${winnersTakeOfThePot.toString()}`);
        console.log(`raffle closed? ${raffleClosed}`);

        return {
            costPerTicket: ethers.utils.formatUnits(costPerTicket, "wei"),
            potBalance: ethers.utils.formatUnits(potBalance, "gwei"),
            numberOfParticipants: numberOfParticipants.toNumber(),
            winningTicket,
            winnersTakeOfThePot: ethers.utils.formatUnits(
                winnersTakeOfThePot,
                "gwei"
            )
        };
    };

    const enterRaffle = async (numberOfTickets, overrides) => {
        const contractWriter = getContractReader(
            raffleContractAddress,
            raffleAbi
        );

        const gasPrice = await provider.getGasPrice();
        const functionGasFees = await contractWriter.estimateGas.enterRaffle(
            numberOfTickets,
            overrides
        );

        const gasLimit = gasPrice * functionGasFees * 1.2;

        overrides = { gasPrice, gasLimit, ...overrides };

        return await contractWriter.enterRaffle(numberOfTickets, overrides);
    };

    const drawWinningTicket = async () => {
        const contractWriter = getContractWriter(
            raffleContractAddress,
            raffleAbi
        );

        return await contractWriter.drawWinningTicket();
    };

    const parseUnits = (value, denomination) => {
        return ethers.utils.parseUnits(value, denomination);
    };

    const parseEther = (value) => {
        return ethers.utils.parseEther(value, "ether");
    };

    const formatUnits = (wei, decimalsOrUnitName) => {
        return ethers.utils.formatUnits(wei, decimalsOrUnitName);
    };
    const AddressZero = ethers.constants.AddressZero;

    return {
        getEstimatedGasPrice,
        getRaffleDetails,
        enterRaffle,
        drawWinningTicket,
        parseUnits,
        formatUnits,
        getContractWriter,
        getContractReader,
        provider,
        signer,
        parseEther,
        AddressZero
    };
};

export default ethereumApiFactory;
