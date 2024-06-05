import { useEffect, useState } from "react";
import { Counter } from "../contracts/Counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useCounter() {
  const client = useTonClient();

  const { sender } = useTonConnect();
    
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const counter = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse("EQDVj8E6k6I08QPk4mG6NJJCgEF7TVRl9olOsvEO2PnH17au")
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counter) return;
      setContractData(null);
      const val = await counter.getData();
      const balance = await counter.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance.number);
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [counter]);

  return {
    contract_address: counter?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: () => {
      return counter?.sendIncrement(sender, toNano(0.001), 1);
    },
    sendDeposit: (val: number) => {
      return counter?.sendDeposit(sender, toNano(val));
    },
    sendWithdraw: (val: number) => {
      return counter?.sendWithdraw(sender, toNano(0.01), toNano(val));
    },
  };
}