import { useRouter } from 'next/router'
import { NFTPreview, MediaConfiguration } from '@zoralabs/nft-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import Link from 'next/link';
import { ethers, BigNumber } from 'ethers';
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json";
import { ZoraModuleManager__factory } from "@zoralabs/v3/dist/typechain/factories/ZoraModuleManager__factory";
import { AsksV11__factory } from "@zoralabs/v3/dist/typechain/factories/AsksV11__factory";


const currencyCheck = (currency) => {
   if ( currency === "0x0000000000000000000000000000000000000000") {
      return "ETH"
   }  else if ( currency.toLowerCase() === "0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eb48") {
      return "USDC"
   }  else {
      return "NON INDEXED CURRENCY"
   }
}

const SharePage = () => {
   const router = useRouter(); 
   const { user, contract_address, token_id, fill_currency, fill_amount } = router.query;    
   const userAddress = useAccount()
   const nftAddress = contract_address;
   const nftId = token_id
   const fillCurrency = fill_currency
   const fillAmountString = fill_amount.toString()
   const fillAmountParsed = ethers.utils.parseEther(fillAmountString)
   const finderAddress = user;


   // zora askV1_1 approval read - reruns if user changes wallets
   const { data: approvalReadData, isError: approvalReadError, isLoading: approvalReadLoading } = useContractRead(
      {
         addressOrName: mainnetZoraAddresses.ZoraModuleManager,
         contractInterface: ZoraModuleManager__factory.abi
      },
      "isModuleApproved",
      {
         args: [
            userAddress.data.address, // might need to change this line as its causing build issues: if no user address (no one logged in) then this errors out?
            mainnetZoraAddresses.AsksV1_1
         ],
         onError(error) {
            console.log("error", error)
         },
         onSuccess(data) {
            console.log("success", data)
         }
      }
   )

   // zora askV1_1 approval call - will show up is user hasn't approved module befoer
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
            BigNumber.from(fillAmountParsed).toString(),
            finderAddress,
         ],
         overrides: {
            value: BigNumber.from(fillAmountParsed).toString()
         }
      }
   )


   return (
      <div>
         <div className=" fixed top-3 right-3">
            <ConnectButton accountStatus="address"  />
         </div>
         <div className='flex flex-row justify-center'>
            <MediaConfiguration // link to style docs: https://ourzora.github.io/nft-components/?path=/docs/renderer-mediaconfiguration--page
               strings={{
                  CARD_OWNED_BY: "OWNER: ",
                  CREATED: "",
                  COLLECTED: "",
                  CARD_CREATED_BY: "CREATOR: ",
                  OWNER: ""
               }}
               
               style={{                
                  theme: { 
                     previewCard: { background: "black" }, 
                     linkColor: "#c3f53b", 
                     titleFont: "color: #c3f53b",
                     bodyFont: "color: white",  
                     audioColors: { waveformColor: "white", progressColor: "#c3f53b"},
                     useZoraUsernameResolution: "false",
                     borderStyle: "4px purple solid",
                     spacingUnit: "5px",
                     textBlockPadding: "10px",
                     placeHolderColor: "black",
                     lineSpacing: "25"                              
                  } 
               }}
            >            
               <NFTPreview
                  useBetaIndexer="true"
                  contract={contract_address}
                  id={token_id}
                  showBids={false}
                  showPerpetual={false}
               />
            </MediaConfiguration>   
         </div>
         <div className="grid grid-cols-1 grid-rows-6 ">
            { approvalReadData == false ? (
               <div className='grid grid-cols-1 grid-rows-2'>
                  <button className='bg-blue-500 w-20 ' onClick={() => approvalWrite()}>
                     APPROVE
                  </button>
                  <button className=" mt-2 flex flex-row justify-start bg-slate-500 w-60" disabled="true" >
                     PURCHASE DISABLED
                  </button>
               </div>
            ) : 
               <div>
                  <div>
                     Approvals complete
                  </div>
                  <button className="bg-green-800" onClick={() => fillWrite()}>
                     PURCHASE
                  </button>
               </div>
            }
{/*             <button className='mt-5 bg-red-500 w-20 ' onClick={callFillAsk}>
               PURCHASE
            </button> */}
            
            <div>
            {`finder address : ${user}`}
            </div>
            <div>
            {`nft contract address : ${contract_address}`}
            </div>
            <div>
            {`nft token id : ${token_id}`}
            </div>
            <div>
            {`fill currency : ${fill_currency}`}
            </div>
            <div>
            {`fill amount : ${fill_amount}` + " " + currencyCheck(fill_currency) }
            </div>
         </div>
         <div>
            <Link href="/">
               <a>← Back to home</a>      
            </Link>
         </div>
      </div>
   )
}

export default SharePage