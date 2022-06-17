import React, { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Tab, Tabs } from 'react-bootstrap'
import StatBar from './StatBar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Spinner } from './components/Spinner'

// Library to work with Ethereum like blockchain
import { injected } from './wallet/connectors'
import { useEagerConnect, useInactiveListener } from './wallet/hooks'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits, parseEther, formatEther } from '@ethersproject/units'

// abis
import contrInterface from './interface.json' // Load contract json file
import erc20Interface from './erc20Interface.json' // Load erc20 contract json file
import nftInterface from './project.nft.abi.json'

// Load all the background images for the 10 different Cryptomon types
import bg0 from './sprites-copy/background/0.png'
import bg1 from './sprites-copy/background/1.png'
import bg2 from './sprites-copy/background/2.png'
import bg3 from './sprites-copy/background/3.png'
import bg4 from './sprites-copy/background/4.png'
import bg5 from './sprites-copy/background/5.png'
import bg6 from './sprites-copy/background/6.png'
import bg7 from './sprites-copy/background/7.png'
import bg8 from './sprites-copy/background/8.png'
import bg9 from './sprites-copy/background/9.png'
import bg10 from './sprites-copy/background/10.png'

import MonImages from './sprites'

// util
import { showThrottleMessage, Web3Provider } from '@ethersproject/providers'
import txSuccess from './utils/txSuccess'
import txFail from './utils/txFail'
import { MaxUint256 } from '@ethersproject/constants'
import { receiveMessageOnPort } from 'worker_threads'
import { monitorEventLoopDelay } from 'perf_hooks'
import { read } from 'fs'
import { userInfo } from 'os'


enum ConnectorNames {
  Injected = 'Injected',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
}
//bsc cryptomon 0x7bBa695f46feD048ea89CD7FfB4A8eC592b77724
//bsc token 0xCAE3fEAD6134d1F09dcf2688F8Cbc9dA88912f57
const CONTRACT_ADDRESS = '0x7bBa695f46feD048ea89CD7FfB4A8eC592b77724' //CRYPTOMON
const ERC20_CONTRACT_ADDRESS2 = '0x55d398326f99059fF775485246999027B3197955' //usdt
const ERC20_CONTRACT_ADDRESS = '0xCAE3fEAD6134d1F09dcf2688F8Cbc9dA88912f57' //token
const ERC1155_CONTRACT_ADDRESS = '0xf4C7A8BE34525B0BeCf41F0e308170CaE93cfa01' //ITEM
const deadaddress = '0x000000000000000000000000000000000000dEaD'


// Add background images in an array for easy access
const bg = [bg0, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10]

// Add all 151 Cryptomon names in an array
const names = [
  'Dryad',
  'Hamadryad',
  'Leshy',
  'Santelmo',
  'Cerberus',
  'Efreet',
  'Fastitocalon',
  'Aspidochelone',
  'Zaratan',
  'Arachne',
  'Jorogumo',
  'Tsuchigumo',
  'Pabilsag',
  'Girtablilu',
  'Selket',
  'Tsikavats',
  'Munnin',
  'Huginn',
  'Azeban',
  'Ratatoskr',
  'Stratim',
  'Navka',
  'Apep',
  'Nidhoggr',
  'Raiju',
  'Raijin',
  'Amphivena',
  'Basilisk',
  'Wolpertinger',
  'Ramidreju',
  'Echinemon',
  'Mujina',
  'Kamaitachi',
  'Lavellan',
  'Vila',
  'Huldra',
  'Chimera',
  'Kyuubi',
  'Nixie',
  'Tuathan',
  'Minyades',
  'Camazotz',
  'Curupira',
  'Penghou',
  'Ghillie_Dhu',
  'Myrmecoleon',
  'Myrmidon',
  'Mothman',
  'Moth_King',
  'Grootslang',
  'Yaoguai',
  'Cait_Sidhe',
  'Cath_Balug',
  'Nakki',
  'Kappa',
  'Satori',
  'Shojo',
  'Skohl',
  'Haet',
  'Vodyanoy',
  'Undine',
  'Melusine',
  'Vukodlak',
  'Chernobog',
  'Djinn',
  'Bauk',
  'Troll',
  'Jotun',
  'Spriggan',
  'Jubokko',
  'Kodama',
  'Bukavak',
  'Kraken',
  'Clayboy',
  'Met',
  'Emet',
  'Sleipnir',
  'Todorats',
  'Scylla',
  'Charybdis',
  'Brontes',
  'Arges',
  'Hraesvelgr',
  'Berunda',
  'Cockatrice',
  'Selkie',
  'Rusalka',
  'Tarasque',
  'Meretseger',
  'Carbuncle',
  'Shen',
  'Boogeyman',
  'Banshee',
  'Mare',
  'Dilong',
  'Incubus',
  'Succubus',
  'Cancer',
  'Karkinos',
  'Druk',
  'Shenlong',
  'Gan_Ceann',
  'Oni',
  'Tairanohone',
  'Gashadokuro',
  'Yeren',
  'Yeti',
  'Yowie',
  'Nezhit',
  'Chuma',
  'Sigbin',
  'Gargoyle',
  'Caladrius',
  'Umibozu',
  'Callisto',
  'Kelpie',
  'Makara',
  'Morgen',
  'Merrow',
  'Naiad',
  'Nereid',
  'Pixiu',
  'Khepri',
  'Likho',
  'kitsune',
  'Caorthannach',
  'Kaggen',
  'Audumbla',
  'Lochness',
  'Jormungandr',
  'Leviathan',
  'Doppelganger',
  'Skvader',
  'Fossegrim',
  'Valkyrie',
  'Basan',
  'Tsukumogami',
  'Luska',
  'Hydra',
  'Afanc',
  'Cetus',
  'Vedfolnir',
  'Baku',
  'Alkonost',
  'Quetzalcoatl',
  'Anzu',
  'Zmey',
  'Azhdaya',
  'Fafnir',
  'Baba_Yaga',
  'Baba_Roga',
]

async function getMons(_library, _account) {
  const contr = new Contract(CONTRACT_ADDRESS, contrInterface, _library.getSigner(_account))
  const totalMons = parseInt(await contr.totalMons())
  return Promise.all([...Array(totalMons).keys()].map((id) => contr.mons(id)))
}

async function approve(_library, _account, _amount) {
  const erc20Contr = new Contract(ERC20_CONTRACT_ADDRESS, erc20Interface, _library.getSigner(_account))
  const newAmount = `${parseEther(_amount)}`
  return await erc20Contr.approve(CONTRACT_ADDRESS, newAmount)
}

async function approve2(_library, _account, _amount) {
  const erc20Contr = new Contract(ERC20_CONTRACT_ADDRESS2, erc20Interface, _library.getSigner(_account))
  const newAmount = `${parseEther(_amount)}`
  return await erc20Contr.approve(CONTRACT_ADDRESS, newAmount)
}



async function setApprovalForAll(_library, _account, _amount) {
  const nftContr = new Contract(ERC1155_CONTRACT_ADDRESS, nftInterface, _library.getSigner(_account))
  const newAmount = `${parseEther(_amount)}`
  return await nftContr.setApprovalForAll(CONTRACT_ADDRESS, newAmount)
}

function Account() {
  const { account } = useWeb3React()
  return (
    <span>
      {account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
    </span>
  )
}

async function getTokenBalance(_library, _account) {
  if (!_library || !_account) {
    return
  }
  const erc20Contr = new Contract(ERC20_CONTRACT_ADDRESS, erc20Interface, _library.getSigner(_account))
  const bal = await erc20Contr.balanceOf(_account)
  return formatEther(BigNumber.from(bal?._hex).toBigInt())
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

function App() {
  const [cryptomons, setCryptomons] = useState([])
  const [myCryptomons, setMyCryptomons] = useState([])
  const [otherCryptomons, setOtherCryptomons] = useState([])
  const [value, setValue] = useState(0) // Used in My Cryptomons tab for input in price text
  // Used in breeding tab
  const [breedChoice1, setBreedChoice1] = useState(null)
  const [breedChoice2, setBreedChoice2] = useState(null)
  // Used in fighting tab
  const [fightChoice1, setFightChoice1] = useState(null)
  const [fightChoice2, setFightChoice2] = useState(null)
  const [winner, setWinner] = useState(null) // Used to display winner of the last fight
  const [rounds, setRounds] = useState(null) // Used to display number of rounds the fight lasted
  const [shareId, setShareId] = useState('') // Used in shareId form input field
  const [shareAddress, setShareAddress] = useState('') // Used in shareAddress form input field
  const [renameId, setRenameId] = useState('') // Used in shareId form input field
  const [yourName, setYourName] = useState('') // used for name input
  const [tokenBalance, setTokenBalance] = useState('0')
  const [fightTxDone, setFightTxDone] = useState(false)
  const [rewards, setRewards] = useState(0)
  const [healingPotions, setHealingPotions] = useState(null)
  const [manaPotions, setManaPotions] = useState(null)
  const [magicPotions, setMagicPotions] = useState(null)
  const [swords, setSwords] = useState(null)
  const [shields, setShields] = useState(null)
  const [disableFightBtn, setDisableFightBtn] = useState(false)
  const [buyItemAmount, setBuyItemAmount] = useState('')
  const [buysingleAmount, setBuySingleAmount] = useState('')
  const [buydoubleAmount, setBuyDoubleAmount] = useState('')

  const [InvitationCode, setInvitationCode] = useState('')

  const [buyZhuangAmount, setBuyZhuangAmount] = useState('')
  const [buyXiangAmount, setBuyXiangAmount] = useState('')
  const [buyHeAmount, setBuyHeAmount] = useState('')

  const [buyBigAmount, setBuybigAmount] = useState('')
  const [buySmallAmount, setBuySmallAmount] = useState('')

  const [CashOuteAmount, setCashOutAmount] = useState('')
  const [luckyamount, setLuckyAmount] = useState('')
  const [burnAmount, setBurnAmount] = useState('0')
  const [disableBuyItemBtn, setDisableBuyItem] = useState(false)
  const [isShareLoading, setIsShareLoading] = useState(false)
  const [isBreedMonLoading, setIsBreedMonLoading] = useState(false)
  const [isBuyMonLoading, setIsBuyMonLoading] = useState(false)
  const [isAddForSaleLoading, setIsAddForSaleLoading] = useState(false)
  const [isRemoveFromSaleLoading, setIsRemoveFromSaleLoading] = useState(false)
  const context = useWeb3React<Web3Provider>()
  const { connector, account, library, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }

    refreshMons()
  }, [activatingConnector, connector])

  // Get token balance of user
  useEffect(() => {
    let mounted = true

    getTokenBalance(library, account).then((res) => {
      if (mounted) {
        setTokenBalance(res)
        refreshMons()
      }
    })

    return () => {
      mounted = false
    }
  }, [account, library, disableBuyItemBtn, disableFightBtn])

  // Get contract events
  useEffect(() => {
    if (!library || !account) {
      return
    }

    let mounted = true

    ;(async function fightResults() {
      const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))

      contr.on('FightResults', (_winnerId, _round) => {
        if (mounted) {
          const winId = BigNumber.from(_winnerId._hex).toNumber()
          const round = BigNumber.from(_round._hex).toNumber()
          setWinner(winId)
          setRounds(round)
          refreshMons()
          setDisableFightBtn(false)
        }
      })

      contr.on('Rewards', (_winnerId, _rewards) => {
        if (mounted) {
          const rewards = BigNumber.from(_rewards._hex).toNumber()
          setRewards(rewards)
          refreshMons()
          setDisableFightBtn(false)
        }
      })

    })()

    return () => {
      const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
      contr.off('FightResults', (_winnerId, _round) => {
        setDisableFightBtn(false)
      })
      contr.off('Rewards', (_winnerId, _round) => {
        setDisableFightBtn(false)
      })

      mounted = false
    }
  }, [account, library, fightTxDone])

  // Get items from nft contract
  useEffect(() => {
    if (!library || !account) {
      return
    }

    let mounted = true

    ;(async function () {
      if (mounted) {
        const nftContr = new Contract(ERC1155_CONTRACT_ADDRESS, nftInterface, library.getSigner(account))
        const healpot = await nftContr.balanceOf(account, 0)
        const manapot = await nftContr.balanceOf(account, 1)
        const magicpot = await nftContr.balanceOf(account, 2)
        const _swords = await nftContr.balanceOf(account, 3)
        const _shields = await nftContr.balanceOf(account, 4)

        setHealingPotions(BigNumber.from(healpot._hex).toBigInt())
        setManaPotions(BigNumber.from(manapot._hex).toBigInt())
        setMagicPotions(BigNumber.from(magicpot._hex).toBigInt())
        setSwords(BigNumber.from(_swords._hex).toBigInt())
        setShields(BigNumber.from(_shields._hex).toBigInt())
      }
    })()

    return () => {
      mounted = false
    }
  }, [library, account, disableBuyItemBtn])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector )

  // Change the list of created Crypromons saved in the state so UI refreshes after this call
  async function refreshMons() {
    if (!library || !account) return
    await getMons(library, account)
      .then((_mons) => {
        // map result
        const monsMap = _mons.map((mon) => ({
          atk: mon.atk,
          def: mon.def,
          evolve: mon.evolve,
          forSale: mon.forSale,
          hp: mon.hp,
          id: BigNumber.from(mon.id._hex).toNumber(),
          monType: mon.monType,
          owner: mon.owner,
          price: BigNumber.from(mon.price._hex).toBigInt(),
          // sharedTo: mon.sharedTo,
          species: mon.species,
          Name: mon.Name,
          lv: BigNumber.from(mon.lv._hex).toNumber(),
          rewardpool: mon.rewardpool,
          mp: mon.atk + mon.hp + mon.def,
        }))
        setCryptomons(monsMap)
        setMyCryptomons(monsMap.filter((mon) => mon.owner === account))
        setOtherCryptomons(monsMap.filter((mon) => mon.owner !== account))
      })
      .catch((err) => toast.error(err))
  }

  async function getUsers(_library, _account) {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, _library.getSigner(_account))
    const totalMons = parseInt(await contr.totalMons())
  return Promise.all([...Array(totalMons).keys()].map((id) => contr.mons(id)))
  }

  async function refreshUser() {
    if (!library || !account) return
    await getUsers(library, account)
      .then((_mons) => {
        // map result
        const monsMap = _mons.map((user) => ({
          
          lv: BigNumber.from(user.lv._hex).toNumber(),
        
        }))
        setCryptomons(monsMap)
       
      })
      .catch((err) => toast.error(err))
  }

  // Function that buys a Cryptomon through a smart contract function
  async function buyMon(id, price) {
    setIsBuyMonLoading(true)
    let overrides = {
      gasLimit: 120000,
    }
    const amount = '1'
    const _price = parseEther(amount)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const priceInWei = `${BigNumber.from(_price._hex).toBigInt()}`
    
    approve(library, account, priceInWei)
    .then(async (results) => {
      

    const tx = await contr.buyMon(id, overrides).catch((err) => setIsBuyMonLoading(false))
    const recpt = await tx?.wait()
    txSuccess(recpt, toast, refreshMons, (loadVal: boolean) => setIsBuyMonLoading(loadVal))
    txFail(recpt, toast, (loadVal: boolean) => setIsBuyMonLoading(loadVal))
  } 
    )}

  async function BuyBig(Betamount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(Betamount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.BuyBig(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function BuySmall(amount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.BuySmall(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function BuySingle(Betamount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(Betamount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.BuySingle(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function BuyDouble(amount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.BuyDouble(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function BuyZhuang(amount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.BuyZhuang(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function BuyXiang(amount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.BuyXiang(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function BuyHe(amount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.BuyHe(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function LuckyNumber(Number, Betamount: string) {
    let overrides = {
      gasLimit: 120000,
    }
    const _amount = parseEther(Betamount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
 
      approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.LuckyNumber(Number,amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function Registry() {
    let overrides = {
      gasLimit: 120000,
    }
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.Registry( overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)

  }

  async function RegistryWithInvitor(address: string) {
    let overrides = {
      gasLimit: 120000,
    }
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.RegistryWithInvitor(address, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)

  }

  async function AddCredit(amount) {
    let overrides = {
      gasLimit: 1200000,
    }
    
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve2(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.AddCredit(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
          // toast.success(`恭喜💐上分成功，请刷新页面查看余额`)
          toast.success(<div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
          恭喜💐上分成功，请刷新页面查看余额
        </div>)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  async function Cashout(amount) {
    let overrides = {
      gasLimit: 1200000,
    }
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.Cashout(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
          toast.success(<div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
          下分申请成功，系统将于24小时内审核完成
        </div>)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  // Function that adds a Cryptomon for sale through a smart contract function
  async function addForSale(id, price) {
    setIsAddForSaleLoading(true)
    if (price === 0 || price === '0') {
      toast.error('🦄 Price is 0')
      return
    }
    let overrides = {
      gasLimit: 120000,
    }
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const tx = await contr.addForSale(id, parseEther(price), overrides).catch((err) => setIsAddForSaleLoading(false))
    const receipt = await tx?.wait()
    if (receipt && receipt.status === 1) {
      toast.success(`Success, Tx hash: ${receipt.transactionHash}`)
      refreshMons()
      setIsAddForSaleLoading(false)
    }
    if (receipt && receipt.status === 0) {
      toast.error(`Error, Tx hash: ${receipt.transactionHash}`)
      setIsAddForSaleLoading(false)
    }
  }

  // Function that removes a Cryptomon from sale through a smart contract function
  async function removeFromSale(id) {
    setIsRemoveFromSaleLoading(true)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    let overrides = {
      gasLimit: 120000,
    }
    const tx = await contr.removeFromSale(id, overrides).catch((err) => setIsRemoveFromSaleLoading(false))
    const recpt = await tx?.wait()
    if (recpt && recpt.status === 1) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
      setIsRemoveFromSaleLoading(false)
    }
    if (recpt && recpt.status === 0) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
      setIsRemoveFromSaleLoading(false)
    }
  }

  // Function that breeds 2 Cryptomons through a smart contract function
  async function breedMons(id1, id2) {
    setIsBreedMonLoading(true)

    const price = '1'
    const _price = parseEther(price)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const priceInWei = `${BigNumber.from(_price._hex).toBigInt()}`
    // approve(library, account, priceInWei)

    const tx = await contr.breedMons(id1, id2).catch((err) => setIsBreedMonLoading(false))
    const recpt = await tx?.wait()
    try {
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      setIsBreedMonLoading(false)
    }

    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
      setIsBreedMonLoading(false)
    } 
    } catch (error) {
      toast.error(`Merge function error: ${error.data?.message || ''}`)
      setDisableFightBtn(false)
    }
    
     
    await refreshMons()
     
}

  // Function that allows 2 Cryptomons to fight through a smart contract function
  async function fight(id1, id2) {
    setDisableFightBtn(true)
    if (id1 === null || id2 === null) {
      return setDisableFightBtn(false)
    }

    let overrides = {
      gasLimit: 300000,
    }
    const price = '1'
    const _price = parseEther(price)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const priceInWei = `${BigNumber.from(_price._hex).toBigInt()}`
    
      const tx = await contr.fight(id1, id2, overrides).catch((err) => setDisableFightBtn(false))
      const recpt = await tx?.wait()
      if (recpt && recpt.status) {
        setFightTxDone(true)
      }

      if (recpt && !recpt.status) {
        toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
        setFightTxDone(false)
      }

  }

  // Function that starts sharing a Cryptomon to another address through a smart contract function
  async function startSharing(id, address) {
    setIsShareLoading(true)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    let overrides = {
      gasLimit: 120000,
    }
    const tx = await contr.startSharing(id, address, overrides).catch((err) => setIsShareLoading(false))
    const recpt = await tx?.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
      setIsShareLoading(false)
    }
    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
      setIsShareLoading(false)
    }
  }

  async function ClaimToken(id, _amount) {
    
    setIsShareLoading(true)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    let overrides = {
      gasLimit: 120000,
    }
    const tx = await contr.ClaimToken(id, _amount, overrides).catch((err) => setIsShareLoading(false))
    const recpt = await tx?.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
      setIsShareLoading(false)
    }
    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
      setIsShareLoading(false)
    }
  }

  // Function that rename your solider through a smart contract function
  async function NamePets(id, _name) {
    setIsShareLoading(true)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    let overrides = {
      gasLimit: 120000,
    }
    const tx = await contr.NamePets(id, _name, overrides).catch((err) => setIsShareLoading(false))
    const recpt = await tx?.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
      setIsShareLoading(false)
    }
    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
      setIsShareLoading(false)
    }
  }

   // Function that mint baby through a smart contract function
   async function createMon() {
    
    setIsShareLoading(true)
    const newprice = `${BigInt(10000000000000000)}`
    let overrides = {
      value: newprice,
      gasLimit: 220000,
    }
    
    const price = '1'
    const _price = parseEther(price)
    const priceInWei = `${BigNumber.from(_price._hex).toBigInt()}`
    approve(library, account, priceInWei)
    .then(async (results) => {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const tx = await contr.createMon(overrides).catch((err) => setIsShareLoading(false))
    const recpt = await tx?.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
      setIsShareLoading(false)
    }
    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
      setIsShareLoading(false)
    }
  })
  .catch((e) => {
    toast.error(`Error: ${e?.message}`)
    setDisableBuyItem(false)
  })

  }

  async function multiMint() {
    setIsShareLoading(true)
    // const newprice = `${BigInt(10000000000000000)}`
    let overrides = {
      // value: 1000000000,
      gasLimit: 1000000,
    }
    const price = '1'
    const _price = parseEther(price)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const priceInWei = `${BigNumber.from(_price._hex).toBigInt()}`
    
    const tx = await contr.multiMint(overrides).catch((err) => setIsShareLoading(false))
    const recpt = await tx?.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
      setIsShareLoading(false)
    }
    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
      setIsShareLoading(false)
    }
  
  }





  // Handlers for form inputs
  function handleShareId(event) {
    setShareId(event.target.value)
  }
  function handleShareAddress(event) {
    setShareAddress(event.target.value)
  }

  function handleRenameId(event) {
    setRenameId(event.target.value)
  }

  function handleYourName(event) {
    setYourName(event.target.value)
  }

  function handleChange(id, event) {
    setValue( id.value)
    setValue( event.target.value)
  }


  function handleBuyItemAmount(event) {
    setBuyItemAmount(event.target.value)
  }

  function handleLuckyAmount(event) {
    setLuckyAmount(event.target.value)
  }

  function handleSingleAmount(event) {
    setBuySingleAmount(event.target.value)
  }

  function handleDoubleAmount(event) {
    setBuyDoubleAmount(event.target.value)
  }

  function handleBuyZhuangAmount(event) {
    setBuyZhuangAmount(event.target.value)
  }

  function handleInvitationCode(event) {
    setInvitationCode(event.target.value)
  }

  function handleBuyXiangAmount(event) {
    setBuyXiangAmount(event.target.value)
  }

  function handleBuyHe(event) {
    setBuyHeAmount(event.target.value)
  }

  function handleBuybigAmount(event) {
    setBuybigAmount(event.target.value)
  }

  function handleBuySmallAmount(event) {
    setBuySmallAmount(event.target.value)
  }

  function handleCashOutAmount(event) {
    setCashOutAmount(event.target.value)
  }

  function handleBurn(event) {
    setBurnAmount(event.target.value)
  }

  async function buyItem(units: string, price: string, itemNumber: string, data: string = '0x00') {
    setDisableBuyItem(true)
    if (!units || !price || !itemNumber) {
      return
    }
    let overrides = {
      gasLimit: 120000,
    }
    const _price = parseEther(price)
    const priceInWei = `${BigNumber.from(_price._hex).toBigInt()}`
    approve(library, account, priceInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.buyItem(units, priceInWei, itemNumber, data, overrides)
          const recpt = await tx?.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  // Function that used for healing mons
  async function Healing(id, units: string, itemNumber: string, data: string = '0x00') {
    setDisableBuyItem(true)
    // if (!units || !itemNumber) {
    //   return
    // }
    let overrides = {
      gasLimit: 120000,
    }
    const price = '1'
    const _price = parseEther(price)
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const priceInWei = `${BigNumber.from(_price._hex).toBigInt()}`
    setApprovalForAll(library, account, priceInWei)
    .then(async (results) => {
      if (results) {
        const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
        const tx = await contr.Healing(id, units, itemNumber, data, overrides)
        const recpt = await tx?.wait()
        txSuccess(recpt, toast, refreshMons)
        txFail(recpt, toast)
      } else {
        toast.error(`Error in approving`)
      }
      setDisableBuyItem(false)
    })
    .catch((e) => {
      toast.error(`Error: ${e?.message}`)
      setDisableBuyItem(false)
    })
  }

  async function burn(amount: string) {
    setDisableBuyItem(true)
    if (!amount) {
      return
    }
    const _amount = parseEther(amount)
    const amountInWei = `${BigNumber.from(_amount._hex).toBigInt()}`
    let overrides = {
      gasLimit: 120000,
    }
    approve(library, account, amountInWei)
      .then(async (results) => {
        if (results) {
          const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
          const tx = await contr.burn(amountInWei, overrides)
          const recpt = await tx.wait()
          txSuccess(recpt, toast, refreshMons)
          txFail(recpt, toast)
        } else {
          toast.error(`Error in approving`)
        }
        setDisableBuyItem(false)
      })
      .catch((e) => {
        toast.error(`Error: ${e?.message}`)
        setDisableBuyItem(false)
      })
  }

  // Components
  // div that holds the name and id of each Cryptomon
  const nameDiv = (mon) => {
    return (
      <div>
       
      </div>
    )
  }

  // Function that  returns the style of the background image according to Cryptomons' type
  const bgStyle = (Type) => ({
    backgroundImage: 'url(' + bg[Type] + ')',
    backgroundSize: '210px 240px',
  })

  // div that holds the images (Cryptomon image and background image) of a Cryptomon
  const imgDiv = (mon) => {
    return (
      <div className="monBox" style={bgStyle(mon?.monType)}>
        <label className="" style={{ float: 'left', fontSize: '14px', color: 'white'}}>
          {mon?.Name}
        </label>
        <label className="" style={{ float: 'right' }}>
          {'ID:' + mon?.id}
        </label>
        <img className="monImg" src={MonImages[`${parseInt(mon?.species) + 1}`]} alt={mon?.species} />
        <label className="" style={{ color: 'yellow'}} >{['lv:' + mon?.lv]}</label>
        <label className="" style={{ color: 'yellow', float: 'right'}} >{['MP:' + mon?.mp]}</label>
      </div>
    )
  }

  const BossimgDiv = (user) => {
    return (
        <div className="monBox" style={bgStyle(user?.monType)}>

         
          <label className="" style={{ color: 'yellow'}} >{['lv:' + user?.lv]}</label>
         
        </div>
      )
  }

  const foruserlv = myCryptomons
    .map((user) => (
      <React.Fragment key={user.id}>
        <div className="mon">
          <figure className="my-figure">
            {BossimgDiv(user)}
          </figure>
          
        </div>
      </React.Fragment>
    ))

  // div that holds the stats of a Cryptomon
  const statDiv = (mon) => {
    return (
      <div className="stat-area">

        <div className="stat-line">
          <label className="stat-label">Hp: </label>
          <StatBar percentage={(mon?.hp * 100) / 140} />
        </div>
        <div className="stat-line">
          <label className="stat-label">Attack: </label>
          <StatBar percentage={(mon?.atk * 100) / 140} />
        </div>
        <div className="stat-line">
          <label className="stat-label">Defense: </label>
          <StatBar percentage={(mon?.def * 100) / 140} />
        </div>
      </div>
    )
  }

  // used for claimtokendiv stat
  const claimstatDIV = (mon) => {
    return (
      <div className="stat-area">

        <div className="stat-line">
          <label className="form-label" style={{color: 'yellow'}} >Reward Balance: </label>
          {mon?.rewardpool * 100}
        </div>

      </div>
    )
  }

  // Create the div with add for sale button
  const addForSaleDiv = (mon, value) => {
    return (
      <div className="selling-div">
        <label className="add-for-sale-label">Set creatures price:</label>
        <input type="number"  className="add-for-sale-input" placeholder='0' value={ mon.id.value} onChange={(e) => handleChange(mon?.id, e)}/>
        {isAddForSaleLoading ? (
          <button className="rpgui-button" type="button" style={{ width: '100%' }}>
            <Spinner color="#000" />
          </button>
        ) : (
          <button
            className="rpgui-button"
            type="button"
            style={{ float: 'right' }}
            onClick={() => addForSale(mon?.id, value)} 
          >
            Add for sale
          </button>
        )}
      </div>
    )
  }

  // Create the div for claim button
  const ClaimtokenDiv = (mon, value) => {
   
    return (
      <div className="selling-div">
        {isAddForSaleLoading ? (
          <button className="rpgui-button" type="button" style={{ width: '100%' }}>
            <Spinner color="#000" />
          </button>
        ) : (
          <button
            className="rpgui-button"
            type="button"
            style={{ float: 'right' }}
            onClick={() => {if(mon?.rewardpool < 50){ alert('Claim amount under 5000'); return null}

              ClaimToken(mon?.id, '5000000000000000000000')} }
          >
            Claim
            
          </button>
        )}
        
      </div>
    )
  }

  // Create the div with remove from sale button
  const removeFromSaleDiv = (mon) => {
    return (
      <div className="selling-div">
        <label className="remove-from-sale-label">
          Price:
          <br />
          {formatUnits(mon?.price)}
        </label>
        {isRemoveFromSaleLoading ? (
          <button className="rpgui-button" type="button" style={{ width: '100%' }}>
            <Spinner color="#000" />
          </button>
        ) : (
          <button
            className="rpgui-button"
            type="button"
            style={{ float: 'right' }}
            onClick={() => removeFromSale(mon?.id)} 
          >
            Remove from sale
            {isRemoveFromSaleLoading && <Spinner color="#000" />}
          </button>
        )}
      </div>
    )
  }

  // Create the div with buy button
  const buyDiv = (mon) => {
    return (
      <div className="buying-div">
        <div className="sale-price">
          Price:
          <br />
          {formatUnits(mon?.price, 18)}
        </div>
        <div className="sale-owner">Creature Owner: {mon?.owner} </div>
        {isBuyMonLoading ? (
          <button className="rpgui-button" type="button" style={{ width: '100%' }}>
            <Spinner color="#000" />
          </button>
        ) : (
          <button
            className="sale-btn rpgui-button"
            type="button"
            style={{ float: 'right' }}
            onClick={() => buyMon(mon?.id, mon?.price)}
          >
            Buy
          </button>
        )}
      </div>
    )
  }

  // Create the div with breed choice 1, choice 2 buttons
  const breedDiv = (mon) => {
    return (
      <div className="breed-choice-div">
        <button
          className="br-Choice-btn rpgui-button"
          type="button"
          style={{ float: 'right' }}
          onClick={() => { 
            setBreedChoice1(mon?.id)
          }}
        >
          Choice 1
        </button>
        <button
          className="br-Choice-btn rpgui-button"
          type="button"
          style={{ float: 'right' }}
          onClick={() => {
            setBreedChoice2(mon?.id)
          }}
        >
          Choice 2
        </button>
      </div>
    )
  }

  const breedOption = (breedchoice) => {
    if (breedchoice === null) {
      return (
        <div className="mon">
          <figure className="my-figure">
            <figcaption>
              <div className="monBox">
                {' '}
                <img className="monImg" src={MonImages['151']} alt={'empty'} />
              </div>
            </figcaption>
          </figure>
        </div>
      )
    } else {
      return cryptomons
        .filter((mon) => mon.id === breedchoice)
        .map((mon) => (
          <React.Fragment key={mon.id}>
            <div className="mon">
              <figure className="my-figure">
                {imgDiv(mon)}
                <figcaption></figcaption>
              </figure>
            </div>
          </React.Fragment>
        ))
    }
  }

  // div with users Cryptomons
  const myCryptomonsDiv = myCryptomons
    .filter((mon) => !mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {addForSaleDiv(mon, value)}
        </div>
      </React.Fragment>
    ))

    // used for claim rewards
    const claimtokenDiv = myCryptomons

    .filter((mon) => !mon.forSale && mon?.rewardpool >= 5)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{claimstatDIV(mon)}</figcaption>
          </figure>
          {ClaimtokenDiv(mon, value)}
        </div>
      </React.Fragment>
    ))


  // div with user's Cryptomons that are for sale
  const forSaleCryptomons = myCryptomons
    .filter((mon) => mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {removeFromSaleDiv(mon)}
        </div>
      </React.Fragment>
    ))

  // div with Cryptomons available for buy to the user
  const buyCryptomons = otherCryptomons
    .filter((mon) => mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {buyDiv(mon)}
        </div>
      </React.Fragment>
    ))

  // div with user's Cryptomons that can be used for breeding
  const forBreedCryptomons = myCryptomons
    .filter((mon) => !mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {breedDiv(mon)}
        </div>
      </React.Fragment>
    ))

  const cond = (mon) =>
    (mon.owner.toString().toLowerCase() === account?.toString()?.toLowerCase() && !mon.forSale) 

  // div with user's Cryptomons that can be used to fight with
  const forFightWithCryptomons = cryptomons.filter(cond).map((mon) => (
    <React.Fragment key={mon.id}>
      <div className="mon">
        <figure className="my-figure">
          {nameDiv(mon)}
          {imgDiv(mon)}
          <figcaption>{statDiv(mon)}</figcaption>
        </figure>
        <div className="fight-choice-div">
          <button
            className="fight-Choice-btn rpgui-button"
            type="button"
            style={{ float: 'right' }}
            // onClick={() => {
            //   setFightChoice1(mon.id)
            // }} 
            onClick={() => {
              if(mon?.hp < 70){ alert('hp too low'); return null}
              setFightChoice1(mon.id)
            }} 
            
          >
            Choice 1
          </button>
        </div>
        <div className="fight-choice-div">
          <button
            className="fight-Choice-btn rpgui-button"
            type="button"
            style={{ float: 'right' }}
            onClick={() => {
              Healing(mon.id, '50', '0')
            }}
            disabled={disableBuyItemBtn}
          >
            Healing
          </button>
        </div>
      </div>
    </React.Fragment>
  ))

  // div with Cryptomons that user can fight against
  const forFightAgainstCryptomons = otherCryptomons
  
    .filter((mon) => !mon.forSale   && mon.hp >= 70 && mon.owner.toLowerCase() !== deadaddress?.toString().toLocaleLowerCase())
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          <div className="fight-choice-div">
            <button
              className="fight-Choice-btn rpgui-button"
              type="button"
              style={{ float: 'right' }}
              onClick={() => {
                setFightChoice2(mon.id)
              }}
            >
              Choice 2
            </button>
          </div>
        </div>
      </React.Fragment>
    ))


  // div with user's shared Cryptomons
  const MyownMon = myCryptomons
    .filter((mon) => mon.owner.toLowerCase() === account?.toString().toLocaleLowerCase() && !mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
        </div>
      </React.Fragment>
    ))

  // div with Cryptomons shared to the user
  const sharedToMe = otherCryptomons
  .filter((mon) =>  !mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          <div className="sharing-div">
            <label className="shared-owner">Creature Owner: {mon.owner} </label>
            
          </div>
        </div>
      </React.Fragment>
    ))

  // Function that does all the rendering of the application
  return (
    // Creation of the different tabs of the UI
    <div className="rpgui-content">
      <ToastContainer />

      <div className="AppTitle">
        <div className="row" style={{ maxWidth: '100%' }}>
          <div className="column title-column col-lg-3 col-sm-12">
            <img src={MonImages['favicon16x16']} alt="lokian-logo" /> <span>Block & Time </span>
          </div>

          <div className="column user-info-column col-lg-3 col-sm-12">
            {/* ERC20, LOKs */}
            <span className="rpgui-container framed-grey">
           {foruserlv}
            <div className="p1" style={{ padding: '2px', fontSize: '15px'}}>
            当前余额
          </div>
              {`${Math.round(Number(tokenBalance) * 1e4) / 1e4 || '0'}  `}{' '}
            </span>
          </div>

          <div className="column wallet-info-column col-lg-6 col-sm-12">
            <div className="row wallet-buttons">
              {/* wallet logout */}
              <div className={`column wallet-column ${active ? 'col-lg-3' : ''} col-sm-12`}>
                {(active || error) && (
                  <button
                    className="rpgui-button"
                    onClick={() => {
                      deactivate()
                      setCryptomons([])
                      setMyCryptomons([])
                      setOtherCryptomons([])
                      setWinner(null)
                      setRounds(null)
                      setValue(0)
                    }}
                  >
                    Logout
                  </button>
                )}
              </div>
              {/* wallet info */}
              {Object.keys(connectorsByName).map((name) => {
                const currentConnector = connectorsByName[name]
                const activating = currentConnector === activatingConnector
                const connected = currentConnector === connector
                const disabled = !triedEager || !!activatingConnector || connected || !!error

                return (
                  <div className={`column wallet-column col-lg-${active ? '9' : '12'} col-sm-12`}>
                    <button
                      className="rpgui-button golden"
                      type="button"
                      style={{
                        fontSize: '20px',
                        paddingTop: '14px',
                        width: '100%',
                      }}
                      onClick={() => {
                        setActivatingConnector(currentConnector)
                        activate(currentConnector)
                      }}
                      disabled={disabled}
                      key={name}
                    >
                      {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                      <Account />
                      <div style={{ display: 'none' }}>{name}</div>
                      {!account ? 'Connect Wallet' : ''}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column user-info-column col-lg-12 col-sm-12">
            {/* Network Errors */}
            {!!error && (
              <h4 className="rpgui-container framed-golden-2" style={{ marginTop: '1rem', marginBottom: '0' }}>
                {getErrorMessage(error)}
              </h4>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="myCryptomons" id="uncontrolled-tab-example">
        {/* <Tab className="x" eventKey="myCryptomons" title="My Creatures">
          <div className="p1">Your Entries</div>
          {myCryptomonsDiv}
        </Tab> */}

        {/* <Tab className="x" eventKey="MintBaby" title="Get Your Baby">
          <div className="p1" style={{
                        fontSize: '20px',
                        paddingTop: '14px',
                        width: '100%',
                        color: 'orange',
                      }} >Get Your Baby Now</div>

          <div className="sharing-area">

          <div className="skellies">
               

              <img className="monImg" style={{
                        height: '220px',
                        paddingTop: '4px',
                        width: '480px',
                      }} src={MonImages['MintCard']} alt="skeleton-people-1" />

            </div>
           
            <div className="form-line">
              {isShareLoading ? (
                <button className="rpgui-button" type="button" style={{ width: '100%' }}>
                  <Spinner color="#000" />
                </button>
              ) : (
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => createMon()}
                >
                  Mint Baby x 1
                </button>
              )}
            </div>

            <div className="form-line">
              {isShareLoading ? (
                <button className="rpgui-button" type="button" style={{ width: '100%' }}>
                  <Spinner color="#000" />
                </button>
              ) : (
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => multiMint()}
                >
                  Mint Baby x 5
                </button>
              )}
            </div>

          </div>

          {MyownMon}
        </Tab> */}


        {/* <Tab eventKey="forSale" title="My Shop">
          <div className="p1">My Shop</div>
          {forSaleCryptomons}
        </Tab> */}

        {/* <Tab eventKey="buyCryptomons" title="Marketplace">
          {buyCryptomons}
        </Tab> */}

        <Tab eventKey="breedCryptomons" title="简介">
          <div className="p1"><div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
          全球首个区块链去中心化竞彩平台
          </div></div>


          <div className="breeding-area">
            {breedOption(breedChoice1)} <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

            <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
          B & T <br/>始终坚持创新，追求信誉，独家首创全链上交互操作，安全高效♻️<br/>
          全站采用区块链上的区块高度和区块时间作为开奖结果，链上数据不可篡改🔥<br/>
          实时返奖，立志打造一个真正的去中心化区块链娱乐网站<br/>
          🔥注重信誉和口碑积累，玩家认可度高，DAO理念，品牌助力代理自主发展会员。<br/>
          🔥公平、公正、公开的顶级一站式服务，为玩家打造高端、舒适游戏环境
          </div>
            {isBreedMonLoading ? (
              <button className="rpgui-button" type="button" style={{ width: '100%' }}>
                <Spinner color="#000" />

              </button>
            ) : (
              <button
                className="rpgui-button"
                type="button"
                style={{ width: '420px' }}
                // onClick={() => {window.location.href= 'https://t.me/jianlaiSQ' } }
                onClick={() =>window.open('https://t.me/BlockandTime') }
                 
              >
            <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
          加入电报频道
          </div>
              </button>
            )}

{isBreedMonLoading ? (
              <button className="rpgui-button" type="button" style={{ width: '100%' }}>
                <Spinner color="#000" />
              </button>
            ) : (
              <button
                className="rpgui-button"
                type="button"
                style={{ width: '420px' }}
                // onClick={() => {window.location.href= 'https://t.me/jianlaiSQ' } }
                onClick={() =>window.open('https://t.me/BlockandTimeBot') }
                 
              >
            <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
          联系电报在线客服
          </div>
              </button>
            )}
          </div>

          <br />
          {forBreedCryptomons}
        </Tab>

 

        {/* <Tab eventKey="fight" title="PVP-MODE">
          <div className="p1">V S</div>
          <div className="fighting-area">
            {breedOption(fightChoice1)}
            {breedOption(fightChoice2)}
            

            <label className="winner-label">
              {' '}
              {fightTxDone ? names[cryptomons.find((mon) => mon.id?.toString() === winner?.toString())?.species] : ''}
              {!winner || winner === 12345678911 ? '' : ''}
              {winner === 12345678910 ? "no one, it's a tie" : ''}
            </label>

            {fightTxDone && winner !== 12345678910 ? (
              <>
                <br />
                <label className="winner-label">Winning creature's Id: {winner}</label>
                <br />
                <label className="winner-label">Rounds the fight lasted: {rounds}</label>
                <br />

                {!fightTxDone && rewards === 0 && !winner ? (
                  ''
                ) : (
                  <label className="winner-label">{rewards === 0 ? '' : `You have won ${rewards * 100} LOKs!`}</label>
                )}

{!fightTxDone && rewards === 0 && !winner ? (
                  ''
                ) : (
                  <label className="winner-label">{rewards === 0 ? '' : <div className="skellies">
               

                  <img className="monImg" style={{
                            height: '220px',
                            paddingTop: '4px',
                            width: '480px',
                          }} src={MonImages['MintCard']}  />
    
                </div>}</label>
                )} 

 {!fightTxDone && rewards !== 0 && !winner ? (
                  ''
                ) : (
                  <label className="winner-label">{rewards !== 0 ? '' : `You have loat ${rounds * 100} LOKs!`}</label>
                )}

{!fightTxDone && rewards !== 0 && !winner ? (
                  ''
                ) : (
                  <label className="winner-label">{rewards !== 0 ? '' : <div className="skellies">
               

                  <img className="monImg" style={{
                            height: '220px',
                            paddingTop: '4px',
                            width: '480px',
                          }} src={MonImages['5']}  />
    
                </div>}</label>
                )}


              </>
            ) : (
              ''
            )}

            {disableFightBtn ? (
              <div className="skellies">
               
                  <img className="monImg" style={{
                            height: '220px',
                            paddingTop: '4px',
                            width: '480px',
                          }} src={MonImages['fight']}  />
    
                </div>
            ) : (
              <button
                id="fight-btn"
                className="rpgui-button"
                type="button"
                onClick={() => {
                  setWinner(null)
                  setRounds(null)
                  setFightTxDone(false)
                  setRewards(0)
                  fight(fightChoice1, fightChoice2)
                }}
                disabled={disableFightBtn}
              >
                Fight with choosen creatures
              </button>
            )}
          </div>

          <div className="fight-mons-area">
            <div className="fightWith-area">
              <div className="p2">Your Babys</div>
              {forFightWithCryptomons}
            </div>

            <div className="fightAgainst-area">
              <div className="p2">Opponent Creatures</div>
              {forFightAgainstCryptomons}
            </div>
          </div> 


        </Tab> */}


        <Tab eventKey="share" title="单双玩法">
        <div className="p1">
          <div className="p1" style={{ padding: '12px', fontSize: '30px'}}>
            单双玩法
          </div>
            <div style={{ marginLeft: '46%', marginRight: 'auto' }}>
              <div className="row">
                <div className="column">
                  {!swords ? <div className="rpgui-icon magic-slot"></div> : <div className="rpgui-icon sword"></div>}
                  {!shields ? (
                    <div className="rpgui-icon helmet-slot"></div>
                  ) : (
                    <div className="rpgui-icon shield"></div>
                  )}
                  {/* {healingPotions || manaPotions || magicPotions ? (
                    <div className="rpgui-icon potion-red"></div>
                  ) : (
                    <div className="rpgui-icon potion-slot"></div>
                  )} */}
                </div>
              </div>
            </div>
            <br />
            <div style={{ marginLeft: '20%', marginRight: 'auto' }}>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* <p>You have {`${swords}`} swords!</p>
                  <p>You have {`${shields}`} shields!</p> */}
                  <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
                  游戏规则
          </div>
          <div className="p1" style={{ padding: '12px', fontSize: '20px', alignItems: 'flex-start'}}>
              赔率：2倍 <br />
投注根据链上交易产生的区块高度最后一个数字和区块时间的最后一个数字相加后的个位数作为开奖结果 <br />
如两个数相加为 18，个位为 8；则此次开奖结果为双  <br />
如两个数相加为 9，个位为 9；则此次开奖结果为单  <br />

1,3,5,7,9 识别为单 <br />

0,2,4,6,8 识别为双 <br />

全程由区块链自动运行，接受任意额度的投注
          </div>
                  {/* <p>You have {`${manaPotions}`} mana potions!</p>
                  <p>You have {`${magicPotions}`} magic potions!</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="rpgui-container framed-grey">
            
            
            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buysingleAmount}
                  onChange={(e) => handleSingleAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => BuySingle(buysingleAmount)}
                  disabled={disableBuyItemBtn}
                >
                 <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            押单
          </div>
                </button>
              </div>
            </div>

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buydoubleAmount}
                  onChange={(e) => handleDoubleAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => BuyDouble(buydoubleAmount)}
                  disabled={disableBuyItemBtn}
                >
                   <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            押双
          </div>
                </button>
              </div>
            </div>

           

            <div className="sharing-area">
              <span>
                <div className="rpgui-icon potion-green"></div> 全球首创区块链 BSC 自动化竞彩平台
              </span>
             
            </div>
          </div>
        </Tab>
                 
        <Tab eventKey="ggg" title="百家乐">
        <div className="p1">
          <div className="p1" style={{ padding: '12px', fontSize: '30px'}}>
            庄闲和
          </div>
            <div style={{ marginLeft: '45%', marginRight: 'auto' }}>
              <div className="row">
                <div className="column">
                  {!swords ? <div className="rpgui-icon weapon-slot"></div> : <div className="rpgui-icon sword"></div>}
                  {!shields ? (
                    <div className="rpgui-icon shield-slot"></div>
                  ) : (
                    <div className="rpgui-icon shield"></div>
                  )}
                  {healingPotions || manaPotions || magicPotions ? (
                    <div className="rpgui-icon potion-red"></div>
                  ) : (
                    <div className="rpgui-icon potion-slot"></div>
                  )}
                </div>
              </div>
            </div>
            <br />
            <div style={{ marginLeft: '20%', marginRight: 'auto' }}>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* <p>You have {`${swords}`} swords!</p>
                  <p>You have {`${shields}`} shields!</p> */}
                  <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
                  游戏规则
          </div>
          <div className="p1" style={{ padding: '12px', fontSize: '20px', alignItems: 'flex-start'}}>
              庄闲赔率：2倍 <br />
              押和赔率：8倍 <br />
投注根据链上交易产生的区块高度最后一个数字和区块时间的最后一个数字相加后的个位数作为开奖结果 <br />
区块链上产生的区块高度最后一个数字作为 庄  <br />
区块链上产生的区块时间最后一个数字作为 闲   <br />

假如区块高度最后一个数大于区块时间的最后一个数， 识别为庄赢 <br />

假如区块高度最后一个数小于区块时间的最后一个数， 识别为闲赢 <br />

当两个数字相同时，结果识别为 和 <br />

全程由区块链自动运行，接受任意额度的投注
          </div>
                  {/* <p>You have {`${manaPotions}`} mana potions!</p>
                  <p>You have {`${magicPotions}`} magic potions!</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="rpgui-container framed-grey">
            
            
            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buyZhuangAmount}
                  onChange={(e) => handleBuyZhuangAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => BuyZhuang(buyZhuangAmount)}
                  disabled={disableBuyItemBtn}
                >
                 <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            押庄
          </div>
                </button>
              </div>
            </div>

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buyXiangAmount}
                  onChange={(e) => handleBuyXiangAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => BuyXiang(buyXiangAmount)}
                  disabled={disableBuyItemBtn}
                >
                   <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            押闲
          </div>
                </button>
              </div>
            </div>

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buyHeAmount}
                  onChange={(e) => handleBuyHe(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => BuyHe(buyHeAmount)}
                  disabled={disableBuyItemBtn}
                >
                   <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            押和
          </div>
                </button>
              </div>
            </div>

           

            <div className="sharing-area">
              <span>
                <div className="rpgui-icon potion-green"></div> 全球首创区块链 BSC 自动化竞彩平台
              </span>
             
            </div>
          </div>
        </Tab>




        <Tab eventKey="token" title="猜大小" >

          <div className="p1">
          <div className="p1" style={{ padding: '12px', fontSize: '30px'}}>
            大小玩法
          </div>
            <div style={{ marginLeft: '49%', marginRight: 'auto' }}>
              <div className="row">
                <div className="column">
                  {/* {!swords ? <div className="rpgui-icon shoes-slot"></div> : <div className="rpgui-icon sword"></div>} */}
                  {!shields ? (
                    <div className="rpgui-icon shoes-slot"></div>
                  ) : (
                    <div className="rpgui-icon shield"></div>
                  )}
                  {/* {healingPotions || manaPotions || magicPotions ? (
                    <div className="rpgui-icon potion-red"></div>
                  ) : (
                    <div className="rpgui-icon potion-slot"></div>
                  )} */}
                </div>
              </div>
            </div>
            <br />
            <div style={{ marginLeft: '20%', marginRight: 'auto' }}>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* <p>You have {`${swords}`} swords!</p>
                  <p>You have {`${shields}`} shields!</p> */}
                  <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
                  游戏规则
          </div>
          <div className="p1" style={{ padding: '12px', fontSize: '20px', alignItems: 'flex-start'}}>
              赔率：2倍 <br />
投注根据链上交易产生的区块高度最后一个数字和区块时间的最后一个数字相加作为开奖结果 <br />

0 - 9 识别为小 <br />

10 - 18 识别为大 <br />

全程由区块链自动运行，接受任意额度的投注
          </div>
                  {/* <p>You have {`${manaPotions}`} mana potions!</p>
                  <p>You have {`${magicPotions}`} magic potions!</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="rpgui-container framed-grey">
            
            
            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buyBigAmount}
                  onChange={(e) => handleBuybigAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => BuyBig(buyBigAmount)}
                  disabled={disableBuyItemBtn}
                >
                 <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            押大
          </div>
                </button>
              </div>
            </div>

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buySmallAmount}
                  onChange={(e) => handleBuySmallAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => BuySmall(buySmallAmount)}
                  disabled={disableBuyItemBtn}
                >
                   <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            押小
          </div>
                </button>
              </div>
            </div>

           

            <div className="sharing-area">
              <span>
                <div className="rpgui-icon potion-green"></div> 全球首创区块链 BSC 自动化竞彩平台
              </span>
             
            </div>
          </div>

         
        </Tab>

        <Tab eventKey="share1" title="幸运区块链">
        <div className="p1">
          <div className="p1" style={{ padding: '12px', fontSize: '30px'}}>
            幸运区块链
          </div>
            <div style={{ marginLeft: '45%', marginRight: 'auto' }}>
              <div className="row">
                <div className="column">
                  {!swords ? <div className="rpgui-icon weapon-slot"></div> : <div className="rpgui-icon sword"></div>}
                  {!shields ? (
                    <div className="rpgui-icon shield-slot"></div>
                  ) : (
                    <div className="rpgui-icon shield"></div>
                  )}
                  {healingPotions || manaPotions || magicPotions ? (
                    <div className="rpgui-icon potion-red"></div>
                  ) : (
                    <div className="rpgui-icon potion-slot"></div>
                  )}
                </div>
              </div>
            </div>
            <br />
            <div style={{ marginLeft: '20%', marginRight: 'auto' }}>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* <p>You have {`${swords}`} swords!</p>
                  <p>You have {`${shields}`} shields!</p> */}
                  <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
                  游戏规则
          </div>
          <div className="p1" style={{ padding: '12px', fontSize: '20px', alignItems: 'flex-start'}}>
              赔率：10倍 <br />
投注根据链上交易产生的区块高度最后一个数字和<br />

区块时间的最后一个数字相加后的数字作为开奖结果 <br />

最小的开奖结果为 0 <br />

最大的开奖结果为18 <br />

玩家输入0 - 18 其中的任意数字，当开奖结果和玩家输入的数字相同时则赢  <br />

全程由区块链自动运行，接受任意额度的投注
          </div>
                  {/* <p>You have {`${manaPotions}`} mana potions!</p>
                  <p>You have {`${magicPotions}`} magic potions!</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="rpgui-container framed-grey">
            
            
            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            输入 0 - 18 任意数字
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={luckyamount}
                  onChange={(e) => handleLuckyAmount(e)}
                />
              </div>
           
            </div>

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            投注金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buyItemAmount}
                  onChange={(e) => handleBuyItemAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => LuckyNumber(luckyamount,buyItemAmount)}
                  disabled={disableBuyItemBtn}
                >
                   <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            确认
          </div>
                </button>
              </div>
            </div>

           

            <div className="sharing-area">
              <span>
              <div className="rpgui-icon potion-green"></div> 全球首创区块链 BSC 自动化竞彩平台
          
              </span>
             
            </div>
          </div>
        </Tab>

        <Tab eventKey="token2" title="上分">
        <div className="p1" style={{ padding: '12px', fontSize: '30px'}}>
            剩余额度
          </div>
          <div className="p1" style={{ padding: '12px' }}>
            {tokenBalance} 分
          </div>
          <br />
          <br />
          <div className="p1">
          <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
            号外：充值任意金额一律返水5%❗️ <br/>
            注： 暂只支持 BSC 链 USDT 上分
          </div>
         
            <br />
            <div style={{ marginLeft: '40%', marginRight: 'auto' }}>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* <p>You have {`${swords}`} swords!</p>
                  <p>You have {`${shields}`} shields!</p> */}
       
                  {/* <p>You have {`${manaPotions}`} mana potions!</p>
                  <p>You have {`${magicPotions}`} magic potions!</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="rpgui-container framed-grey">
          <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
          各位老板，近期骗子无数，无论是客服还是财务，但凡私聊发地址充钱❗️❗️❗️以高额彩金诱导充值上分的均为骗子 
❗️❗️上下分请您在本站操作 ❗️❗️
          </div>
            
            <div className="sharing-area">
              <span>
             
              </span>
              {/* <div className="form-line with-buy-item">
                <label className="form-label">Amount</label>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buyItemAmount}
                  onChange={(e) => handleBuyItemAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => buyItem(buyItemAmount, '500', '3')}
                  disabled={disableBuyItemBtn}
                >
                  Buy
                </button>
              </div> */}
            </div>

       

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            充值金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={CashOuteAmount}
                  onChange={(e) => handleCashOutAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => AddCredit(CashOuteAmount)}
                  disabled={disableBuyItemBtn}
                >
                  Confirm
                </button>
              </div>
            </div>

           

            
          </div>
        </Tab>

        
        <Tab className="x" eventKey="claim" title="下分">
        <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
            可用额度
          </div>
        
          <div className="p1" style={{ padding: '12px' }}>
            {tokenBalance} 分
          </div>
          <br />
          <br />
          <div className="p1">
          <div className="p1" style={{ padding: '12px', fontSize: '30px'}}>
            下分在此操作
          </div>
         
            <br />
            <div style={{ marginLeft: '40%', marginRight: 'auto' }}>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* <p>You have {`${swords}`} swords!</p>
                  <p>You have {`${shields}`} shields!</p> */}
       
                  {/* <p>You have {`${manaPotions}`} mana potions!</p>
                  <p>You have {`${magicPotions}`} magic potions!</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="rpgui-container framed-grey">

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            下分金额
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={buyItemAmount}
                  onChange={(e) => handleBuyItemAmount(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => Cashout(buyItemAmount)}
                  disabled={disableBuyItemBtn}
                >
                  Confirm
                </button>
              </div>
            </div>

           

            
          </div>
        
        </Tab>

        <Tab className="s" eventKey="claims" title="邀请返佣">
        <div className="p1" style={{ padding: '12px', fontSize: '20px'}}>
            返佣机制
          </div>
        
         
          <br />
          <br />
          <div className="p1">
          <div className="p1" style={{ padding: '12px', fontSize: '30px'}}>
            用户先在下方点击生成邀请码 <br/>
            完成后，您的钱包地址就相当于您的专属邀请码  <br/>
            当有受邀者使用您的邀请码（即钱包地址）完成注册时  <br/>
            每次受邀者上分时，系统会自动转账上分金额的5%到您的钱包地址 <br/>
            注：用户使用邀请码注册后，每次上分可额外得到 2% 的返水 <br/>
            用戶注册后其钱包地址也会自动成为邀请码，无需重新点击生成验证码
          </div>
         
            <br />
            <div style={{ marginLeft: '40%', marginRight: 'auto' }}>
              <div className="row">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* <p>You have {`${swords}`} swords!</p>
                  <p>You have {`${shields}`} shields!</p> */}
       
                  {/* <p>You have {`${manaPotions}`} mana potions!</p>
                  <p>You have {`${magicPotions}`} magic potions!</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="rpgui-container framed-grey">

            <div className="sharing-area">
              {/* <span>
                <div className="rpgui-icon potion-red"></div>A Healing Potion (50 Loks)
              </span> */}
              <div className="form-line with-buy-item">
              <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
            请在下方输入邀请码
          </div>
                <input
                  className="form-input"
                  placeholder="0"
                  value={InvitationCode}
                  onChange={(e) => handleInvitationCode(e)}
                />
              </div>
              <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => RegistryWithInvitor(InvitationCode)}
                  disabled={disableBuyItemBtn}
                >
                   <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
           完成注册
          </div>
                </button>
              </div>
            </div>

            <div className="form-line with-buy-item">
                <button
                  className="rpgui-button"
                  type="button"
                  style={{ float: 'right' }}
                  onClick={() => Registry()}
                  disabled={disableBuyItemBtn}
                >
                  <div className="p1" style={{ padding: '2px', fontSize: '20px'}}>
           点击生成邀请码
          </div>
                </button>
              </div>

           

            
          </div>
        
        </Tab>

      </Tabs>
    </div>
  )
}

export default App
