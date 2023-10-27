import { GET_CANDIDATE } from "@/graphql/getCandidates";
import { useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import useCallContract from "../useCallContract";
import { getOldLayerAddress } from '../../utils/getOldLayerAddress';

export function useCandidateList () {
  const [candidateList, setCandidateList] = useState<any[]>([]);
  const { data } = useQuery(GET_CANDIDATE, {
    pollInterval: 10000
  });
  const { account } = useWeb3React();
  const { SeigManager_CONTRACT, DepositManager_CONTRACT, Old_DepositManager_CONTRACT } = useCallContract();

  useEffect(() => {
    
    async function fetch () {
      if (data) {
        console.log('data',data)
        const candidates = await Promise.all(data.candidates.map(async (obj: any) => {
          let tempObj = obj
          if (
            account && 
            SeigManager_CONTRACT && 
            DepositManager_CONTRACT && 
            Old_DepositManager_CONTRACT && 
            obj
          ) {
            try{
              
              const stakeOf = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, account)
              console.log('stakeOf', stakeOf)
              const stakeOfCandidate = await SeigManager_CONTRACT.stakeOf(obj.candidateContract, obj.candidate)
              console.log('stakeOfCandidate', stakeOfCandidate)
              const pending = await DepositManager_CONTRACT.pendingUnstakedLayer2(obj.candidateContract)
              console.log('pending', pending)
              const old_pending = await Old_DepositManager_CONTRACT.pendingUnstakedLayer2(getOldLayerAddress(obj.candidateContract))
              console.log('old_pending', old_pending)
              const sumPending = pending.add(old_pending)
  
              tempObj = {
                ...obj,
                stakeOf: stakeOf.toString(),
                pending: sumPending.toString(),
                stakeOfCandidate: stakeOfCandidate.toString()
              }
              console.log('tempObj', tempObj)
            } catch (e) {
              console.log(e)
            }
          }
          return tempObj
        }))
        console.log('candidateList',candidateList)
        setCandidateList(candidates)
      }
    }
    fetch()
  }, [data, account])

  return { candidateList }
}