import { useEffect, useState } from 'react';
import { requestAmount } from './APIs/requestAmout';
import './App.css';
import style from './style.module.css';
import './connect';
import NativeSelectDemo from './NativeSelectDemo/NativeSelectDemo';

function App() {
  const [status, setStatus] = useState('pending')
  const [available, setAvailable] = useState(0)
  const [account, setAccount] = useState(null)
  const [metaDatas, setMetaDatas] = useState([]);

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
      setAccount(parseInt(detail.account));
      setAvailable(parseInt(detail.available));
      setStatus('connected')
    })

  }, [])

  const handleConnect = () => {
    window.flatusConnectToMetamask();
  }

  const handleMintAmountChange = (amount) => {
    requestAmount(account, amount)
      .then(({ metaDatas }) => {
        setMetaDatas(metaDatas)
      })
  }

  const handleMint = () => {
    console.log('go mint',metaDatas);
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
            : null}
    </div>
  );
}

export default App;
