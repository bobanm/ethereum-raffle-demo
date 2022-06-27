import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { React, useState } from "react";
import WalletProvider from "./common/context/walletProvider";

const Root = () => {
    const [wallet, setWallet] = useState({
        accounts: []
    });

    return (
        <Router>
            <WalletProvider.Provider value={{ wallet, setWallet }}>
                <App />
            </WalletProvider.Provider>
        </Router>
    );
};

export default Root;
