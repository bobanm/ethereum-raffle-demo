// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const contractAddress = "0xd30aA314e1ae61D9116c9640b16b9D72Bad82612";
const contractAddress = "0xA42cE3b97CD0ae6063D004f85BE4F5E21334cdB7";

const abi = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_costPerTicket",
                type: "uint256"
            }
        ],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "winningTicket",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "winnersTakeOfThePot",
                type: "uint256"
            }
        ],
        name: "RaffleCompleted",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "potBalance",
                type: "uint256"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "numberOfParticipants",
                type: "uint256"
            }
        ],
        name: "RafflePotUpdate",
        type: "event"
    },
    {
        inputs: [],
        name: "drawWinningTicket",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_numberOfTickets",
                type: "uint256"
            }
        ],
        name: "enterRaffle",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    {
        inputs: [],
        name: "getRaffleInformation",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];

export { contractAddress, abi };
