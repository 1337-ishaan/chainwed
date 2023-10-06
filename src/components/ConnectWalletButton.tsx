import styled from 'styled-components/macro';
import clsx from 'clsx';

import { state } from 'state';
import { getProvider } from 'utils/getProvider';

// import phantomLogo from 'assets/logos/phantom.png';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const ConnectWalletButtonWrapper = styled.div``;

interface ConnectWalletButtonProps {
  className?: string;
}

const ConnectWalletButton = ({ className }: ConnectWalletButtonProps): JSX.Element => {
  return (
    <ConnectWalletButtonWrapper
      className={clsx(className)}
      onClick={() => console.log('clicked connect button')}
      // onClick={() => {
      //   const provider = getProvider();
      //   if (!provider) {
      //     window.location.href = 'https://phantom.app';
      //   }
      //   provider
      //     ?.connect()
      //     .then(() => {
      //       console.log('connected');
      //       state.isWalletConnected = true;
      //       state.walletAddress = provider.publicKey?.toBase58() ?? '';
      //       state.autoApprove = provider.autoApprove ?? false;
      //     })
      //     .catch((err) => console.log(err));
      // }}
    >
      <ConnectButton />
      {/* <img className="phantom-logo" src={phantomLogo} alt="" /> Connect Wallet */}
    </ConnectWalletButtonWrapper>
  );
};

export default ConnectWalletButton;
