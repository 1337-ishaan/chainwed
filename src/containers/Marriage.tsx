import * as React from 'react';
import styled from 'styled-components/macro';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IoLink, IoLogoTwitter, IoLogoFacebook } from 'react-icons/io5';
import { HiExternalLink } from 'react-icons/hi';
import { useSnapshot } from 'valtio';
import { toast } from 'react-toastify';
import {
  state,
  setProposalInfoLoading,
  setProposalInfoData,
  setProposalInfoFailure,
  setProposalInfoError,
} from 'state';

import Container from 'components/common/wrappers/Container';
import FlexColumnWrapper from 'components/common/wrappers/FlexColumnWrapper';
import FlexRowWrapper from 'components/common/wrappers/FlexRowWrapper';
import SectionTitle from 'components/common/SectionTitle';
import MarriageCertificate from 'components/MarriageCertificate';
import BlessedByCard from 'components/BlessedByCard';
import MarriageInfoCard from 'components/MarriageInfoCard';
import FullPageSpinner from 'components/common/FullPageSpinner';

import getAccountInfo from 'utils/getAccountInfo';
import getActualSigners from 'utils/getActualSigners';
import { fetchIpfsJsonData } from 'apis/ipfs';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { supabase } from 'util/supabase';
import { useAccount } from 'wagmi';

const MarriageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: 80px 0 160px 0;

  & > ${Container} {
    max-width: 1120px;
  }

  & > ${Container} > ${FlexRowWrapper} {
    justify-content: space-between;

    & > ${FlexColumnWrapper} {
      &:first-of-type {
        flex: 0 1 75%;
      }

      &:last-of-type {
        flex: 0 1 23%;
      }
    }
  }

  & > ${Container} > ${FlexRowWrapper} > .col-1 {
    justify-content: flex-end;

    & > ${FlexRowWrapper} {
      align-items: center;

      margin-bottom: 45px;

      &:last-of-type {
        margin-bottom: 0;
        justify-content: center;
      }

      & > .section-title {
        margin-right: 24px;
      }

      & > p {
        font-family: var(--pt-serif);
        font-weight: normal;
        font-size: 33px;
        line-height: 44px;

        color: rgba(0, 0, 0, 0.47);

        display: flex;
        align-items: center;

        a {
          text-decoration: none;
          color: inherit;
        }
      }
    }
  }

  & > ${Container} > ${FlexRowWrapper} > .col-2 {
    margin-top: 44px;
    & > ${FlexRowWrapper} {
      justify-content: flex-end;
      margin-bottom: 32px;

      a {
        text-decoration: none;
        color: black;
        margin-right: 20px;

        &:last-of-type {
          margin-right: 0;
        }
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .marriage-info-card {
      margin-bottom: 24px;
    }
  }
`;

const Marriage = (): JSX.Element => {
  const snap = useSnapshot(state);
  const { address } = useAccount();
  const { proposalPubKey } = useParams<{ proposalPubKey: string }>();
  const navigate = useNavigate();

  const [proposal, setProposal] = React.useState<any>();

  const getProposalById = async () => {
    let { data: proposalData, error } = await supabase.from('proposals').select('*').eq('marriageId', proposalPubKey);
    if (!error) {
      setProposal(proposalData?.[0]);
    }
  };

  React.useEffect(() => {
    try {
      (async () => {
        toast.success("Congratulations to you guys! We're more than happy!");
        getProposalById();
      })();
    } catch (error) {
      console.log(error);
      setProposalInfoError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (snap.proposalInfo.isLoading) {
  //   return <FullPageSpinner />;
  // }

  return (
    <MarriageWrapper>
      <Container>
        <FlexRowWrapper>
          <FlexColumnWrapper className="col-1">
            <FlexRowWrapper>
              <SectionTitle className="section-title">Blockchain Wedding</SectionTitle>
              {/* <p>#2343343</p> */}
              {address ? (
                <p>
                  <Link to="/assets">View Assets</Link>&nbsp;&nbsp;
                  <HiExternalLink />
                </p>
              ) : (
                <ConnectWalletButton />
              )}
            </FlexRowWrapper>
            <FlexRowWrapper>
              <MarriageCertificate
                proposerName={proposal?.your_name ?? ''}
                spouseName={proposal?.spouse_name ?? ''}
                // proposerRing={snap.proposalInfo.data?.proposerRing ?? rings[0]}
                // signedBy={proposal?.your_wallet ?? ''}
                engagementDate={proposal?.created_at ?? Date().toString()}
                proposerVows={
                  'Our memories will forever be timestamped on the blockchain of our love. I promise to cherish every moment we create together and ensure they are never lost or forgotten.'
                }
                spouseVows={
                  'As we exchange our digital vows on this blockchain, consider these words as our love tokens. I promise to accumulate and invest in our love daily, growing our digital wealth together.' ??
                  ''
                }
                qrCodeString={window.location.href}
              />
            </FlexRowWrapper>
          </FlexColumnWrapper>
          <FlexColumnWrapper className="col-2">
            <FlexRowWrapper>
              <a href={window.location.href} target="_blank" rel="noopener noreferrer">
                <IoLink />
              </a>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <IoLogoTwitter />
              </a>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <IoLogoFacebook />
              </a>
            </FlexRowWrapper>
            <MarriageInfoCard
              className="marriage-info-card"
              proposalPubKey={proposalPubKey}
              showViewOnExplorer={true}
              showBlessButton={true}
              showFileDivorceButton={true}
            />
            <BlessedByCard
              blessings={[
                {
                  message:
                    'Hey Dear, this seems like the smartest move you guys have evermade, I hope we had ChainWed during my marriage days :")',
                  blessedBy: 'Dad',
                  accountAddress: 'FnPXxM4KsAbakgtAkXYVSvuQ8Pmv5b5eeP3APTPM6fhd',
                  value: 18,
                },
                // {
                //   message:
                //     'Hey kiddos, very happy for you guys! Hope you have a great life ahead! Sending some digital gold, love you guys!',
                //   blessedBy: 'Mom',
                //   accountAddress: 'FnPXxM4KsAbakgtAkXYVSvuQ8Pmv5b5eeP3APTPM6fhd',
                //   value: 21,
                // },
              ]}
            />
          </FlexColumnWrapper>
        </FlexRowWrapper>
      </Container>
    </MarriageWrapper>
  );
};

export default Marriage;
