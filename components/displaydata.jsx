import { useNFT, useNFTMetadata } from "@zoralabs/nft-hooks"
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components"
import { Popover } from "@headlessui/react"
import Link from 'next/link';
import { useAccount } from "wagmi";


const currencyCheck = (currency) => {
   if ( currency === "0x0000000000000000000000000000000000000000") {
      return "ETH"
   }  else if ( currency.toLowerCase() === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
      return "USDC"
   }  else if ( currency.toLowerCase() === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
      return "WETH"
   }  else {
      return "NON INDEXED CURRENCY"
   }
}

const truncateNumber = (number) => {
   const stringNumber = number.toString()
   if ( stringNumber.length > 6) {
      const shortenNumber = number.toFixed(4)
      return shortenNumber
   } else {
      return number
   }
}

function MyPopover({ nftInfo }) {
   return (
      <Popover className="relative mb-2 flex flex-row justify-center">
         <Popover.Button
            className="text-[#c3f53b] py-1 px-2 border-2 border-solid border-[#c3f53b] hover:bg-[#c3f53b] hover:text-black"
         >
            MORE INFO
         </Popover.Button>
         <Popover.Panel className="absolute z-10">
            <div className="askInfoBlobsCleaned">
               <div className="dataFields">
                  <div className="dataFieldsIndividuals" >CURRENCY</div>
                  <div className="dataFieldsIndividuals" >PRICE</div>
                  <div className="dataFieldsIndividuals" >SELLER</div>
                  <div className="dataFieldsIndividuals" >NFT CONTRACT</div>
                  <div className="dataFieldsIndividuals" >NFT ID</div>
                  <div className="dataFieldsIndividuals">FINDER'S FEE</div>                        
               </div>
               <div className="dataValues">                        
                  <div className="dataValuesIndividuals" > {"" + currencyCheck(nftInfo.askCurrency)}</div>
                  <div className="dataValuesIndividuals"> {"" + nftInfo.simpleETH + " " + currencyCheck(nftInfo.askCurrency)}</div>
                  <div className="dataValuesIndividuals"> {"" + nftInfo.seller}</div>
                  <div className="dataValuesIndividuals"> {"" + nftInfo.tokenContract}</div>               
                  <div className="dataValuesIndividuals"> {"" + nftInfo.tokenId}</div>
                  <div className="dataValuesIndividuals">{"" + nftInfo.totalBounty + " " + currencyCheck(nftInfo.askCurrency)}</div>                                                                          
               </div>                                                                                                     
            </div>
         </Popover.Panel>
      </Popover>
   )
} 

const DisplayData = ({ asks }) => {

   const { data: account, isError: accountError, isLoading: accountLoading } = useAccount(); 

   return (
      <>
         {
            asks && asks.length > 0
            ? 
            asks.map((ask, index) => {
               return (                               
               
               <div key={ask.id} className="dataheader">                 
                  <div className="bountyHeaderAndDataWrapper">
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
                           contract={ask.tokenContract.toString()}
                           id={ask.tokenId.toString()}
                           showBids={false}
                           showPerpetual={false}
                        />
                     </MediaConfiguration>
                     <div className="grid grid-cols-1 grid-rows-3 gap-5 ">                     
                        <div className=" row-span-1 col-span-1 text-[#c3f53b]  p-1 flex flex-row justify-center text-xl">
                           {"FINDER'S FEE : " + truncateNumber(ask.totalBounty) + " ETH"}
                        </div>

                        { accountLoading || accountError || account == null ? (             
                           <button
                              disabled="true"
                              className="flex flex-row items-center justify-self-center w-fit text-slate-600 py-1 px-2 border-2 border-solid border-slate-600"
                           >
                              CONNECT WALLET TO SHARE
                           </button>
                        
                        ) : (
                        <Link
                           href={`/share/${account.address}/${ask.tokenContract}/${ask.tokenId}/${ask.askCurrency}/${ask.simpleETH}`}
                        >               
                           <button 
                              className="flex flex-row items-center justify-self-center w-fit text-[#c3f53b] py-1 px-2 border-2 border-solid border-[#c3f53b] hover:bg-[#c3f53b] hover:text-black"
                           >
                              SHARE
                           </button>
                        </Link>
                        )}                        
                        <MyPopover className="row-span-3 col-span-1" nftInfo={ask} />
                     </div>
                  </div>
               </div>)
            }): 
            <div className="text-4xl">
               NO RESULTS 😑
            </div>
         }   
      </>
   ) 
}

export const LoadingData = () => (
   <div className="mt-5">
      Loading Data . . .
   </div>
)
export default DisplayData
 