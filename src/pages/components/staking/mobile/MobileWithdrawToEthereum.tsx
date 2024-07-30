import { 
  Text,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  Switch,
  useTheme,
  MenuList,
  useCheckboxGroup, 
  MenuItem
} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useState} from 'react';
// import { StakeModalDataType } from '../../../../../types/index';
// import WithdrawTable from "./WithdrawTable";
import { TokenSelector } from "@/common/menulist/TokenSelector";
import { StakingCheckbox } from "@/common/checkbox/StakingCheckbox";
import WithdrawTable from "../modal/withdraw/WithdrawTable";
import { convertNumber } from "@/components/number";

type MobileWithdrawToEthereumProps ={
  selectedOp: any 
  requests: any
  onClose: any
}

export const MobileWithdrawToEthereum = (args: MobileWithdrawToEthereumProps) => {
  const {selectedOp, requests, onClose} = args
  const theme = useTheme();
  const { btnStyle } = theme;
  const [toggle, setToggle] = useState('Withdraw')
  const [option, setOption] = useState('WTON')
  const [menuState, setMenuState] = useState(false);
  useEffect(() => {
    setMenuState(false);
  }, [])

  const { value, setValue, getCheckboxProps, isDisabled } = useCheckboxGroup()
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const staked = selectedOp ?
    convertNumber({
      amount: selectedOp.stakeOf,
      type: 'ray',
      localeString: true
    }) : '0.00'

  const options = ['WTON', 'TON']
  const handleSetOption = useCallback((option: any) => {
    setOption(option)
    setMenuState(false)
  }, [])

  const columns = useMemo(
    () => [
      {
        accessor: 'checkbox',
        Header: (props: any) => {
          return (
            <Flex>
              <Checkbox {...props()} />
            </Flex>
          )
        },
      },
      {
        accessor: 'amount',
        Header: () => {
          return (
            <Flex>
              Amount
              <Flex color={'#2a72e5'}>
                TON
              </Flex>
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

  return (
    <Flex flexDir={'column'} w={'100%'} alignItems={'center'} h={'100%'}>
      <Flex flexDir={'column'} justifyContent={'space-between'} h={'100%'} w={'100%'}>
        <Flex
          flexDir={'row'} 
          justifyContent={'space-between'}
          alignItems={'center'}
          w={'100%'}
          mb={'12px'}
        >
          <Flex
            fontSize={'14px'}
            fontWeight={500}
            color={'#3e495c'}
            // w={'110px'}
          >
            Withdraw history
          </Flex>
          <FormControl
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'100px'}
          >
            <FormLabel
              fontSize={'11px'}
              fontWeight={'normal'}
              color={'#828d99'}
              mt={'5px'}
            >
              Restake
            </FormLabel>
            <Switch 
              bgColor={'#e7ebf2'}
              borderRadius={'100px'}
              p={'1px'}
              colorScheme='green' 
              onChange={() =>
                toggle === 'Withdraw'
                  ? setToggle('Restake')
                  : setToggle('Withdraw')
              }
            />
          </FormControl>
        </Flex>
        {
          requests ?
          <Flex>
            <WithdrawTable 
              columns={columns}
              data={requests}
              getCheckboxProps={getCheckboxProps}
            />
          </Flex> : ''
        }
        <Flex my={'21px'} h={'75px'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
          <Flex
            fontSize={'12px'}
            fontWeight={500}
            color={'#808992'}
            mb={'5px'}
          >
            Total amount of {
              toggle === 'Withdraw' ?
              <Flex color={'#2a72e5'} mx={'3px'}>
                Withdaw
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
            <Flex mr={'9px'}>
              {staked}
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
      </Flex>
      <Flex w={'100%'} flexDir={'column'} alignItems={'center'}>
        {
          toggle === 'Restake' ?
          <StakingCheckbox 
            content={'Restaking unstaked TON earns you TON from staking. However, to withdraw, they need to be unstaked and wait for 93,046 blocks (~14 days).'}
            handleCheckboxChange={handleCheckboxChange}
          />
           : ''
        }
        <Button
          {...btnStyle.btnAble()}
          w={'100%'}
          h={'40px'}
          mt={'25px'}
          mb={'15px'}
          fontSize={'14px'}
          fontWeight={500}
          isDisabled={!isChecked && toggle === 'Restake'}
          bgColor={toggle === 'Restake' ? '#36af47' : ''}
        >
          {toggle}
        </Button>
      </Flex>
    </Flex>
  )
}