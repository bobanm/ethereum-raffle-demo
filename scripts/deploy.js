async function deploy() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());
    const Raffle = await ethers.getContractFactory("Raffle");
    const raffleInstance = await Raffle.deploy(500000000000);

    console.log("Anticipated address: %s", raffleInstance.address);

    console.log("getting deployed instance");
    const tx = await raffleInstance.deployed();
    console.log("Deployed instance: %s", tx);

    console.log("getting deploy transaction");
    const deployedTx = await tx.deployTransaction.wait();
    console.log("getting deploy transaction: %s", deployedTx);

    console.log("Raffle Address: ", deployedTx.contractAddress);
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("Deployment Error: ", error);
        process.exit(1);
    });
