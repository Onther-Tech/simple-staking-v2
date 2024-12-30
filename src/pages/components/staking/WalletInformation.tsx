import { Container, Center, Box, Text, Heading, Button, Grid, Flex, useColorMode, useTheme } from '@chakra-ui/react';
import React, { FC, useState, useCallback } from 'react';
// import {LoadingComponent} from 'components/Loading';

import { useEffect } from 'react';
import useUserBalance from '@/hooks/useUserBalance';
import { useWeb3React } from '@web3-react/core';
import { usePendingUnstaked } from '@/hooks/staking/usePendingUnstaked';
import { ModalType } from '@/types/modal';
import { modalData, modalState } from '@/atom/global/modal';
import { useRecoilState } from 'recoil';
import { useWithdrawable } from '../../../hooks/staking/useWithdrawable';
import { convertNumber } from '@/components/number';
import { getOldLayerAddress } from '@/components/getOldLayerAddress';
import { StakeModalDataType } from "types"
import useModal from '@/hooks/useModal';
import { minimumAmountState } from '@/atom/staking/minimumAmount';

import Image from 'next/image';
import TON_LOGO from '@/assets/images/ton_symbol.svg'
import WTON_LOGO from '@/assets/images/wton_large.svg'
import BasicTooltip from '@/common/tooltip';
import { useCalculateAPR } from '@/hooks/staking/useCalculateAPR';
import { fromNow } from '@/components/getDate';

type WalletInformationProps = {
  // dispatch: AppDispatch;
  data: any;
  commitHistory: any;
};

export const WalletInformation: FC<WalletInformationProps> = ({
  data,
  // dispatch,
  commitHistory
}) => {
  const [loading, setLoading] = useState(false);
  const { account, library } = useWeb3React();
  
  const [candidateContracts, setCandidateContracts] = useState('');
  const [candidates, setCandidates] = useState('');
  const [stakeOfUser, setStakeOfUser] = useState('');
  const [expSeig, setExpSeig] = useState('');
  const [name, setName] = useState('');
  const [stakeCandidate, setStakeCandidate] = useState('');
  const [minimumAmount, setMinimumAmount] = useRecoilState(minimumAmountState)
  const [minimumAmountForButton, setMinimumAmountForButton] = useState<boolean>(false);
  const [isOperator, setIsOperator] = useState<boolean>(false);
  const [isL2, setIsL2] = useState<boolean>(false);

  const { userTonBalance, userWTonBalance } = useUserBalance(account);

  const compounds = useCalculateAPR(data)

  useEffect(() => {
    if (data) {
      setCandidateContracts(data.candidateContract);
      setCandidates(data.candidate);
      setStakeOfUser(data.stakeOf);
      setExpSeig(data.expectedSeig);
      setStakeCandidate(data.stakeOfCandidate);
      setIsL2(data.candidateAddOn !== null)
      setName(data.name)
    }
  }, [data]);

  useEffect(() => {
    if (account) {
      setIsOperator(candidates.toLowerCase() === account.toLowerCase())
    }
  }, [account, candidates])

  const { pendingUnstaked } = usePendingUnstaked(data?.candidateContract, account);
  const { withdrawable, withdrawableLength, old_withdrawable, old_withdrawableLength, requests } = useWithdrawable(
    data?.candidateContract,
  );

  const [selectedModal, setSelectedModal] = useRecoilState(modalState);
  const [, setSelectedModalData] = useRecoilState(modalData);

  const yourStaked = stakeOfUser
    ? convertNumber({
        //@ts-ignore
        amount: stakeOfUser,
        type: 'ray',
        localeString: true,
      })
    : '-';

  const expectedSeigs = expSeig
    ? convertNumber({
        amount: expSeig,
        type: 'ray',
        localeString: true,
      })
    : '0.00';
  
  const candidateAmountForButton = stakeCandidate
  ? convertNumber({
      amount: stakeCandidate,
      type: 'ray',
    })
  : '0.00';

  const candidateAmount = stakeCandidate 
    ? convertNumber({
      amount: stakeCandidate,
      type: 'ray',
    })
  : '1000.1';


  useEffect(() => {
    // console.log(Number(candidateAmount), Number(candidateAmount) > 1000)
    setMinimumAmount(Number(candidateAmount) > 1000)
    setMinimumAmountForButton(Number(candidateAmountForButton) > 1000)

  }, [account, candidateAmount])
  
  const dataModal: StakeModalDataType = {
    tonBalance: userTonBalance ? userTonBalance : '0.00',
    wtonBalance: userWTonBalance ? userWTonBalance : '0.00',
    stakedAmount: yourStaked ? yourStaked : '0.00',
    layer2: candidateContracts,
    withdrawableLength: withdrawableLength,
    seig: expectedSeigs ? expectedSeigs : '0.00',
    candidate: candidates,
    minimumAmount: minimumAmount,
    pendingUnstaked: pendingUnstaked,
    withdrawable: withdrawable,
    // old_withdrawableLength: old_withdrawableLength,
    old_withdrawableLength: '1',
    old_withdrawable: old_withdrawable,
    old_layer2: getOldLayerAddress(candidateContracts) ? getOldLayerAddress(candidateContracts) : '',
    requests: requests,
    isL2: isL2,
    name: name
  };

  const modalButton = useCallback(async (modalType: ModalType, data: any) => {
    setSelectedModal(modalType);
    setSelectedModalData(data);
  }, [dataModal]);

  const theme = useTheme();
  const { btnStyle } = theme;

  return (
    <Container maxW={'330px'} shadow={'md'} borderRadius={'lg'} border={'solid 1px #f4f6f8'} h={'137px'}>
      <Box w={'100%'} p={0} textAlign={'center'} px={2}>
        <Flex flexDir={'row'} py={'15px'} alignItems={'center'} mt={'10px'}>
          <Flex flexDir={'column'} h={'76px'}>
            <Flex flexDir={'column'} >
              <Flex>
                <Flex
                  border={'1px solid #f4f6f8'}
                  w={'32px'} 
                  h={'32px'} 
                  justifyContent={'center'} 
                  alignItems={'center'} 
                  borderRadius={'100px'}
                  mr={'6px'}
                >
                  <Image src={TON_LOGO} alt={''} />
                </Flex>
                <Flex 
                  bgColor={'#007aff'} 
                  w={'32px'} 
                  h={'32px'} 
                  justifyContent={'center'} 
                  alignItems={'center'} 
                  borderRadius={'100px'}
                >
                  <Image src={WTON_LOGO} alt={''} />
                </Flex>
              </Flex>
              <Flex fontSize={'11px'} color={'#304156'} fontWeight={700} mt={'9px'}>
                <Flex>
                  TON
                </Flex>
                <Flex color={'#c7d1d8'} mx={'3px'}>
                  /   
                </Flex>
                <Flex>
                  WTON
                </Flex>
              </Flex>
            </Flex>
            <Flex
              mt={'9px'}
              fontSize={'11px'}
              color={'#2a72e5'}
              w={'100%'}
              justifyContent={'center'}
              cursor={'pointer'}
              h={'13px'}
              onClick={() => modalButton('calculator', dataModal)}
            >
              Simulator
            </Flex>
          </Flex>
          <Flex w={'1px'} h={'60px'} bgColor={'#f4f6f8'} mx={'15px'} />
          <Flex flexDir={'column'}>
            <Flex color={'#808992'} fontSize={'12px'} fontWeight={'normal'}>
              <Flex>
                Expected APY
              </Flex>
              <Flex mt={'3px'} ml={'3px'}>
                <BasicTooltip 
                  label={'360-day historical staking APY calculated from seigniorage update frequency, with a 10% commission fee to the DAO candidate'} 
                  width={'430px'}
                />
              </Flex>
            </Flex>
            <Flex flexDir={'row'} alignItems={'center'}>
              <Flex color={'#304156'} fontSize={'25px'} fontWeight={700} mr={'9px'}>
                {compounds} %
              </Flex>
              <Button
                {...(minimumAmountForButton || isOperator ? { ...btnStyle.btnAble() } : { ...btnStyle.btnDisable() })}
                isDisabled={minimumAmountForButton || isOperator ? false : true}
                fontSize={'14px'}
                w={'70px'}
                h={'29px'}
                opacity={loading === true ? 0.5 : 1}
                onClick={() => modalButton('staking', dataModal)}
              >
                Stake
              </Button>
            </Flex>
            <Flex color={'#808992'} fontSize={'11px'} fontWeight={400} flexDir={'column'}>
              <Flex>
                Seigniorage is updated
              </Flex>
              <Flex>
                {commitHistory ? fromNow(commitHistory[0].timestamp) : ''}.
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {/* <Heading
          color={'#2a72e5'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight={500}
          // fontSize={'42px'}
          h={'55px'}
        > */}
          {/* {
            // userTonBalance === undefined 
            // ? <LoadingDots /> 
            // : (
              <Flex flexDir={'row'} color={'#304156'} fontSize={'18px'} fontWeight={'bold'}>
                <Flex alignItems={'end'}>
                  {account ? userTonBalance : '-'}
                  <Text fontSize={'13px'} fontWeight={500} ml={'3px'}>
                    TON
                  </Text>
                </Flex>
                <Flex mx={'6px'} color={'#c7d1d8'} fontWeight={'normal'}>
                  /
                </Flex>
                <Flex alignItems={'end'}>
                  {account ? userWTonBalance : '-'}
                  <Text fontSize={'13px'} fontWeight={500} ml={'3px'}>
                    WTON
                  </Text>
                </Flex>
              </Flex>
            // )
            } */}
        {/* </Heading> */}

        {/* {
          account ?
          <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={4}>
            <Button
              {...(minimumAmountForButton || isOperator ? { ...btnStyle.btnAble() } : { ...btnStyle.btnDisable() })}
              isDisabled={minimumAmountForButton || isOperator ? false : true}
              fontSize={'14px'}
              w={'70px'}
              h={'29px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() => modalButton('staking', dataModal)}
            >
              Stake
            </Button>
            
            <Button
              {...(minimumAmountForButton || isOperator ? { ...btnStyle.btnAble() } : { ...btnStyle.btnDisable() })}
              isDisabled={minimumAmountForButton || isOperator ? false : true}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() => modalButton('withdraw', dataModal)}
            >
              Withdraw
            </Button>

          </Grid>
          :
          <Flex
            justifyContent={'center'}
            alignItems={'center'}
            mt={'20px'}
            
          >
            <Button
              {...btnStyle.btnAble()}
              isDisabled={false}
              onClick={openModal}
            >
              Connect wallet
            </Button>
          </Flex>
        } */}
      </Box>
    </Container>
  );
};

export default WalletInformation;
