//Phase1 contract datas
//https://www.notion.so/onther/Phase1-deploy-contract-interface-b48f4c779c7043df971ddc3dac783ec8

import { REACT_APP_MODE } from '../../constants';

type CONTRACT_ADDRESSES_TYPE = {
  TON_ADDRESS:
    | '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5'
    | '0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00';
  WTON_ADDRESS:
    | '0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2'
    | '0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6';
  Layer2Registry_ADDRESS :'0x7846c2248a7b4de77e9c2bae7fbb93bfc286837b' | '0xFF2258eAa1c82d09a9ed0198116d9557c34104Fa',
  DepositManager_ADDRESS: '0x0b58ca72b12f01fc05f8f252e226f3e2089bd00e' | '0x0e1EF78939F9d3340e63A7a1077d50999CC6B64f',
  SeigManager_ADDRESS: '0x0b55a0f463b6defb81c6063973763951712d0e5f' | '0x50255c955d0F760C8512ff556453AEe6502ef47f',
  Old_DepositManager_ADDRESS: '0x56E465f654393fa48f007Ed7346105c7195CEe43' | "0x0ad659558851f6ba8a8094614303F56d42f8f39A",
  Old_SeigManager_ADDRESS: '0x710936500aC59e8551331871Cbad3D33d5e0D909' | '0x446ece59ef429B774Ff116432bbB123f1915D9E3'
};

const MAINNET: CONTRACT_ADDRESSES_TYPE = {
  TON_ADDRESS: '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
  WTON_ADDRESS :'0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2',
  Layer2Registry_ADDRESS :'0x7846c2248a7b4de77e9c2bae7fbb93bfc286837b',
  DepositManager_ADDRESS: '0x0b58ca72b12f01fc05f8f252e226f3e2089bd00e',
  SeigManager_ADDRESS: '0x0b55a0f463b6defb81c6063973763951712d0e5f',
  Old_DepositManager_ADDRESS: '0x56E465f654393fa48f007Ed7346105c7195CEe43',
  Old_SeigManager_ADDRESS: '0x710936500aC59e8551331871Cbad3D33d5e0D909'
}

const GOERLI: CONTRACT_ADDRESSES_TYPE = {
  TON_ADDRESS: '0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00',
  WTON_ADDRESS: '0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6',
  Layer2Registry_ADDRESS :'0xFF2258eAa1c82d09a9ed0198116d9557c34104Fa',
  DepositManager_ADDRESS: '0x0e1EF78939F9d3340e63A7a1077d50999CC6B64f',
  SeigManager_ADDRESS: '0x50255c955d0F760C8512ff556453AEe6502ef47f',
  Old_DepositManager_ADDRESS: '0x0ad659558851f6ba8a8094614303F56d42f8f39A',
  Old_SeigManager_ADDRESS: '0x446ece59ef429B774Ff116432bbB123f1915D9E3'
};

const CONTRACT_ADDRESS: CONTRACT_ADDRESSES_TYPE = 
  // MAINNET
  REACT_APP_MODE === 'PRODUCTION' ? MAINNET : GOERLI;

const info = [
  {
    oldLayer: "0x39a13a796a3cd9f480c28259230d2ef0a7026033",
    newLayer: "0xf3B17FDB808c7d0Df9ACd24dA34700ce069007DF",
    operator:"0xea8e2ec08dcf4971bdcdfffe21439995378b44f3",
    name: "tokamak1"
  },
  {
    oldLayer: "0x41fb4bad6fba9e9b6e45f3f96ba3ad7ec2ff5b3c",
    newLayer: "0x44e3605d0ed58FD125E9C47D1bf25a4406c13b57",
    operator: "0x566b98a715ef8f60a93a208717d9182310ac3867",
    name: "DXM Corp"
  },
  {
    oldLayer: "0xbc8896ebb2e3939b1849298ef8da59e09946cf66",
    newLayer: "0x2B67D8D4E61b68744885E243EfAF988f1Fc66E2D",
    operator: "0x8dfcbc1df9933c8725618015d10b7b6de2d2c6f8",
    name: "DSRV"
  },
  {
    oldLayer: "0xb9d336596ea2662488641c4ac87960bfdcb94c6e",
    newLayer: "0x36101b31e74c5E8f9a9cec378407Bbb776287761",
    operator: "0xcc2f386adca481a00d614d5aa77a30984f264a07",
    name: "Talken"
  },
  {
    oldLayer: "0xcc38c7aaf2507da52a875e93f57451e58e8c6372",
    newLayer: "0x2c25A6be0e6f9017b5bf77879c487eed466F2194",
    operator: "0x247a0829c63c5b40dc6b21cf412f80227dc7fb76",
    name: "staked"
  },
  {
    oldLayer: "0x42ccf0769e87cb2952634f607df1c7d62e0bbc52",
    newLayer: "0x0F42D1C40b95DF7A1478639918fc358B4aF5298D",
    operator: "0xd1820b18be7f6429f1f44104e4e15d16fb199a43",
    name: "level"
  },
  {
    oldLayer: "0x17602823b5fe43a65ad7122946a73b019e77fd33",
    newLayer: "0xbc602C1D9f3aE99dB4e9fD3662CE3D02e593ec5d",
    operator: "0xba33eddfd3e4e155a6da10281d9069bf44743228",
    name: "decipher"
  },
  {
    oldLayer: "0x2000fc16911fc044130c29c1aa49d3e0b101716a",
    newLayer: "0xC42cCb12515b52B59c02eEc303c887C8658f5854",
    operator: "0xfc9c403993bea576c28ac901bd62640bff8b057a",
    name: "DeSpread"
  },
  {
    oldLayer: "0x97d0a5880542ab0e699c67e7f4ff61f2e5200484",
    newLayer: "0xf3CF23D896Ba09d8EcdcD4655d918f71925E3FE5",
    operator: "0x887af02970781a088962dbaa299a1eba8d573321",
    name: "Danal Fintech"
  },
  {
    oldLayer: "0x5d9a0646c46245a8a3b4775afb3c54d07bcb1764",
    newLayer: "0x06D34f65869Ec94B3BA8c0E08BCEb532f65005E2",
    operator: "0x42adfaae7db56b294225ddcfebef48b337b34b23",
    name: "Hammer DAO"
  },
]

const info_goerli = [
  {
    oldLayer: "0xaeb5675424c4bd3074ba363bfffdb0e2c0a1011b",
    newLayer: "0xCFd49c06eF6057932a900bd6cF0B995214821398",
    operator: "0x43700f09B582eE2BFcCe4b5Db40ee41B4649D977",
    name: "TokamakOperator_v2"
  }, 
  {
    oldLayer: "0xc1eba383D94c6021160042491A5dfaF1d82694E6",
    newLayer: "0x2e8400Ec60349A18DD84De0566881379056a3085",
    operator: "0xc1eba383D94c6021160042491A5dfaF1d82694E6",
    name: "ContractTeam_DAO_v2"
  }, 
  {
    oldLayer: "0xa6ccdb6b2384bbf35cfb190ce41667a1f0dbdc53",
    newLayer: "0x1f4aEf3A04372cF9D738d5459F31950A53969cA3",
    operator: "0xf3D37602D501DC27e1bDbc841f174aDf337909D2",
    name: "ContractTeam_DAO2_v2"
  }
]

export const OLD_CONTRACT = REACT_APP_MODE === 'PRODUCTION' ? info : info_goerli;
export default CONTRACT_ADDRESS;
