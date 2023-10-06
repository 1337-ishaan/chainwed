import * as React from 'react';
import styled from 'styled-components/macro';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import millify from 'millify';

import {
  state,
  setProposalInfoLoading,
  setProposalInfoData,
  setProposalInfoFailure,
  setProposalInfoError,
  setAssetsData,
} from 'state';
import { toast } from 'react-toastify';

import Container from 'components/common/wrappers/Container';
import FlexRowWrapper from 'components/common/wrappers/FlexRowWrapper';
import FlexColumnWrapper from 'components/common/wrappers/FlexColumnWrapper';
import SolidButton from 'components/common/SolidButton';
import ProposalLink from 'components/ProposalLink';
import SignerCard from 'components/SignerCard';
import AssetCardMini from 'components/AssetCardMini';
import Spinner from 'components/common/Spinner';
import ConnectWalletButton from 'components/ConnectWalletButton';
import FullPageSpinner from 'components/common/FullPageSpinner';

import { getProvider } from 'utils/getProvider';
import { uploadJsonToIpfs } from 'apis/ipfs';
import config from 'config';
import divorceData from 'utils/divorceData';
import getAccountInfo from 'utils/getAccountInfo';
import getActualSigners from 'utils/getActualSigners';
import { fetchIpfsJsonData } from 'apis/ipfs';
import { supabase } from 'util/supabase';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Marriage } from 'constants/contracts/Marriage';

const DivorceFormWrapper = styled.div`
  width: 100%;
  height: auto;

  & > ${Container} > ${FlexRowWrapper} > ${FlexColumnWrapper} {
    align-items: center;
    justify-content: flex-start;

    &:first-of-type {
      border-right: 1px solid #eaeaea;
    }
  }

  & > ${Container} > ${FlexRowWrapper} > .col-1 {
    form {
      margin-top: 24px;
      width: 100%;
      max-width: 526px;

      label {
        display: block;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;

        color: rgba(6, 6, 6, 0.4);
        margin-bottom: 32px;
      }

      .asset-card {
        margin-bottom: 32px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      button.solid-button {
        margin-top: 45px;
        background: #f36a71 !important;
        position: relative;

        display: grid;
        place-items: center;

        .spinner {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 15px;
        }
      }

      .connect-wallet-button {
        width: 100%;
        margin: 45px 0 0 0;
      }
    }
  }

  & > ${Container} > ${FlexRowWrapper} > .col-2 {
    ${Container} {
      width: 100%;
      max-width: 517px;
    }

    h4 {
      width: 100%;
      margin-top: 24px;
      margin-bottom: 21px;

      font-weight: 500;
      font-size: 19px;
      line-height: 23px;
      letter-spacing: 0.085em;
      text-transform: uppercase;

      color: rgba(0, 0, 0, 0.41);
    }

    .signer-card {
      margin-bottom: 20px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
    .solid-button {
      margin-top: 18px;
    }
  }
`;

const DivorceForm = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { proposalPubKey } = useParams<{ proposalPubKey: string }>();
  const { address } = useAccount();
  const navigate = useNavigate();
  const [proposal, setProposal] = React.useState<any>();

  const { config: marriageConfig } = usePrepareContractWrite({
    address: Marriage.contractAddress,
    abi: Marriage.abi,
    functionName: 'divorce',
    args: [+proposalPubKey!],
    // to change estateId
    enabled: isSubmitting,
    onSuccess(data) {},
    onError(err) {
      console.log('on error proposal sent', err);
    },
  });
  const { data: divorceData, writeAsync: divorce, isSuccess: isDivorceSuccess } = useContractWrite(marriageConfig);

  const getProposalById = async () => {
    let { data: proposalData, error } = await supabase.from('proposals').select('*').eq('marriageId', proposalPubKey);
    if (!error) {
      setProposal(proposalData?.[0]);
    }
  };
  React.useEffect(() => {
    navigate('/');
    toast.success('Divorce will be successfully completed when the other person also signs and divorces');
  }, [divorceData?.hash]);

  const snap = useSnapshot(state);

  const updateProposalInDb = async () => {
    const { data, error } = await supabase
      .from('proposals')
      .update({ status: 'Divorced' })
      .eq('marriageId', proposalPubKey)
      .select();
    console.log(data, 'supabase data', error, 'supabase error;');
  };

  React.useEffect(() => {
    try {
      (async () => {
        getProposalById();
      })();
    } catch (error) {
      console.log(error);
      setProposalInfoError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDivorce = async () => {
    await divorce?.();
    await updateProposalInDb();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await onDivorce();
    } catch (error: any) {
      console.warn(error);
      if (error?.code === 4001 && error?.message === 'User rejected the request.') {
        alert(error?.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (snap.proposalInfo.isLoading) {
  //   return <FullPageSpinner />;
  // }

  return (
    <DivorceFormWrapper>
      <Container>
        <FlexRowWrapper>
          <FlexColumnWrapper className="col-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label>After Divorce</label>
              {snap.assets.length ? (
                snap.assets.map((asset, i) => (
                  <AssetCardMini
                    key={i}
                    className="asset-card"
                    assetImage={asset.images[0] ?? ''}
                    assetName={asset.assetName}
                    assetDescription={asset.assetDescription}
                    assetValue={millify(+asset.assetValue)}
                    assetOwnershipPercentage={`${asset.percentageSplit}:${100 - asset.percentageSplit}`}
                  />
                ))
              ) : (
                <p className="no-assets">No Assets found!</p>
              )}
              {address ? (
                <SolidButton type="submit" className="solid-button">
                  {isSubmitting && <Spinner className="spinner" />}
                  {isSubmitting ? 'Signing...' : 'SIGN AND DIVORCE'}
                </SolidButton>
              ) : (
                <ConnectWalletButton className="connect-wallet-button" />
              )}
            </form>
          </FlexColumnWrapper>
          <FlexColumnWrapper className="col-2">
            <Container>
              <ProposalLink link={window.location.href} />
              <h5 style={{ color: 'red', margin: '12px 0' }}>Stay Strong! You should re-consider about this action </h5>
              <SignerCard
                className="signer-card"
                signerName={proposal?.your_name ?? ''}
                signerAccountAddress={proposal?.your_wallet ?? ''}
              />
              <SignerCard
                className="signer-card"
                signerName={proposal?.spouse_name ?? ''}
                signerAccountAddress={proposal?.spouse_wallet ?? ''}
              />
            </Container>
          </FlexColumnWrapper>
        </FlexRowWrapper>
      </Container>
    </DivorceFormWrapper>
  );
};

export default DivorceForm;
