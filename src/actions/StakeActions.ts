import { convertToRay, convertToWei, floatParser } from '@/utils/number';
import { txState } from '@/atom/global/transaction';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { padLeft } from 'web3-utils';
import CONTRACT_ADDRESS from '@/services/addresses/contract';
import { marshalString, unmarshalString } from '@/utils/marshalString';
import { inputBalanceState, inputState } from '@/atom/global/input';


const getData = (layer2: any) => {
    const {
        TON_ADDRESS,
        WTON_ADDRESS,
        DepositManager_ADDRESS,
    } = CONTRACT_ADDRESS;

    if (layer2) return marshalString(
        //@ts-ignore
        [DepositManager_ADDRESS, layer2]
            .map(unmarshalString)
            .map(str => padLeft(str, 64)).join('')
    )
}

export const staking = async (userTonBalance: any, TON_CONTRACT: any,
    WTON_CONTRACT: any, DepositManager_CONTRACT: any, amount: any, layer2: string, setTxPending: any, setTx: any) => {

    const {
        TON_ADDRESS,
        WTON_ADDRESS,
        DepositManager_ADDRESS,
    } = CONTRACT_ADDRESS;

    if (userTonBalance) {
        const tonBalance = floatParser(userTonBalance)
        if (tonBalance && amount > tonBalance) {
            return alert('Please check input amount.');

        }
        if (confirm('Current withdrawal delay is 2 weeks. Are you sure you want to delegate?')) {
            const data = getData(layer2)
            console.log(amount);
            if (TON_CONTRACT && amount) {

                try {
                    const tx = await TON_CONTRACT.approveAndCall(
                        WTON_ADDRESS,
                        convertToWei(amount.toString()),
                        data
                    )
                    setTxPending(true)
                    setTx(tx)

                    if (tx) {
                        await tx.wait().then((receipt: any) => {
                            if (receipt.status) {
                                setTxPending(false);
                                setTx(undefined);
                            }
                        })
                    }
                }
                catch (e) {
                    setTxPending(false);
                    setTx(undefined);
                }

            }
        }
    }


}
