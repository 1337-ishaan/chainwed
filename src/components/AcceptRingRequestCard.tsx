import styled from 'styled-components/macro';
import clsx from 'clsx';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';
import { state } from 'state';

import FlexColumnWrapper from 'components/common/wrappers/FlexColumnWrapper';
import FlexRowWrapper from 'components/common/wrappers/FlexRowWrapper';
import SolidButton from 'components/common/SolidButton';
import ConnectWalletButton from 'components/ConnectWalletButton';

import shortenWalletAddress from 'utils/shortenWalletAddress';

import accountPlaceholder from 'assets/images/account-placeholder.png';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Marriage } from 'constants/contracts/Marriage';
import { supabase } from 'util/supabase';
import React from 'react';

const AcceptRingRequestCardWrapper = styled.div`
  width: 100%;
  max-width: 851px;
  height: auto;

  padding: 38px 44px;

  background: #ffffff;
  box-shadow: 0px 4px 18px rgba(0, 0, 0, 0.16);
  border-radius: 15px;

  .row-1 {
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 24px;

    h4 {
      font-family: var(--prata);
      font-weight: normal;
      font-size: 23px;
      line-height: 32px;

      color: #000000;
    }
  }

  .row-2 {
    margin-bottom: 42px;
    justify-content: space-between;

    ${FlexColumnWrapper} {
      &:first-of-type {
        flex: 0 1 35%;
        align-items: center;
      }

      &:last-of-type {
        flex: 0 1 60%;
        align-items: flex-start;
      }

      justify-content: center;

      img {
        width: 100%;
        max-width: 227px;
        height: 227px;
        object-fit: contain;
      }

      .message {
        font-family: var(--prata);
        font-weight: normal;
        font-size: 25px;
        line-height: 34px;

        color: rgba(0, 0, 0, 0.37);
        margin-bottom: 28px;
      }

      h3 {
        font-family: var(--prata);
        font-weight: normal;
        font-size: 23px;
        line-height: 31px;

        color: #000000;
      }
    }
  }

  .row-3 {
    align-items: center;
    justify-content: center;

    margin-bottom: -25px;
    margin-left: 50px;

    .accept-ring-button {
      width: 270px;
      text-transform: uppercase;
      z-index: 2;
    }
  }

  .row-4 {
    min-height: 138px;
    justify-content: space-between;
    align-items: center;

    & > ${FlexColumnWrapper} {
      width: auto;
      min-height: 138px;

      &:first-of-type {
        justify-content: flex-end;
      }

      &:last-of-type {
        justify-content: center;
        align-items: center;
      }

      & > ${FlexRowWrapper} {
        margin-bottom: 28px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }

    .qr-wrapper {
      padding: 5px;
    }

    .signed-by {
      font-size: 19px;
      line-height: 23px;
      text-transform: uppercase;

      color: #6d6d6f;
    }

    .signer {
      width: auto;
      margin-right: 32px;
      align-items: center;

      &:last-of-type {
        margin-right: 0;
      }

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 13px;
      }

      p {
        font-size: 19px;
        line-height: 23px;
        text-transform: capitalize;

        color: #868686;
      }
    }
  }
`;

interface AcceptRingRequestCardProps {
  className?: string;
  proposalPubKey: string;
  proposerName: string;
  spouseName: string;
  proposerRing?: string;
  message: string;
  signedBy: string;
  qrCodeString?: string;
}

const AcceptRingRequestCard = ({
  className,
  proposalPubKey,
  proposerName,
  spouseName,
  proposerRing,
  message,
  signedBy,
}: // qrCodeString,
AcceptRingRequestCardProps): JSX.Element => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const snap = useSnapshot(state);
  const { address } = useAccount();
  const { config: marriageConfig } = usePrepareContractWrite({
    address: Marriage.contractAddress,
    abi: Marriage.abi,
    functionName: 'acceptProposal',
    args: [+proposalPubKey],
    enabled: !!address,
    onSuccess(data) {
      updateProposalInDb();
    },
    onError(err: any) {
      toast.error(err);
    },
  });

  const {
    data: acceptProposalData,
    writeAsync: acceptProposal,
    isSuccess: isAcceptProposalSuccess,
  } = useContractWrite(marriageConfig);

  console.log(acceptProposalData, 'apd');
  const updateProposalInDb = async () => {
    const { data, error } = await supabase
      .from('proposals')
      .update({ status: 'Married' })
      .eq('marriageId', proposalPubKey)
      .select();
    if (data) {
      // navigate(`/marriage/${proposalPubKey}`);
    }

    setIsSubmitting(false);
  };
  const storeAcceptance = async () => {
    setIsSubmitting(true);
    await acceptProposal?.();
  };

  React.useEffect(() => {
    if (acceptProposalData?.hash) {
      navigate(`/marriage/${proposalPubKey}`);
    }
  }, [acceptProposalData?.hash]);

  return (
    <AcceptRingRequestCardWrapper className={clsx(className)}>
      <FlexColumnWrapper>
        <FlexRowWrapper className="row-1">
          <h4>Dear {spouseName}</h4>,
        </FlexRowWrapper>
        <FlexRowWrapper className="row-2">
          <FlexColumnWrapper>
            <img src={proposerRing} alt="" />
          </FlexColumnWrapper>
          <FlexColumnWrapper>
            <p className="message">{message}</p>
            <h3>Yours, {proposerName}</h3>
          </FlexColumnWrapper>
        </FlexRowWrapper>
        <FlexRowWrapper className="row-3">
          {address ? (
            <SolidButton className="accept-ring-button" onClick={() => storeAcceptance()}>
              {isSubmitting ? 'Accepting' : 'Accept Ring'}
            </SolidButton>
          ) : (
            <ConnectWalletButton />
          )}
        </FlexRowWrapper>
        <FlexRowWrapper className="row-4">
          <FlexColumnWrapper>
            <FlexRowWrapper>
              <p className="signed-by">Signed By</p>
            </FlexRowWrapper>
            <FlexRowWrapper>
              <FlexRowWrapper className="signer">
                <img src={accountPlaceholder} alt="" />
                <p>{signedBy}</p>
              </FlexRowWrapper>
              {/* {signedBy.map((signer, i) => (
                <FlexRowWrapper key={i} className="signer">
                  <img src={accountPlaceholder} alt="" />
                  <p>{shortenWalletAddress(signer, 5)}</p>
                </FlexRowWrapper>
              ))} */}
            </FlexRowWrapper>
          </FlexColumnWrapper>
          <FlexColumnWrapper>
            <div className="qr-wrapper">
              <QRCode size={128} value={message} />
            </div>
          </FlexColumnWrapper>
        </FlexRowWrapper>
      </FlexColumnWrapper>
    </AcceptRingRequestCardWrapper>
  );
};

export default AcceptRingRequestCard;
