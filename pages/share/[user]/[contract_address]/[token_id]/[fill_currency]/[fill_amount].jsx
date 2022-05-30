import { useRouter } from 'next/router'
import { NFTPreview, MediaConfiguration } from '@zoralabs/nft-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import Link from 'next/link';
import { ethers, BigNumber } from 'ethers';
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json";
import { ZoraModuleManager__factory } from "@zoralabs/v3/dist/typechain/factories/ZoraModuleManager__factory";
import { AsksV11__factory } from "@zoralabs/v3/dist/typechain/factories/AsksV11__factory";
import { useEffect } from 'react';
import Header from '../../../../../../components/generalHeader';
import { etherscanBlockExplorers } from 'wagmi';


const currencyCheck = (currency) => {
   if ( currency === "0x0000000000000000000000000000000000000000") {
      return "ETH"
   }  else if ( currency.toLowerCase() === "0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eb48") {
      return "USDC"
   }  else {
      return "NON INDEXED CURRENCY"
   }
}

const shortenedAddress = (address) => {
   let displayAddress = address?.substr(0,4) + "..." + address?.substr(-4)
   return displayAddress
}

const copySuccess = () => {
   alert("SHARE LINK COPIED TO CLIPBOARD")
   return
}

const SharePage = () => {
   const router = useRouter(); 
   const { user, contract_address, token_id, fill_currency, fill_amount } = router.query;    
   
   const shareableLink = "https://finders-fee-finder.vercel.app/share/" + `${user}/` + `${contract_address}/` + `${token_id}/` + `${fill_currency}/` + `${fill_amount}`
   console.log(shareableLink)
   
   
   const { data: userAddress, isError: accountError, isLoading: accountLoading } = useAccount({
      onError(error) {
         console.log("error", error)
      }   
   })
   const userAddressCheck = userAddress?.data?.address || "";
   const nftAddress = contract_address;
   const nftId = token_id
   const fillCurrency = fill_currency
   const test = 10
/*    const fillAmountString = fill_amount?.toString() || ''; */
   // const fillAmountParsed = ethers.utils.parseEther(fillAmountString)
   // const fillAmountParsed = 600;

   const finderAddress = user;

   // zora askV1_1 approval read - reruns if user changes wallets

   // taken out atm as live site filters out non ETH priced assets
   // user doesn't need to approve transfer helpers or ZORA modules if purchasing with just ETH
   // source: https://docs.zora.co/docs/guides/v3-approvals

   // const { data: approvalReadData, isError: approvalReadError, isLoading: approvalReadLoading, refetch } = useContractRead(
   //    {
   //       addressOrName: mainnetZoraAddresses.ZoraModuleManager,
   //       contractInterface: ZoraModuleManager__factory.abi
   //    },
   //    "isModuleApproved",
   //    {
   //       args: [
   //          user, // might need to change this line as its causing build issues: if no user address (no one logged in) then this errors out?
   //          mainnetZoraAddresses.AsksV1_1
   //       ],
   //       onError(error) {
   //          console.log("error", error)
   //       },
   //       onSuccess(data) {
   //          console.log("read success", data)
   //       },
   //    },   
   // )

/*    useEffect(() => {
      if (userAddress) {
         refetch({
            throwOnError: false,
            cancelRefetch: false
         })
         console.log("ran refetch")
      }
   },
   [userAddress]) */

   // zora askV1_1 approval write call - will show up is user hasn't approved module befoer
   const { data: approvalWriteData, isError: approvalWriteError, isLoading: approvalWriteLoading, write: approvalWrite } = useContractWrite(
      {
         addressOrName: mainnetZoraAddresses.ZoraModuleManager,
         contractInterface: ZoraModuleManager__factory.abi
      },
      "setApprovalForModule",
      {
         args: [
            mainnetZoraAddresses.AsksV1_1,
            true
         ],
         onError(error) {
            console.log("error", error)
         }
      }
   )


   // zora asksV1_1 fillAsk write call 
   const { data: fillWriteData, isError: fillWriteError, isLoading: fillWriteLoading, write: fillWrite } = useContractWrite(
      {
         addressOrName: mainnetZoraAddresses.AsksV1_1,
         contractInterface: AsksV11__factory.abi
      },
      "fillAsk",
      {
         args: [
            nftAddress,
            nftId,
            fillCurrency,
            BigNumber.from(ethers.utils.parseEther(test.toString())).toString(),
            finderAddress,
         ],
         overrides: {
            value: BigNumber.from(ethers.utils.parseEther(test.toString())).toString()
         }
      }
   )

   return (
      <div className="py-8">    
         <div className=" fixed top-3 right-3">
            <ConnectButton accountStatus="address"  />
         </div>
         <Header />  
         <div className='flex flex-row justify-center'>
            <MediaConfiguration // link to style docs: https://ourzora.github.io/nft-components/?path=/docs/renderer-mediaconfiguration--page
               strings={{
                  CARD_OWNED_BY: "",
                  CREATED: "",
                  COLLECTED: "",
                  CARD_CREATED_BY: "",
                  CREATOR: "",
                  OWNER: ""
               }}
               
               style={{                
                  theme: { 
                     previewCard: { background: "black" }, 
                     linkColor: "color: transparent", 
                     titleFont: "color: transparent",
                     bodyFont: "color: trasnparent",  
                     audioColors: { waveformColor: "white", progressColor: "#c3f53b"},
                     useZoraUsernameResolution: "false",
                     borderStyle: "4px white solid",
                     defaultBorderRadius: "0px",
                     spacingUnit: "0",
                     textBlockPadding: "0",
                     placeHolderColor: "black",
                     lineSpacing: "0"                                
                  } 
               }}
            >
               <a href={`${etherscanBlockExplorers.mainnet.url}` + `/nft` + `/${contract_address}` + `/${token_id}` }>            
                  <NFTPreview
                     useBetaIndexer="true"
                     contract={contract_address}
                     id={token_id}
                     showBids={false}
                     showPerpetual={false}
                  />
               </a>
            </MediaConfiguration>   
         </div>
         <div className="flex flex-row flex-wrap justify-center">

            {/*      logic for adding in a check to see if 
                     user has approved zora transfer helpers/modules
               
            { approvalReadData == false ? (
               <div className='grid grid-cols-1 grid-rows-2'>
                  <button className='bg-blue-500 w-20 ' onClick={() => approvalWrite()}>
                     APPROVE
                  </button>
                  <button className=" mt-2 flex flex-row justify-start bg-slate-500 w-60" disabled="true" >
                     PURCHASE DISABLED
                  </button>
               </div>
            ) :  */}

            <div className=" w-full mt-2 flex flex-row flex-wrap justify-center">
               <button
                  className="w-fit sm:text-lg relative flex flex-row items-center justify-center p-2 bg-black border-4 border-solid border-white hover:bg-[#c3f53b] hover:text-black" 
                  onClick={() => fillWrite()}
               >
                  {"PURCHASE FOR " + `${fill_amount}` + " " + currencyCheck(fill_currency ? fill_currency : "")}
               </button>
            </div>
            <div className=" w-full mt-4 flex flex-row flex-wrap justify-center">
               <button
                  className="w-fit sm:text-lg relative flex flex-row items-center justify-center p-2 bg-black border-4 border-solid border-white hover:bg-[#c3f53b] hover:text-black" 
                  onClick={() => {
                     navigator.clipboard.writeText(shareableLink)
                     copySuccess() 
                  }}
               >
                  GENERATE SHARE LINK
               </button>
            </div>                  
            <div className=" mt-4 p-2 w-full flex flex-row items-center justify-center">
               {"C U R A T E D __ B Y"} 
            </div>
            <div className="  p-2 w-full flex flex-row items-center justify-center">
               <a                   
                  href={`${etherscanBlockExplorers.mainnet.url}` + `/address/` + `${user}` }
               >
                  {"" + shortenedAddress(user)} 
               </a>
            </div>        
         </div>
      </div>
   )
}

export default SharePage