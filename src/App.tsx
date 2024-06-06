import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounter } from './hooks/useCounter';
import { useTonConnect } from './hooks/useTonConnect';
import { fromNano } from '@ton/core';
import { useState } from 'react';
import WebApp from '@twa-dev/sdk';

function App() {
  const {
    counter_value,
    contract_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdraw,
  } = useCounter();
  const { connected } = useTonConnect();
  
  const [depositVal, setDepositValue] = useState<number>(0);
  const handleDeposit = (event: any) => {
    setDepositValue(event.target.value);
  };

  const [withdrawVal, setWithdrawValue] = useState<number>(0);
  const handleWithdraw = (event: any) => {
    setWithdrawValue(event.target.value);
  };

  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  return (
    <div className="Container">
      <div className="Header">
        <TonConnectButton/>
      </div>
      <div className="Content">
        <div className='Card'>
          <div>
            <b>Your platform is {WebApp.platform}</b>
          </div>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
        </div>

        <div className='Card'>
          <b>Our contract Balance</b>
          <div className='Hint'>{contract_balance !== null && fromNano(contract_balance)} TON</div>
        </div>
        
        <div className='Card'>
          <b>Counter Value</b>
          <div className='Hint'>{counter_value ?? "Loading..."}</div>
        </div>

        <div className='Card'>
          {!connected && (
            <button className='Button' onClick={() => { showAlert(); }} >
              Show Alert!
            </button>
          )}
          {connected && (
            <button className='Button' onClick={() => { sendIncrement(); }} >
              Increment
            </button>
          )}
        </div>
        

        {connected && (
          <div className='Card'>
            <input className='Input'
              type="number"
              value={depositVal}
              onChange={handleDeposit}
            />
            <button className='Button' onClick={() => { sendDeposit(depositVal) }}>
              Deposit
            </button>
        </div>
        )}

        {connected && (
          <div className='Card'>
            <input className='Input'
              type="number"
              value={withdrawVal}
              onChange={handleWithdraw}
            />
            <button className='Button' onClick={() => { sendWithdraw(withdrawVal) }}>
              Withdraw
            </button>
        </div>
        )}
      </div>
    </div>
  );
}

export default App