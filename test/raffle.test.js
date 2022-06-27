const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");
const SHOULDNOTREACH = "If we've got here, we're in trouble";

describe("Raffle", async () => {
    const costPerTicketDefault = 500000000000;
    let Raffle, owner, participant1, participant2, instance, tx;
    let winningTicketDefault = "0x0000000000000000000000000000000000000000";

    before(async () => {
        Raffle = await ethers.getContractFactory("Raffle");
    });

    beforeEach(async () => {
        [owner, participant1, participant2] = await ethers.getSigners();

        instance = await Raffle.deploy(costPerTicketDefault);
        tx = await instance.deployed();
    });

    it("Is Owned by the creator", async () => {
        expect(await instance.owner()).to.be.equal(owner.address);
    });

    it("will allow participants to enter raffle and provide details", async () => {
        let costPerTicket, potBalance, numberOfParticipants, winningTicket;

        const participant1NumOfTickets = 2;
        const participant2NumOfTickets = 3;
        const participant1Value =
            participant1NumOfTickets * costPerTicketDefault;
        const participant2Value =
            participant2NumOfTickets * costPerTicketDefault;

        const totalPotBalance = participant1Value + participant2Value;

        await instance
            .connect(participant1)
            .enterRaffle(participant1NumOfTickets, {
                value: participant1Value
            });
        await instance
            .connect(participant2)
            .enterRaffle(participant2NumOfTickets, {
                value: participant2Value
            });

        [costPerTicket, potBalance, numberOfParticipants, winningTicket] =
            await instance.getRaffleDetails();
        expect(costPerTicket).to.be.equal(costPerTicketDefault);
        expect(potBalance).to.be.equal(totalPotBalance);
        expect(numberOfParticipants).to.be.equal(2);
        expect(winningTicket).to.be.equal(winningTicketDefault);
    });

    it("will raise a pot update event on ticket purchase", async () => {
        const ticketsPurchased = 2;
        const submittedFee = ticketsPurchased * costPerTicketDefault;

        expect(
            await instance.connect(participant1).enterRaffle(ticketsPurchased, {
                value: submittedFee
            })
        )
            .to.emit(instance, "RafflePotUpdate")
            .withArgs(submittedFee, 1);
    });

    it("will not allow the owner to participate", async () => {
        try {
            await instance.connect(owner).enterRaffle(1, { value: 1 });
            throw SHOULDNOTREACH;
        } catch (err) {
            expect(err.message.match(/Raffle owner cannot participate/)).to.be
                .ok;
        }
    });
    it("will ensure raffle fee is submitted", async () => {
        try {
            await instance.connect(participant1).enterRaffle(0);
            throw SHOULDNOTREACH;
        } catch (err) {
            expect(
                err.message.match(/Number of tickets must be greater than 1/)
            ).to.be.ok;
        }

        try {
            await instance
                .connect(participant2)
                .enterRaffle(3, { value: 2 * costPerTicketDefault });
            throw SHOULDNOTREACH;
        } catch (err) {
            expect(err.message.match(/Insufficient amount supplied/)).to.be.ok;
        }
    });

    it("will allow winning ticket to be drawn and winnings to be split and Raffle Completed event raised", async () => {
        let potBalance, winningTicket, balance, winnersTakeOfThePot;

        const deployedTx = await tx.deployTransaction.wait();
        const waffleProvider = waffle.provider;

        const participant1NumOfTickets = 2;
        const participant2NumOfTickets = 3;
        const participant1Value =
            participant1NumOfTickets * costPerTicketDefault;
        const participant2Value =
            participant2NumOfTickets * costPerTicketDefault;

        await instance
            .connect(participant1)
            .enterRaffle(participant1NumOfTickets, {
                value: participant1Value
            });
        await instance
            .connect(participant2)
            .enterRaffle(participant2NumOfTickets, {
                value: participant2Value
            });

        [, potBalance, , winningTicket] = await instance.getRaffleDetails();
        balance = await waffleProvider.getBalance(deployedTx.contractAddress);

        expect(balance).to.equal(potBalance);
        expect(winningTicket).to.be.equal(winningTicketDefault);

        const transaction = await instance.connect(owner).drawWinningTicket();

        [, potBalance, , winningTicket, winnersTakeOfThePot] =
            await instance.getRaffleDetails();
        balance = await waffleProvider.getBalance(deployedTx.contractAddress);

        expect(transaction)
            .to.emit(instance, "RaffleCompleted")
            .withArgs(winningTicket, winnersTakeOfThePot);

        expect(winningTicket).to.not.be.equal(winningTicketDefault);
        balance = await waffleProvider.getBalance(deployedTx.contractAddress);
        expect(balance).to.be.equal(0);
    });
});
