import * as React from 'react';
import styled from 'styled-components/macro';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import Container from 'components/common/wrappers/Container';
import FlexRowWrapper from 'components/common/wrappers/FlexRowWrapper';
import FlexColumnWrapper from 'components/common/wrappers/FlexColumnWrapper';
import NftRingPreview from 'components/NftRingPreview';
import FormInput from 'components/form-elements/FormInput';
import FormTextArea from 'components/form-elements/FormTextArea';
import SolidButton from 'components/common/SolidButton';
import RingSelect from 'components/form-elements/RingSelect';
import Spinner from 'components/common/Spinner';
import previewRing from '../../assets/images/preview-ring-1.png';

import rings from 'components/common/rings';

import { getProvider } from 'utils/getProvider';
import { uploadJsonToIpfs } from 'apis/ipfs';
import config from 'config';
import getPubKeyFromSeed from 'utils/getPubKeyFromSeed';
import proposalData from 'utils/proposalData';
import extraData from 'utils/extraData';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Marriage } from 'constants/contracts/Marriage';
import { supabase } from 'util/supabase';

const defaultValues = {
  proposerName: '',
  spouseName: '',
  spouseWallet: '',
  message: '',
  // proposerRing: 0,
};

const validationSchema = Yup.object({
  proposerName: Yup.string().required(),
  spouseName: Yup.string().required(),
  spouseWallet: Yup.string().required(),
  message: Yup.string().required(),
  // proposerRing: Yup.number().required(),
}).required();

const SendNftRingFormWrapper = styled.div`
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

const SendNftRingForm = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [mid, setMid] = React.useState<any>();
  const { register, watch, handleSubmit, setValue, getValues } = useForm({
    defaultValues,
    // resolver: yupResolver(validationSchema),
  });
  const { address } = useAccount();
  const formValues = watch(['spouseName', 'message', 'spouseWallet']);
  const { config: marriageConfig } = usePrepareContractWrite({
    address: Marriage.contractAddress,
    abi: Marriage.abi,
    functionName: 'proposeMarriage',
    args: [formValues[2]],
    // to change estateId
    enabled: isSubmitting,
    onSuccess(data) {
      if (data) {
        setMid(Number(data?.result!));
        storeInDb(Number(data?.result!));
      }
    },
    onError(err) {
      console.log('on error proposal sent', err);
    },
  });
  const {
    data: sendProposalData,
    writeAsync: sendProposal,
    isSuccess: isSendProposalSuccess,
    isLoading: isSendProposalLoading,
  } = useContractWrite(marriageConfig);

  const navigate = useNavigate();

  const mintNft = async () => {
    console.log('mint nft');
    await sendProposal?.();
    // storeInDb();
  };

  const storeInDb = async (marId?: number) => {
    const { message, spouseName: spouse_name, spouseWallet: spouse_wallet, proposerName: your_name } = getValues();

    const { data, error } = await supabase
      .from('proposals')
      .insert([
        {
          your_name,
          spouse_name,
          spouse_wallet,
          your_wallet: address,
          status: 'proposed',
          message,
          marriageId: marId ?? mid,
        },
      ])
      .select();
    if (error) {
      console.log('store db error: ', error);
      return;
    }
    if (data) {
      console.log(data, 'store db data');
    }
  };
  const onSubmit = async (d: typeof defaultValues) => {
    setIsSubmitting(true);
    try {
      await mintNft();
    } catch (error: any) {
      console.warn(error);
      if (error?.code === 4001 && error?.message === 'User rejected the request.') {
        alert(error?.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (mid && isSendProposalSuccess) {
      navigate(`/proposal/${mid}/created`);
      toast.success('Copy this link and share it across your to-be partner! Go for the gold!');
    }
  }, [mid, isSendProposalSuccess]);

  return (
    <SendNftRingFormWrapper>
      <Container>
        <FlexRowWrapper>
          <FlexColumnWrapper className="col-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput placeholder="Your Name" {...register('proposerName')} />
              <FormInput placeholder="Your potential spouses name" {...register('spouseName')} />
              <FormInput placeholder="Your potential spouses wallet address" {...register('spouseWallet')} />
              <FormTextArea placeholder="Your Message" {...register('message')} />
              {/* <RingSelect label="Pick a ring" onChange={(value) => setValue('proposerRing', value)} /> */}
              <SolidButton type="submit" className="solid-button">
                {isSubmitting && <Spinner className="spinner" />}
                {isSubmitting ? 'Minting...' : 'MINT NFT'}
              </SolidButton>
            </form>
          </FlexColumnWrapper>
          <FlexColumnWrapper className="col-2">
            <h4>Preview</h4>
            <NftRingPreview
              spouseName={formValues[0]}
              message={formValues[1]}
              ring={previewRing}
              //ring={formValues[2]}
            />
          </FlexColumnWrapper>
        </FlexRowWrapper>
      </Container>
    </SendNftRingFormWrapper>
  );
};
export default SendNftRingForm;
