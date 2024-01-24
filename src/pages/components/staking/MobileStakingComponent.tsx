import {
  Button,
  Flex,
  Text,
  useTheme,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import useUserBalance from "@/hooks/useUserBalance";
import { useWeb3React } from "@web3-react/core";
import OperatorImage from "@/common/table/staking/Oval";
import select1_arrow_inactive from "assets/images/select1_arrow_inactive.png";
import icon_close from "assets/images/icon_close.png";
import { useState } from "react";
import OperatorSelect from "./OperatorSelect";
import MobileCustomInput from "@/common/input/MobileCustomInput";
import { staking } from "@/actions/StakeActions";
import useCallContract from "@/hooks/useCallContract";
import { useRecoilState, useRecoilValue } from "recoil";
import { txState } from "@/atom/global/transaction";
import { convertNumber, floatParser } from "@/components/number";
import { MobileInfo } from "./MobileInfo";
import { useWithdrawable } from "@/hooks/staking/useWithdrawable";
import { usePendingUnstaked } from "@/hooks/staking/usePendingUnstaked";

function MobileStakingComponent(props: { 
  operatorList: any 
  title: string
}) {
  const { account } = useWeb3React();
  const { 
    operatorList, 
    title
  } = props;
  const { userTonBalance } = useUserBalance(account);
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOp, setSelectedOp] = useState<any>(operatorList?.[0]);
  const [amount, setAmount] = useState(0);
  const [txPending, setTxPending] = useRecoilState(txState);
  const [tx, setTx] = useState();
  const { withdrawable, withdrawableLength } = useWithdrawable(selectedOp?.candidateContract)
  const { pendingUnstaked } = usePendingUnstaked(selectedOp?.candidateContract, account);

  const { TON_CONTRACT, WTON_CONTRACT, DepositManager_CONTRACT } = useCallContract();

  const tonB = userTonBalance? floatParser(userTonBalance): 0
  const staked = selectedOp ?
    convertNumber({
      amount: selectedOp.stakeOf,
      type: 'ray',
      localeString: true
    }) : '0.00'

  return (
    <Flex w="100%" px="20px" flexDir={'column'}>
      <Flex
        w="100%"
        h="205px"
        border={"1px solid #e7ebf2"}
        borderRadius="10px"
        pt="10px"
        pb="15px"
        px="20px"
        flexDir={"column"}
      >
        <Flex alignItems={"center"} h="35px">
          <Text color="gray.300" fontSize={"12px"} mr={'5px'}>
            {title === 'Withdraw' ? 'Withdrawable Amount:' : 'Balance:'}
          </Text>
          {
            title === 'Withdraw' ? '' :
              <Text fontSize={"13px"} color="gray.700">
                {userTonBalance} TON
              </Text>
          }
        </Flex>
        <MobileCustomInput
          w={"147px"}
          placeHolder={"0.00"}
          type={"staking"}
          maxValue={userTonBalance}
          setAmount={setAmount}
          maxButton={true}
        />

        <Flex
          mt="10px"
          h="40px"
          borderRadius={"4px"}
          border="solid 1px #dfe4ee"
          justifyContent={"space-between"}
          alignItems="center"
          px="10px"
        >
          <Text fontSize={"12px"}>Select an operator</Text>
          <Flex alignItems={"center"}>
            <OperatorImage height="20px" width="20px" />
            <Text ml="7px" fontSize={"13px"} fontWeight="bold">
              {selectedOp?.name}
            </Text>
            <Flex height={"9px"} width={"8px"} ml="10px" onClick={onOpen}>
              <Image
                src={select1_arrow_inactive}
                alt={"select1_arrow_inactive"}
              />
            </Flex>
          </Flex>
        </Flex>
        <Button
          mt="15px"
          bg="blue.200"
          color={"white.100"}
          _focus={{
            bg: "blue.200",
          }}
          _active={{
            bg: "blue.200",
          }}
          _hover={{
            bg: "blue.200",
          }}
          isDisabled={
            userTonBalance === "0.00" ||
            amount === 0 ||
            Number.isNaN(amount) ||
            amount === undefined  || (tonB?  amount > tonB: false)
          }
          _disabled={{ bg: "#86929d", color: "#e9edf1" }}
          onClick={() =>
            staking(
              userTonBalance,
              TON_CONTRACT,
              amount,
              selectedOp.candidateContract,
              setTxPending,
              setTx
            )
          }
        >
          {title}
        </Button>
      </Flex>
      {
        account ?
        <Flex flexDir={'column'}>
          <MobileInfo 
            title={'Your Staked'}
            value={'-'}
          /> 
          <MobileInfo 
            title={'Unclaimed Staking Reward'}
            value={'-'}
          />
        </Flex>
          : '' 
      }
      <OperatorSelect
        operatorList={operatorList}
        onClose={onClose}
        isOpen={isOpen}
        setSelectedOp={setSelectedOp}
      />
    </Flex>
  );
}

export default MobileStakingComponent;
