
import { Button, Flex, Link } from "@chakra-ui/react"
import trimAddress from '../../../utils/trimAddress';
import NEWTAB from '@/assets/images/newtab-icon.png'
import Image from "next/image";
import { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { getContract } from "@/components/getContract";
import CandidateAddOn from 'services/abi/CandidateAddOn.json'
import { useRecoilState } from "recoil";
import { txState } from "@/atom/global/transaction";
import ETHERSCAN_LINK from '@/assets/images/etherscan_link_icon.png'
import { UrlInput } from "@/common/input/CustomInput";
import OperatorImage from "@/common/table/staking/Oval";


type L2ContentProps = {
  title: string;
  content: string ;
  type: string;
  contractAddress? : string;
  content2?: string | undefined;
  editStat?: boolean
}

export function L2InfoContent (args: L2ContentProps) {
  const {
    title,
    content,
    type,
    contractAddress,    
    editStat
  } = args


  const linkType = type === 'bridge' || type === 'explorer' ? true : false
  const stringType = type === 'string' || type === 'logo' ? true : false

  const convert = linkType ?
    trimAddress({
      address: content ? content : '',
      firstChar: 29,
      lastChar: 0,
      dots: content ? content.length > 28 ? '...' : '' : ''
    }) 
    : content
    
  return (
    <Flex
      flexDir={'column'}
      fontWeight={500}
      textAlign={'left'}
      w={'100%'}
      mr={'20px'}
      minW={stringType ? '100px' : '250px'}
    >
      <Flex
        fontSize={'13px'}
        color={'#808992'}
        mb={'8px'}
      >
        {title}
      </Flex>
      <Flex
        fontSize={'14px'}
        color={'#304156'}
      >
        {
          (linkType || stringType) && editStat ?
          <UrlInput
            w={'224px'}
            h={'32px'}
            index={type}
          /> :
          <Flex 
            fontWeight={500}
          >
            {convert}
          </Flex> 
        }
        {
          stringType && editStat ?
          <Flex ml={'12px'} mt={'-12px'}>
            <OperatorImage 
              width={'48px'}
              height={'48px'}
              placeholder={'48x48 px'}
            /> 

          </Flex>
          : ''
        }
        {
          linkType && !editStat && content && content.length > 0 ?
          <Link 
            w={'20px'} 
            height={'20px'} 
            justifyContent={'center'} 
            alignItems={'center'}
            ml={'6px'}
            href={content}
            isExternal
          >
            <Image src={ETHERSCAN_LINK} alt={'alt'} />
          </Link> : ''
        }
        
      </Flex>      
    </Flex>
  )
}

export default L2InfoContent
