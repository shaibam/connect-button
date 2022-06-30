import { useEffect, useState } from 'react';
import { requestAmount } from './APIs/requestAmout';
import './App.css';
import style from './style.module.css';
import './connect';
import NativeSelectDemo from './NativeSelectDemo/NativeSelectDemo';
import { sendMoney } from './js/sendMoney';
import { saveTransaction } from './APIs/saveTransaction';

function App() {
  const [status, setStatus] = useState('pending')
  const [available, setAvailable] = useState(0)
  const [account, setAccount] = useState(null)
  const [metaDatas, setMetaDatas] = useState([]);
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => {
    window.addEventListener('metamask-missing', () => {
      window.elementorProFrontend.modules.popup.showPopup({ id: 1323 })
    })
    window.addEventListener('please-connect-metamask', () => {
      setStatus('please-connect-metamask')
    })
    window.addEventListener('checking-db', () => {
      setStatus('checking-db')
    })
    window.addEventListener('connected', ({ detail }) => {
      console.log({ detail });
      setAccount(detail.account);
      setAvailable(parseInt(detail.available));
      setStatus('connected')
    })
  }, [])

  const handleConnect = () => {
    window.flatusConnectToMetamask();
  }

  const handleMintAmountChange = (amount) => {
    requestAmount(account, amount)
      .then((metaDatas) => {
        setMetaDatas(metaDatas)
      })
  }

  const handleMint = async () => {
    console.log('go mint', metaDatas);
    setStatus('minting')
    const signedTx = await sendMoney(account, metaDatas[0].url)
    if (!signedTx?.transactionHash) {
      alert('Transaction failed')
    } else {
      const result = await saveTransaction(metaDatas[0].url, signedTx?.transactionHash);
      console.log(result);
      setStatus('minted');
      setTransactionHash(signedTx?.transactionHash);
    }
  }

  if (status === 'pending') return (<span>Loading...</span>);

  return (
    <div className="App">
      {status === 'please-connect-metamask' ?
        <button onClick={handleConnect}>Connect</button>
        :
        status === 'checking-db' ?
          <span>Checking DB...</span>
          : status === 'connected' ?
            <div>
              <NativeSelectDemo
                available={available}
                onChange={handleMintAmountChange}
              />
              <button
                className={style.mintButton}
                disabled={!metaDatas.length}
                onClick={handleMint}>Mint</button>
            </div>
            : status === 'minting' ?
              <span>Minting.... please wait</span>
              : status === 'minted' ?
                <>
                  <span>Minted {transactionHash} </span>
                  <a href='https://testnets.opensea.io/'>Check your account at Opesea (rinkeby)</a>
                </>
                : null
      }
    </div>
  );
}

export default App;
