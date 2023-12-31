import * as React from 'react';
import styled from 'styled-components/macro';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnapshot } from 'valtio';

import {
  state,
  setProposalInfoLoading,
  setProposalInfoData,
  setProposalInfoFailure,
  setProposalInfoError,
  setAssetsData,
} from 'state';

import Container from 'components/common/wrappers/Container';
import FlexRowWrapper from 'components/common/wrappers/FlexRowWrapper';
import FlexColumnWrapper from 'components/common/wrappers/FlexColumnWrapper';
import FormInput from 'components/form-elements/FormInput';
import SolidButton from 'components/common/SolidButton';
import ProposalLink from 'components/ProposalLink';
import SignerCard from 'components/SignerCard';
import Spinner from 'components/common/Spinner';
import ConnectWalletButton from 'components/ConnectWalletButton';
import FullPageSpinner from 'components/common/FullPageSpinner';

import { getProvider } from 'utils/getProvider';
import { fetchIpfsJsonData, uploadJsonToIpfs } from 'apis/ipfs';
import config from 'config';

import approveAssetData from 'utils/approveAssetData';
import getAccountInfo from 'utils/getAccountInfo';
import getActualSigners from 'utils/getActualSigners';

const defaultValues = {
  percentageSplit: null,
  percentageIncaseOfDivorce: null,
};

const validationSchema = Yup.object({
  percentageSplit: Yup.number().positive().integer().min(0).max(100).required(),
  percentageIncaseOfDivorce: Yup.number().positive().integer().min(0).max(100).required(),
}).required();

const ApproveAssetFormWrapper = styled.div`
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
    .asset-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1.5fr 4fr 1fr;
      margin-bottom: 32px;

      ${FlexColumnWrapper} {
        width: auto;
      }

      img {
        width: 74px;
        height: 74px;
        background: #ececec;
      }

      .asset-name {
        font-weight: 600;
        font-size: 14px;
        line-height: 17px;

        color: #000000;
        margin-bottom: 8px;
      }

      .asset-description {
        font-size: 18px;
        line-height: 22px;

        color: rgba(0, 0, 0, 0.58);
      }

      label {
        display: block;
        font-weight: 500;
        font-size: 11px;
        line-height: 13px;
        letter-spacing: 0.085em;

        color: rgba(0, 0, 0, 0.41);
        margin-bottom: 13px;
      }

      .value {
        font-weight: 600;
        font-size: 24px;
        line-height: 29px;

        color: #000000;
      }
    }

    .terms {
      margin-bottom: 40px;

      h4 {
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;

        color: rgba(6, 6, 6, 0.4);
        margin-bottom: 12px;
      }

      ${FlexRowWrapper} {
        align-items: center;
        margin-bottom: 24px;

        &:last-of-type {
          margin-bottom: 0;
        }

        .dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          margin-right: 18px;

          background: #292735;
        }

        .term {
          width: 100%;
          font-size: 17px;
          line-height: 21px;

          color: rgba(0, 0, 0, 0.37);
        }
      }
    }

    form {
      margin-top: 24px;
      width: 100%;
      max-width: 455px;

      .percentage-input-wrapper {
        position: relative;

        p {
          position: absolute;
          top: 50%;
          right: 32px;
          transform: translateY(-80%);

          font-weight: 500;
          font-size: 18px;
          line-height: 22px;

          color: #000000;
        }
      }

      button.solid-button {
        margin-top: 45px;
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
  }
`;

const ApproveAssetForm = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { proposalPubKey, ipfsCid } = useParams<{ proposalPubKey: string; ipfsCid: string }>();
  const navigate = useNavigate();

  const { register, watch, handleSubmit } = useForm({
    defaultValues,
    // resolver: yupResolver(validationSchema),
  });

  const [percentageSplit, percentageIncaseOfDivorce] = watch(['percentageSplit', 'percentageIncaseOfDivorce']);

  const snap = useSnapshot(state);

  React.useEffect(() => {
    try {
      (async () => {})();
    } catch (error) {
      console.log(error);
      setProposalInfoError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (d: typeof defaultValues) => {
    try {
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
    <ApproveAssetFormWrapper>
      <Container>
        <FlexRowWrapper>
          <FlexColumnWrapper className="col-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FlexRowWrapper>
                <div className="asset-grid">
                  <img src="" alt="" />
                  <FlexColumnWrapper>
                    <p className="assetName">New York House</p>
                    <p className="asset-description">Our House in New York</p>
                  </FlexColumnWrapper>
                  <FlexColumnWrapper>
                    <label>Value</label>
                    <h2 className="value">$1.5M</h2>
                  </FlexColumnWrapper>
                </div>
              </FlexRowWrapper>
              <FlexColumnWrapper className="terms">
                <h4>Terms</h4>
                <FlexRowWrapper>
                  <div className="dot" />
                  <p className="term">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do deserunt ullamco deserunt
                  </p>
                </FlexRowWrapper>
                <FlexRowWrapper>
                  <div className="dot" />
                  <p className="term">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do deserunt ullamco deserunt
                  </p>
                </FlexRowWrapper>
              </FlexColumnWrapper>
              <FlexRowWrapper className="percentage-input-wrapper">
                <FormInput
                  type="number"
                  step={1}
                  min={0}
                  max={100}
                  placeholder="Percentage Split"
                  {...register('percentageSplit')}
                />
                {percentageSplit ? (
                  <p>
                    {percentageSplit}% : {100 - percentageSplit}%
                  </p>
                ) : null}
              </FlexRowWrapper>
              <FlexRowWrapper className="percentage-input-wrapper">
                <FormInput
                  type="number"
                  step={1}
                  min={0}
                  max={100}
                  placeholder="Percentage Incase of Divorce"
                  {...register('percentageIncaseOfDivorce')}
                />
                {percentageIncaseOfDivorce ? (
                  <p>
                    {percentageIncaseOfDivorce}% : {100 - percentageIncaseOfDivorce}%
                  </p>
                ) : null}
              </FlexRowWrapper>
              {snap.isWalletConnected ? (
                <SolidButton type="submit" className="solid-button">
                  {isSubmitting && <Spinner className="spinner" />}
                  {isSubmitting ? 'Signing...' : 'SIGN ASSET'}
                </SolidButton>
              ) : (
                <ConnectWalletButton className="connect-wallet-button" />
              )}
            </form>
          </FlexColumnWrapper>
          <FlexColumnWrapper className="col-2">
            <Container>
              <ProposalLink link={window.location.href} />
              <h4>Signed By</h4>
              <SignerCard
                signerName="Rahul Kumar"
                signerAccountAddress="FnPXxM4KsAbakgtAkXYVSvuQ8Pmv5b5eeP3APTPM6fhd"
              />
              <h4>Waiting For</h4>
              <SignerCard
                className="signer-card"
                signerName={snap.proposalInfo.data?.spouseName ?? ''}
                signerAccountAddress={snap.proposalInfo.data?.signers[1] ?? ''}
              />
            </Container>
          </FlexColumnWrapper>
        </FlexRowWrapper>
      </Container>
    </ApproveAssetFormWrapper>
  );
};

export default ApproveAssetForm;
