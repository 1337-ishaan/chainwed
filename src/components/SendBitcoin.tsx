import { Marriage } from 'constants/contracts/Marriage';
import React, { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import SolidButton from './common/SolidButton';
import FormInput from './form-elements/FormInput';

function SendBitcoin({ className }: { className: string }) {
  const [amount, setAmount] = useState('');
  const [contract, setContract] = useState(Marriage.contractAddress);
  const [params, setParams] = useState('');

  const sendTransaction = async () => {
    const bitcoinTSSAddress = 'tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur';
    const wallet = (window as any)?.xfi;

    if (wallet === undefined) {
      return alert('XDEFI wallet not found');
    }

    const account = (await wallet?.bitcoin?.getAccounts())?.[0];

    if (account === undefined) {
      return alert('No account found');
    }

    const contractValue = contract.replace(/^0x/, '');
    const paramsValue = params.replace(/^0x/, '');

    let memo = '';

    if (contractValue.length === 40) {
      memo = `hex::${contractValue}${paramsValue}`;
    }

    const amountValue = parseFloat(amount) * 1e8;

    if (isNaN(amountValue)) {
      return alert('Amount must be a number');
    }

    (window as any).xfi.bitcoin.request(
      {
        method: 'transfer',
        params: [
          {
            feeRate: 10,
            from: account,
            recipient: bitcoinTSSAddress,
            amount: {
              amount: amountValue,
              decimals: 8,
            },
            memo,
          },
        ],
      },
      (error: any, result: any) => {
        if (!error && result) {
          alert('Blesssings sent');
        }
        console.log(error, result);
      }
    );
  };

  return (
    <div style={{ height: 'fit-content' }}>
      <FormInput
        type="number"
        value={amount}
        min={0.0001}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in ₿itcoin(s)"
      ></FormInput>
      {/* <input type="number" value={amount}  /> */}

      {/* <input
        type="text"
        value={params}
        onChange={(e) => setParams(e.target.value)}
        placeholder="Contract call parameters"
      /> */}
      <SolidButton className={className} onClick={sendTransaction}>
        <FaWallet />
        Bless with ₿itcoin(s)
      </SolidButton>
    </div>
  );
}

export default SendBitcoin;
