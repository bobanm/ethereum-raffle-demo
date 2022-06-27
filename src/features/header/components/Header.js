import { React, useState, useEffect, useRef, useContext } from "react";
import { Menu } from "semantic-ui-react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { displayNotification } from "../../../lib/utilities";
import {
    METAMASK_REQUEST_ACCOUNTS,
    METAMASK_ON_ACCOUNTS_CHANGE,
    INSTALL_METAMASK_TEXT,
    CONNECT_METAMASK_TEXT,
    METAMASK_CONNECTED_TEXT
} from "../../../common/constants";
import WalletProvider from "../../../common/context/walletProvider";
import ethereumApiFactory from "../../../ethereum/ethereumApi";

const Header = () => {
    const [metamaskButtonDetails, updateMetamaskButtonDetails] = useState({
        buttonDisabled: false,
        buttonText: INSTALL_METAMASK_TEXT
    });

    const { wallet, setWallet } = useContext(WalletProvider);
    const onboarding = useRef();
    const ethereumApi = useRef({});

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    });

    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum
                .request({ method: METAMASK_REQUEST_ACCOUNTS })
                .then((accounts) => setWallet({ accounts }))
                .catch((err) => {
                    displayMetamaskErrorNotification(err);
                });

            window.ethereum.on(METAMASK_ON_ACCOUNTS_CHANGE, (accounts) => {
                setWallet({ accounts });
            });

            const cleanupListeners = () => {
                const { ethereum } = window;
                if (ethereum && ethereum.off) {
                    ethereum.off(METAMASK_ON_ACCOUNTS_CHANGE, (accounts) =>
                        setWallet({ accounts })
                    );
                }
            };

            return cleanupListeners;
        }
    }, [setWallet]);

    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (wallet.accounts && wallet.accounts.length > 0) {
                updateMetamaskButtonDetails({
                    buttonDisabled: true,
                    buttonText: METAMASK_CONNECTED_TEXT
                });

                onboarding.current.stopOnboarding();
            } else {
                updateMetamaskButtonDetails({
                    buttonDisabled: false,
                    buttonText: CONNECT_METAMASK_TEXT
                });
            }
        }
    }, [wallet.accounts]);

    useEffect(() => {
        if (wallet.accounts && wallet.accounts.length > 0) {
            ethereumApi.current = ethereumApiFactory(window.ethereum);
        }
    });

    async function onMetamaskButtonClick() {
        if (!MetaMaskOnboarding.isMetaMaskInstalled())
            return onboarding.current.startOnboarding();

        try {
            const { ethereum } = window;
            const accounts = await ethereum.request({
                method: METAMASK_REQUEST_ACCOUNTS
            });
            setWallet({ accounts });
        } catch (error) {
            displayMetamaskErrorNotification(error);
        }
    }

    const displayMetamaskErrorNotification = (err) => {
        const display = {
            4001: displayNotification(
                "error",
                null,
                "Please connect with Metamask."
            ),
            "-32002": displayNotification(
                "info",
                null,
                "Request to connect with Metamask already exist.  Please check the browser extension to complete the request."
            )
        };
        if (!display[err.code])
            return displayNotification("error", null, err.message);

        return display[err.code];
    };

    return (
        <header>
            <div className="menu">
                <Menu pointing secondary>
                    <Menu.Menu>
                        <Menu.Item
                            onClick={onMetamaskButtonClick}
                            disabled={metamaskButtonDetails.buttonDisabled}
                            name={metamaskButtonDetails.buttonText}
                        />
                    </Menu.Menu>
                </Menu>
            </div>
        </header>
    );
};

export default Header;
