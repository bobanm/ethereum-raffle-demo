// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.7;

contract Raffle {
    address public owner;
    mapping(address => uint256) private participants;
    address[] private tickets;
    uint256 private costPerTicket;
    uint256 private costPerTicketDefault = 100000000 wei;
    uint256 private nonce;
    bool private raffleClosed;
    uint256 private potBalance;
    uint256 private numberOfParticipants;
    address private winningTicket;
    uint256 private winnersTakeOfThePot;

    event RafflePotUpdate(uint256 potBalance, uint256 numberOfParticipants);

    event RaffleCompleted(address winningTicket, uint256 winnersTakeOfThePot);

    constructor(uint256 _costPerTicket) {
        owner = msg.sender;
        costPerTicket = _costPerTicket > 0
            ? _costPerTicket
            : costPerTicketDefault;
        raffleClosed = false;
        potBalance = 0;
    }

    function getRaffleInformation()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            address,
            uint256,
            bool
        )
    {
        return (
            costPerTicket,
            potBalance,
            numberOfParticipants,
            winningTicket,
            winnersTakeOfThePot,
            raffleClosed
        );
    }

    function enterRaffle(uint256 _numberOfTickets) external payable {
        require(raffleClosed != true, "This raffle has been completed");
        require(owner != msg.sender, "Raffle owner cannot participate");
        require(
            _numberOfTickets > 0,
            "Number of tickets must be greater than 1"
        );
        require(
            msg.value >= (_numberOfTickets * costPerTicket),
            "Insufficient amount supplied"
        );

        for (uint256 i = 0; i < _numberOfTickets; i++) {
            tickets.push(msg.sender);
        }

        potBalance = potBalance + msg.value;
        winnersTakeOfThePot = (address(this).balance * 50) / 100;

        if (participants[msg.sender] == 0) numberOfParticipants++;

        participants[msg.sender] = participants[msg.sender] + _numberOfTickets;

        emit RafflePotUpdate(potBalance, numberOfParticipants);
    }

    function drawWinningTicket() external {
        require(msg.sender == owner, "Only the owner can draw winning ticket");

        uint256 randomNum = random();
        uint256 randomIndex = (randomNum % (tickets.length - 0 + 1)) + 0;

        winningTicket = tickets[randomIndex];
        splitRafflePot(tickets[randomIndex]);

        emit RaffleCompleted(winningTicket, winnersTakeOfThePot);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        msg.sender,
                        tickets.length
                    )
                )
            );
    }

    function splitRafflePot(address _winner) private {
        require(raffleClosed != true, "This raffle is already closed");
        require(address(this).balance > 2, "There is no raffle pot to split");

        raffleClosed = true;
        potBalance = 0;

        winnersTakeOfThePot = (address(this).balance * 50) / 100;
        (bool winnerTransfersuccess, ) = payable(_winner).call{
            value: winnersTakeOfThePot
        }("");
        require(winnerTransfersuccess, "Transfer unsuccessful");

        if (!winnerTransfersuccess) {
            raffleClosed = false;
            potBalance = address(this).balance;
        }

        (bool ownerTransfersuccess, ) = payable(owner).call{
            value: address(this).balance
        }("");

        require(ownerTransfersuccess, "Transfer unsuccessful");
    }
}
