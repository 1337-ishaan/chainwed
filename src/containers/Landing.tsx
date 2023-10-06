import styled from 'styled-components/macro';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

import { state } from 'state';

import SectionTitle from 'components/common/SectionTitle';
import ConnectWalletButton from 'components/ConnectWalletButton';
import SolidButton from 'components/common/SolidButton';
import { useAccount } from 'wagmi';
import React from 'react';

const LandingWrapper = styled.main`
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .section-title {
    font-size: 55px;
    line-height: 73px;
    margin-bottom: 53px;
  }

  .solid-button {
    width: 270px;
    position: relative;

    display: grid;
    place-items: center;

    svg {
      width: 32px;
      height: 32px;
      position: absolute;
      right: 24px;
    }
  }
`;

const Landing = (): JSX.Element => {
  const navigate = useNavigate();
  const snap = useSnapshot(state);
  const { address } = useAccount();
  React.useEffect(() => {
    if (address) {
      // navigate('/proposal');
    }
  }, []);
  return (
    <LandingWrapper>
      <SectionTitle className="section-title">Blockchain Marriage Certificates</SectionTitle>
      {address ? (
        <SolidButton
          className="solid-button"
          onClick={() => {
            navigate('/proposal');
          }}
        >
          Proceed
          <BsArrowRight />
        </SolidButton>
      ) : (
        <ConnectWalletButton />
      )}
    </LandingWrapper>
  );
};

export default Landing;
