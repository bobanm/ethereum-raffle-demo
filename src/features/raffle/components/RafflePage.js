/* eslint-disable react-hooks/exhaustive-deps */
import {
    React,
    useState,
    useEffect,
    useContext,
    useRef,
    useCallback,
    Fragment
} from "react";
import { Icon, Input, Grid, Button, Dimmer, Loader } from "semantic-ui-react";
import ethereumApiFactory from "../../../ethereum/ethereumApi";
import WalletProvider from "../../../common/context/walletProvider";
import { abi, contractAddress } from "../../../ethereum/raffleContract";

const RafflePage = () => {
    const { wallet } = useContext(WalletProvider);
    const [ticketsEntered, updateTicketsEntered] = useState("");
    const [raffleDetails, updateRaffleDetails] = useState({});
    const [errorMessage, updateErrorMessage] = useState("");
    const [fee, updateFee] = useState("");
    const [winningTicket, updateWinningTicket] = useState("");
    const [validWallet, updateValidWallet] = useState("");
    const [loading, setLoading] = useState(false);
    const [transactionMessage, updateTransactionMessage] = useState("");
    const ethereumApi = useRef({});
    const contractReader = useRef({});
    const currentBlockNumber = useRef(null);

    const getRaffleDetails = useCallback(async () => {
        try {
            const details = await ethereumApi.current.getRaffleDetails();
            updateRaffleDetails(details);
        } catch (err) {
            updateErrorMessage("There was an error, please retry!");
        }
    }, [updateRaffleDetails, updateErrorMessage]);

    function emitRaffleDetailsUpdate(response) {
        if (response.blockNumber <= currentBlockNumber.current) return;

        setLoading(false);
        const { potBalance, numberOfParticipants } = response.args;
        updateRaffleDetails({
            ...raffleDetails,
            potBalance: ethereumApi.current.formatUnits(potBalance, "wei"),
            numberOfParticipants: numberOfParticipants.toNumber()
        });
    }

    const emitRaffleCompleted = useCallback(async () => {
        (response) => {
            if (response.blockNumber <= currentBlockNumber.current) return;

            const { winningTicket, winnersTakeOfThePot } = response.args;
            setLoading(false);

            updateRaffleDetails({
                ...raffleDetails,
                winningTicket,
                winnersTakeOfThePot
            });
        };
    }, [updateRaffleDetails, raffleDetails]);

    useEffect(() => {
        async function getBlockNumber() {
            const provider = ethereumApi.current.provider;
            return await provider.getBlockNumber();
        }

        if (!wallet.accounts || !wallet.accounts.length) return;

        ethereumApi.current = ethereumApiFactory(window.ethereum);
        contractReader.current = ethereumApi.current.getContractReader(
            contractAddress,
            abi
        );

        getBlockNumber().then(
            (blockNumber) => (currentBlockNumber.current = blockNumber)
        );

        getRaffleDetails();
    }, [wallet.accounts, getRaffleDetails]);

    useEffect(() => {
        const defaultOrValidFee = raffleDetails.costPerTicket
            ? raffleDetails.costPerTicket / 1000000000
            : "Undefined";

        const defaultOrValidAddress =
            raffleDetails.winningTicket === ethereumApi.current.AddressZero
                ? "Not Drawn Yet"
                : raffleDetails.winningTicket;

        updateFee(defaultOrValidFee);
        updateWinningTicket(defaultOrValidAddress);
    }, [raffleDetails, updateFee, updateWinningTicket]);

    useEffect(() => {
        if (wallet.accounts && wallet.accounts.length) {
            updateValidWallet(true);
        } else {
            updateValidWallet(false);
        }
    }, [wallet.accounts]);

    async function onTicketInputChange(e, data) {
        updateTicketsEntered(data.value);
    }

    async function onEnterRaffle() {
        if (!validWallet) {
            updateErrorMessage(
                "Please connect a digital wallet like MetaMask to enter the raffle"
            );
            return;
        }

        try {
            updateTransactionMessage("Entering Raffle");
            setLoading(true);

            const filter = contractReader.current.filters.RaffleDetailsUpdate();

            contractReader.current.on(filter, emitRaffleDetailsUpdate);
            const fee = ticketsEntered * raffleDetails.costPerTicket;

            await ethereumApi.current.enterRaffle(ticketsEntered, {
                value: fee
            });

            updateTicketsEntered("");
        } catch (err) {
            updateTransactionMessage("Drawing Winning Ticket");
            setLoading(false);

            updateErrorMessage("There was an error, please retry!");
        }
    }

    async function drawWinningTicket() {
        if (!validWallet) {
            updateErrorMessage(
                "Please connect a digital wallet like MetaMask to enter the raffle"
            );
            return;
        }

        const completeRaffleEventFilter =
            contractReader.current.filters.raffleCompleted();

        try {
            setLoading(true);

            await ethereumApi.current.drawWinningTicket();
        } catch (err) {
            setLoading(false);
            updateErrorMessage("There was an error, please retry!");
        }
    }

    return (
        <Fragment>
            <Dimmer active={loading} inverted>
                <Loader indeterminate>{transactionMessage}</Loader>
            </Dimmer>
            <div className="raffle-page">
                <div className="raffle">
                    <Grid columns={1}>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <div className="error-message">
                                    <p>{errorMessage}</p>
                                </div>
                                <h1>Raffle 50 / 50</h1>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <div>
                                    <h3>Raffle Pot</h3>
                                    <span>{raffleDetails.potBalance}</span>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <div>
                                    <h3># of Participants</h3>
                                    <span>
                                        {raffleDetails.numberOfParticipants}
                                    </span>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <div>
                                    <h3>Winners Take</h3>
                                    <span>
                                        {raffleDetails.winnersTakeOfThePot}
                                    </span>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <div>
                                    <h3>Winning Ticket</h3>
                                    <span>{winningTicket}</span>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <div className="tickets">
                                    <div>
                                        <Input
                                            label={{
                                                content:
                                                    "Number of tickets to purchase"
                                            }}
                                            labelPosition="left"
                                            placeholder="1"
                                            value={ticketsEntered}
                                            onChange={onTicketInputChange}
                                        />
                                        <span>x{fee} Gwei</span>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={onEnterRaffle}
                                            color="green"
                                        >
                                            Enter to Win
                                        </Button>
                                    </div>
                                </div>
                                <div className="draw-winner">
                                    <div>
                                        <Button
                                            color="green"
                                            onClick={drawWinningTicket}
                                        >
                                            Draw Winning Ticket
                                        </Button>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        </Fragment>
    );
};

export default RafflePage;
