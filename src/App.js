import { useEffect, useState } from 'react';
import './App.css';
import './connect';

function App() {
  const [status, setStatus] = useState('pending')

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
      setStatus('connected')
    })

  }, [])

  const handleConnect = () => {
    window.flatusConnectToMetamask();
  }

  const handleMint = () => {
    console.log('go mint');
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
            <><button onClick={handleMint}>Mint</button></>
            : null}
    </div>
  );
}

export default App;
