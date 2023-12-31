import * as React from 'react';
import styled from 'styled-components/macro';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { format } from 'date-fns';

import { useSnapshot } from 'valtio';

import {
  state,
  setProposalInfoLoading,
  setProposalInfoData,
  setProposalInfoFailure,
  setProposalInfoError,
} from 'state';

import Container from 'components/common/wrappers/Container';
import FlexRowWrapper from 'components/common/wrappers/FlexRowWrapper';
import FlexColumnWrapper from 'components/common/wrappers/FlexColumnWrapper';
import MarriagePreview from 'components/MarriagePreview';
import FormInput from 'components/form-elements/FormInput';
import FormTextArea from 'components/form-elements/FormTextArea';
import SolidButton from 'components/common/SolidButton';
import Spinner from 'components/common/Spinner';
import FullPageSpinner from 'components/common/FullPageSpinner';

import { getProvider } from 'utils/getProvider';
import { uploadJsonToIpfs } from 'apis/ipfs';
import config from 'config';

import getPubKeyFromSeed from 'utils/getPubKeyFromSeed';
import marriageData from 'utils/marriageData';
import getAccountInfo from 'utils/getAccountInfo';
import getActualSigners from 'utils/getActualSigners';
import { fetchIpfsJsonData } from 'apis/ipfs';
import extraData from 'utils/extraData';

const defaultValues = {
  marriageDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  proposerName: '',
  spouseName: '',
  proposerVows: '',
  spouseVows: '',
};

const validationSchema = Yup.object({
  marriageDate: Yup.string().required(),
  proposerName: Yup.string().required(),
  spouseName: Yup.string().required(),
  proposerVows: Yup.string().required(),
  spouseVows: Yup.string().required(),
}).required();

const MarriageFormWrapper = styled.div`
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
      max-width: 455px;

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
    }
  }

  & > ${Container} > ${FlexRowWrapper} > .col-2 {
    h4 {
      width: 100%;
      max-width: 517px;
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

const MarriageForm = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, watch, handleSubmit, setValue } = useForm({
    defaultValues,
    // resolver: yupResolver(validationSchema),
  });
  const formValues = watch();

  const navigate = useNavigate();

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
    <MarriageFormWrapper>
      <Container>
        <FlexRowWrapper>
          <FlexColumnWrapper className="col-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput type="datetime-local" placeholder="Pick a date" {...register('marriageDate')} />
              <FlexRowWrapper>
                <FormInput placeholder="Your name" style={{ marginRight: 10 }} {...register('proposerName')} readOnly />
                <FormInput
                  placeholder="Your spouse's name"
                  style={{ marginLeft: 10 }}
                  {...register('spouseName')}
                  readOnly
                />
              </FlexRowWrapper>
              <FormTextArea placeholder="Your vows" {...register('proposerVows')} />
              <FormTextArea placeholder="Your spouse's vows" {...register('spouseVows')} />
              <SolidButton type="submit" className="solid-button">
                {isSubmitting && <Spinner className="spinner" />}
                {isSubmitting ? 'Creating...' : 'CREATE CONTRACT'}
              </SolidButton>
            </form>
          </FlexColumnWrapper>
          <FlexColumnWrapper className="col-2">
            <h4>Preview</h4>
            <MarriagePreview
              proposerName={formValues.proposerName || (snap.proposalInfo?.data?.proposerName as string)}
              spouseName={formValues.spouseName || (snap.proposalInfo?.data?.spouseName as string)}
              engagementDate={snap.proposalInfo?.data?.engagementDate as string}
              proposerVows={formValues.proposerVows}
              spouseVows={formValues.spouseVows}
              qrCodeString={window.location.href}
            />
          </FlexColumnWrapper>
        </FlexRowWrapper>
      </Container>
    </MarriageFormWrapper>
  );
};

export default MarriageForm;
