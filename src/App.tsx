import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GlobalStyles } from 'components/common/styles/GlobalStyles';
// rainbowkit
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, zetachainAthensTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import ProtectedRoute from 'components/ProtectedRoute';

import Landing from 'containers/Landing';

const Proposal = React.lazy(() => import('containers/Proposal'));
const SendNFTRing = React.lazy(() => import('containers/SendNFTRing'));
const SuccessfullyMinted = React.lazy(() => import('containers/SuccessfullyMinted'));
const AcceptRingRequest = React.lazy(() => import('containers/AcceptRingRequest'));
const AcceptingRing = React.lazy(() => import('containers/AcceptingRing'));
const Engagement = React.lazy(() => import('containers/Engagement'));

const StartNewMarriage = React.lazy(() => import('containers/StartNewMarriage'));
const Marriage = React.lazy(() => import('containers/Marriage'));
const Assets = React.lazy(() => import('containers/Assets'));
const AddAsset = React.lazy(() => import('containers/AddAsset'));
const ApproveAsset = React.lazy(() => import('containers/ApproveAsset'));
const Divorce = React.lazy(() => import('containers/Divorce'));

const App = () => {
  const { chains, publicClient } = configureChains([goerli, zetachainAthensTestnet], [publicProvider()]);
  const { connectors } = getDefaultWallets({
    appName: 'ChainWed',
    projectId: 'af9877be5b6b4f0a4a7e849bbd2c046f',
    chains,
  });
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <React.Fragment>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <GlobalStyles />
          <ToastContainer />
          <React.Suspense fallback={null}>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/proposal" element={<Proposal />} /> {/*TODO: Protected */}
                <Route path="/proposal/new" element={<SendNFTRing />} /> {/*TODO: Protected */}
                <Route path="/proposal/:proposalPubKey/created" element={<SuccessfullyMinted />} />{' '}
                {/*TODO: Protected */}
                <Route path="/proposal/:proposalPubKey/accept" element={<AcceptRingRequest />} />
                <Route path="/proposal/:proposalPubKey/accepting" element={<AcceptingRing />} /> {/*TODO: Protected */}
                <Route path="/marriage/:proposalPubKey" element={<Marriage />} />
                <Route path="/assets" element={<Assets />} /> {/*TODO: Protected */}
                <Route path="/add-asset" element={<AddAsset />} /> {/*TODO: Protected */}
                <Route path="/approve-asset/:proposalPubKey/:ipfsCid" element={<ApproveAsset />} />
                <Route path="/divorce/:proposalPubKey" element={<Divorce />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </React.Suspense>
        </RainbowKitProvider>
      </WagmiConfig>
    </React.Fragment>
  );
};

export default App;
