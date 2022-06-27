// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.4;

contract Raffle2 {
    address public owner;
    mapping(address => uint256) private participants;
    address[] private tickets;
    uint256 private nonce;
    bool private raffleClosed;
    uint256 private costPerTicketDefault = 100000000;
    uint256 private costPerTicket_;
    uint256 private potBalance_;
    uint256 private numberOfParticipants_;
    address private winningTicket_;
    uint256 private winnersTakeOfThePot_;

    constructor(uint256 _costPerTicket) {
        costPerTicket_ = _costPerTicket > 0
            ? _costPerTicket
            : costPerTicketDefault;

        owner = msg.sender;
        raffleClosed = false;
        potBalance_ = 0;
        numberOfParticipants_ = 0;
        winnersTakeOfThePot_ = 0;
    }

    function getRaffleInformation()
        external
        view
        returns (
            uint256 costPerTicket,
            uint256 numberOfParticipants,
            uint256 potBalance,
            uint256 winnersTakeOfThePot,
            address winningTicket
        )
    {
        return (
            costPerTicket_,
            numberOfParticipants_,
            potBalance_,
            winnersTakeOfThePot_,
            winningTicket_
        );
    }
}
