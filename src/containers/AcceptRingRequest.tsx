import * as React from 'react';
import styled from 'styled-components/macro';

import { useParams, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import {
  state,
  setProposalInfoLoading,
  setProposalInfoData,
  setProposalInfoFailure,
  setProposalInfoError,
} from 'state';

import ConnectedAccountPill from 'components/ConnectedAccountPill';
import Container from 'components/common/wrappers/Container';
import AcceptRingRequestCard from 'components/AcceptRingRequestCard';
import FullPageSpinner from 'components/common/FullPageSpinner';

import rings from 'components/common/rings';

import getAccountInfo from 'utils/getAccountInfo';
import getActualSigners from 'utils/getActualSigners';
import { fetchIpfsJsonData } from 'apis/ipfs';
import { supabase } from 'util/supabase';
import previewRing from '../assets/images/preview-ring-1.png';

const AcceptRingRequestWrapper = styled.main`
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: 60px 0 160px 0;

  .connected-account-pill {
    margin-bottom: 20px;
  }

  & > ${Container} {
    max-width: 851px;
  }
`;

const AcceptRingRequest = (): JSX.Element => {
  const snap = useSnapshot(state);

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
      if (!proposalPubKey!) {
        return navigate('/');
      }

      (async () => {
        getProposalById();
      })();
    } catch (error) {
      console.log(error);
      setProposalInfoError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!proposal) {
    return <FullPageSpinner />;
  }

  return (
    <AcceptRingRequestWrapper>
      <ConnectedAccountPill className="connected-account-pill" />
      <Container>
        <AcceptRingRequestCard
          proposalPubKey={proposalPubKey!}
          proposerName={proposal?.your_name ?? ''}
          spouseName={proposal?.spouse_name ?? ''}
          proposerRing={previewRing}
          message={proposal?.message}
          signedBy={proposal?.your_wallet ?? ''}
          // qrCodeString={window.location.href}
        />
      </Container>
    </AcceptRingRequestWrapper>
  );
};

export default AcceptRingRequest;
