import { convertNumber } from "@/components/number";
import { Box, chakra, Checkbox, Flex, Link, Text, useCheckbox } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { differenceInSeconds, format, fromUnixTime } from "date-fns";
import HELP from '@/assets/images/get-help_icon.svg'
import Image from "next/image";
import { ETHERSCAN_LINK, TITAN_EXPLORER_LINK } from "@/constants";

type WithdrawL2TableRowProps = {
  // key: number
  index: number
  cell: any
  tonPrice: number
}

export const WithdrawL2TableRow: FC<WithdrawL2TableRowProps> = ({
  // key,
  index,
  cell,
  tonPrice
}) => {
  const {
    _amount,
    l1timeStamp,
    l2txHash
  } = cell.row?.original;
  const [duration, setDuration] = useState("0");

  const values = _amount
  
  const type = cell.column.id;
  const usdValue =  ((tonPrice * +values) / Math.pow(10, 18)).toLocaleString(undefined, {maximumFractionDigits: 3})

  useEffect(() => {
    if (l2txHash) {
      setDuration('Withdrawn')
    } else if (l1timeStamp) {
      const getDuration = setInterval(() => {
        const startDate = new Date(Number(l1timeStamp) * 1000);
        const currentTime = new Date(Date.now());
        const elapsedTimeInSeconds = differenceInSeconds(
          currentTime,
          startDate
        );
        
        if (elapsedTimeInSeconds > 1000) {
          setDuration('Failed')
        } else {
          const formattedTime = format(
            new Date(elapsedTimeInSeconds * 1000),
            "mm:ss"
          );
          setDuration(formattedTime);
        }
      }, 1000);
      return () => clearInterval(getDuration);
    }
  }, []);

  // console.log(duration)
  
  return  (
    <chakra.td
      key={index}
      w={'160px'}
      {...cell.getCellProps()}
      fontSize={'12px'}
      justifyContent={'center'}
      alignItems={"center"}
      h={'30px'}
    >
      { type === 'amount' ? (
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Text textAlign={'center'} color={'#000000'} >
            {convertNumber({
              amount: values,
              type: 'wei',
              localeString: true,
            })} 
          </Text>
          <Text color={'#646d7c'} ml={'3px'}>
            {`($ ${usdValue})`}
          </Text>
        </Flex>
      ) : ('')}
      {type === 'status' ? (
        <Flex 
          color={
            duration === 'Withdrawn' ? 
            '#2a72e5' : 
            duration === 'Failed' ? 
            '#e23738' : 
            '#828d99'
          }
          justifyContent={'center'}
          alignItems={"center"}
        >
          {duration !== 'Withdrawn' ? duration : ''}
          {
            duration === 'Failed' ?
            (
              <Link
                href="https://docs.google.com/forms/d/16H_To1WJjIVvdS5h6Ng9rTi2EXZhwgz5Oz4IGOdfdwc/edit"
                isExternal
                cursor={'pointer'}
                flexDir={'row'}
              >
                <Image src={HELP} alt={''} />
              </Link>
            ) : 
            duration === 'Withdrawn' ?
            (
              <Link
                href={`${TITAN_EXPLORER_LINK}/tx/${l2txHash}`}
                isExternal
                cursor={'pointer'}
                _hover={{
                  textDecor:'underline'
                }}
                mr={'5px'}
              >
                {duration}
              </Link>
            ) : ''
          }
        </Flex>
      ) : ('')}
    </chakra.td>
  )
}

export default WithdrawL2TableRow