import { 
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  useTheme,
  useCheckboxGroup,
  useCheckbox,
  useDisclosure, 
} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useState} from 'react';
import { StakeModalDataType } from '../../../types/index';
import WithdrawTable from "./WithdrawTable";
import { TokenSelector } from "@/common/menulist/TokenSelector";
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox";
import useCallContract from "@/hooks/useCallContract";
import { useWeb3React } from "@web3-react/core";
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";
import { getModeData, transactionModalOpenStatus, transactionModalStatus } from "@/atom/global/modal";
import { inputState } from "@/atom/global/input";
import { LoadingDots } from "@/common/Loader/LoadingDots";
import { BalanceTooltip } from "@/common/tooltip/BalanceTooltip";

type WithdrawToEthereumProps ={
  selectedModalData: StakeModalDataType
  requests: any
  closeThisModal: any
  type: string
}

export const WithdrawToEthereum = (args: WithdrawToEthereumProps) => {
  const {selectedModalData, requests, closeThisModal, type} = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const [toggle, setToggle] = useState('Withdraw')
  const [option, setOption] = useState('TON')

  const { 
    DepositManager_CONTRACT, 
  } = useCallContract();

  const { account } = useWeb3React();
  const [, setTxPending] = useRecoilState(txState);
  const [input, setInput] = useRecoilState(inputState);
  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
  const [, setIsOpen] = useRecoilState(transactionModalOpenStatus);
  const [selectedMode, setSelectedMode] = useRecoilState(getModeData);

  const [tx, setTx] = useState();

  const [menuState, setMenuState] = useState(false);
  useEffect(() => {
    setMenuState(false);
  }, [])

  const [isChecked, setIsChecked] = useState<boolean>(false);
  

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const options = ['TON', 'WTON']

  // const handleToggle = useCallback(() => {
  //   setIsChecked(false)
  //   setToggle('Restake')
  // },[]) 

  useEffect(() => {
    setToggle(type)
  }, [])

  
  const handleSetOption = useCallback((option: any) => {
    setOption(option)
    setMenuState(false)
  }, [])

  const columns = useMemo(
    () => [
      {
        accessor: 'amount',
        Header: () => {
          return (
            <Flex>
              Amount
            </Flex>
          )
        },
      },
      {
        accessor: 'status',
        Header: 'Status',
      },
    ],
    [],
  )

  useEffect(() => {
    async function waitReceipt() {
      if (tx && !tx['status']) {
        //@ts-ignore
        await tx.wait().then((receipt: any) => {
          if (receipt.status) {
            setModalOpen("confirmed")
            setTxPending(false);
            setTx(undefined);
          }
        });
      }
    }
    waitReceipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  console.log(selectedModalData)

  const reStaking = useCallback(async () => {
    try {
      if (DepositManager_CONTRACT && account && selectedModalData) {
        setSelectedMode('Restake');
        setIsOpen(true)
        setModalOpen("waiting")

        const numPendRequest = await DepositManager_CONTRACT.numPendingRequests(selectedModalData.layer2, account);
        const tx = await DepositManager_CONTRACT.redepositMulti(selectedModalData.layer2, numPendRequest);

        setTx(tx);
        setTxPending(true);
        
        setModalOpen("confirming")
        setInput('');
        setIsChecked(false)
        // return closeThisModal();
      }
    } catch (e) {
      console.log(e);
      setModalOpen("error")
    }
  }, [DepositManager_CONTRACT, account, selectedModalData, setTxPending, closeThisModal]);

  const withdraw = useCallback(async () => {
    try {
      setSelectedMode('Withdraw');
      setIsOpen(true)
      setModalOpen("waiting")

      if (selectedModalData && DepositManager_CONTRACT && selectedModalData) {
        const tx =
            selectedModalData.withdrawableLength === '0' 
            ? '' 
            : await DepositManager_CONTRACT.processRequests( 
              selectedModalData.layer2,
              selectedModalData.withdrawableLength,
              option === 'TON' ? true : false,
            );
        setTx(tx);
        setTxPending(true);
        
        setModalOpen("confirming")
        setInput('');
        setIsChecked(false)

        // return closeThisModal();
      }
    } catch (e) {
      console.log(e);
      setModalOpen("error")
    }
  }, [DepositManager_CONTRACT, closeThisModal, selectedModalData, setTxPending]);

  console.log(selectedModalData.pendingUnstaked)

  return (
    <Flex flexDir={'column'} w={'350px'} alignItems={'center'}>
      <Flex
       flexDir={'row'} 
       justifyContent={'center'}
       alignItems={'center'}
       w={'320px'}
       mb={'12px'}
       mt={'21px'}
      >
        <Flex
          fontSize={'14px'}
          fontWeight={500}
          color={'#3e495c'}
          // w={'110px'}
        >
          Pending Withdrawal
        </Flex>
      </Flex>
      <Flex>
        {
          requests ?
          <WithdrawTable 
            columns={columns}
            data={requests}
          /> : 
          <LoadingDots />
        }
      </Flex>
      <Flex my={'21px'} h={'75px'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
        <Flex
          fontSize={'12px'}
          fontWeight={500}
          color={'#808992'}
          mb={'5px'}
        >
          Total amount to {
            toggle === 'Withdraw' ?
            <Flex color={'#2a72e5'} mx={'3px'}>
              Withdraw
            </Flex> :
            <Flex color={'#36af47'} mx={'3px'}>
              Restake
            </Flex>
          } available
        </Flex>
        <Flex 
          fontSize={'18px'}
          fontWeight={500}
          color={'#3d495d'}
        >
          {/* 이쪽에 문제있음 */}
          <Flex mr={'9px'}>
            {
              toggle === 'Withdraw'
                ? selectedModalData.withdrawable
                : 
                <BalanceTooltip 
                  label={selectedModalData.pendingUnstaked.toString()}
                  types={'ray'}
                />
                
            }
          </Flex>
          {
            toggle === 'Restake' ?
            <Flex>
              TON
            </Flex> :
            <TokenSelector 
              option={option} 
              setOption={handleSetOption}
              menuState={menuState}
              setMenuState={setMenuState}
              options={options}
            />
          }
        </Flex>
      </Flex>
      <Flex w={'100%'} h={'1px'}  bgColor={'#f4f6f8'} mb={'15px'} />
      <Flex flexDir={'column'} alignItems={'center'} >
        {
          toggle === 'Restake' ?
          <StakingCheckbox 
            content={'Restaking unstaked TON earns you TON from staking. However, to withdraw, they need to be unstaked and wait for 93,046 blocks (~14 days).'}
            handleCheckboxChange={handleCheckboxChange}
            isChecked={isChecked}
          />
           : ''
        }
        <Button
          {...btnStyle.btnAble()}
          w={'130px'}
          h={'38px'}
          mt={'25px'}
          fontSize={'14px'}
          fontWeight={500}
          isDisabled={
            toggle === 'Withdraw'
            ? (selectedModalData.withdrawable === '0.00' ? true : false)
            : (!isChecked || selectedModalData.pendingUnstaked === '0.00') 
          }
          bgColor={toggle === 'Restake' ? '#36af47' : ''}
          _hover={
            toggle === 'Restake' ?
            { bgColor: '#36af47' } : 
            ''
          }
          onClick={() => toggle === 'Restake' ? reStaking() : withdraw()}
        >
          {toggle}
        </Button>
      </Flex>
    </Flex>
  )
}