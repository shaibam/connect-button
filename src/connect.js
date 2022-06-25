/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

import detectEthereumProvider from '@metamask/detect-provider';
const doThis = async () => {
    // const connectBtn = document.getElementById('connectButton');
    // connectBtn.classList.remove('disabled')

    const ethereum = window.ethereum;

    // this returns the provider, or null if it wasn't detected
    const provider = await detectEthereumProvider();

    // function showConnectMetamaskPopup() {
        // window.elementorProFrontend.modules.popup.showPopup({ id: 1323 })
    // }

    if (provider) {
        startApp(provider); // Initialize your app
    } else {
        console.log('Please install MetaMask!');
        // connectBtn.addEventListener('click', showConnectMetamaskPopup);
        let eventMetamaskMissing = new Event('metamask-missing');
        window.dispatchEvent(eventMetamaskMissing);
        return;
    }

    function startApp(provider) {
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
            console.error('Do you have multiple wallets installed?');
        }
        // Access the decentralized web!
    }

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    const chainId = await ethereum.request({ method: 'eth_chainId' });
    handleChainChanged(chainId);

    ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
        // We recommend reloading the page, unless you must do otherwise
        // window.location.reload();
    }

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/

    let currentAccount = null;
    ethereum
        .request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
            // Some unexpected error.
            // For backwards compatibility reasons, if no accounts are available,
            // eth_accounts will return an empty array.
            console.error(err);
        });

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on('accountsChanged', handleAccountsChanged);

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
        // connectBtn.removeEventListener('click', showConnectMetamaskPopup);
        if (accounts.length === 0) {

            // MetaMask is locked or the user has not connected any accounts
            console.log('Please connect to MetaMask.');
            let eventPleaseConnectAccount = new Event('please-connect-metamask');
            window.dispatchEvent(eventPleaseConnectAccount);
            // connectBtn.style.display = 'block';
            // hello.style.display = 'none';
            // connectBtn.classList.remove('disabled')
            // connectBtn.addEventListener('click', connect);
        } else if (accounts[0] !== currentAccount) {
            currentAccount = accounts[0];
            let checkingDB = new Event('checking-db');
            window.dispatchEvent(checkingDB);
            fetch('/scripts/check.php', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ account: currentAccount }),
            }).then(r => {
                return r.json()
            }).then(r => {
                let connected = new CustomEvent('connected', { detail: r, account: currentAccount });
                window.dispatchEvent(connected);
            })
        }
    }

    /*********************************************/
    /* Access the user's accounts (per EIP-1102) */
    /*********************************************/

    // You should only attempt to request the user's accounts in response to user
    // interaction, such as a button click.
    // Otherwise, you popup-spam the user like it's 1999.
    // If you fail to retrieve the user's account(s), you should encourage the user
    // to initiate the attempt.

    // document.getElementById('connectButton', connect);    
    // While you are awaiting the call to eth_requestAccounts, you should disable
    // any buttons the user can click to initiate the request.
    // MetaMask will reject any additional requests while the first is still
    // pending.
    function connect() {
        ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                if (err.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            });
    }

    window.flatusConnectToMetamask = connect;

};

doThis();

// const ol = () => {
//     setTimeout(() =>{
//         const connectBtn = document.getElementById('connectButton');
//         if (connectBtn) {
//             doThis();
//         } else {
//             ol();
//         }
//     },100)
// }

// ol();