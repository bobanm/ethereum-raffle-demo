/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.7",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        goerli: {
            url: "https://eth-goerli.alchemyapi.io/v2/v6HqV_qXxb_GcN30uMSQpOgZrQtqGEVE",
            accounts: [
                "075320ef649362f3d5679811b1817d7d41ef37b75256671af2b14144eb98166c"
            ]
        }
    }
};
