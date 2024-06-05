import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCounter } from './hooks/useCounter';
import { useTonConnect } from './hooks/useTonConnect';
import { fromNano } from '@ton/core';
import { useState } from 'react';

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

  return (
    <div className="container">
      <div className="header">
        <TonConnectButton/>
      </div>
      <div className="content">
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{contract_balance !== null && fromNano(contract_balance)} TON</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div className='Hint'>{counter_value ?? "Loading..."}</div>
        </div>

        {connected && (
          <a onClick={() => { sendIncrement(); }} >
            Increment
          </a>
        )}

        {connected && (
          <div>
            <input
              type="number"
              value={depositVal}
              onChange={handleDeposit}
            />
            <button onClick={() => { sendDeposit(depositVal) }}>
              Deposit
            </button>
        </div>
        )}

        {connected && (
          <div>
            <input
              type="number"
              value={withdrawVal}
              onChange={handleWithdraw}
            />
            <button onClick={() => { sendWithdraw(withdrawVal) }}>
              Withdraw
            </button>
        </div>
        )}
      </div>
    </div>
  );
}

export default App