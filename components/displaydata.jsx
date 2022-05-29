import { useNFT, useNFTMetadata } from "@zoralabs/nft-hooks"
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components"
import { Popover } from "@headlessui/react"
import Link from 'next/link';
import { useAccount, useEnsName, etherscanBlockExplorers } from "wagmi";


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

/* const addressResolver = (addressBro) => {
   const { data: ensData, isError: ensError, isLoading: ensLoading, isSuccess: ensSuccess } = useEnsName({
      address: addressBro,
      onSuccess(ensData) {
         console.log("Success", ensData)
         return ensData
      },
      onError(error) {
         console.log('Error', error)
         return error
      }
   }) 
}   */

const shortenedAddress = (address) => {
   let displayAddress = address?.substr(0,4) + "..." + address?.substr(-4)
   return displayAddress
}

function MyPopover({ nftInfo }) {
   return (
      <Popover className="relative mb-2 flex flex-row justify-center">
         <Popover.Button
            className="text-white w-9/12 justify-center justify-self-center py-1 px-2 border-4 border-solid border-white hover:bg-[#c3f53b] hover:text-black"
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
   console.log("etherscan check:", etherscanBlockExplorers.mainnet.url)
   console.log("etherscan addy link check:", etherscanBlockExplorers.mainnet.url + "/address/" + "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8")

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
                              spacingUnit: "0",
                              textBlockPadding: "0",
                              placeHolderColor: "black",
                              lineSpacing: "0"                              
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
                     <div className="grid grid-cols-1 grid-rows-2 gap-2 ">                                          
                        <div className="w-9/12  m-0 row-span-1 col-span-1 text-[#c3f53b] flex flex-row place-content-between justify-self-center items-center text-xl ">
                           <div className=" text-white px-1 flex flex-row justify-self-center justify-center">
                              {"LIST PRICE"}                           
                           </div>                                                      
                           <div className=" bg-white text-black px-2 py-1 flex flex-row justify-self-end justify-end justify-items-end">
                              {truncateNumber(ask.simpleETH) + " ETH"}                           
                           </div>                           
                           
                        </div>
                        <div className=" w-9/12  m-0 row-span-1 col-span-1 text-[#c3f53b] flex flex-row place-content-between justify-self-center items-center text-xl ">                                          
                           <div className=" text-white px-1 flex flex-row justify-self-center justify-center">
                              OWNER
                           </div>
                           <div className=" bg-white text-black px-2 py-1 flex flex-row justify-self-end justify-end justify-items-end">
                              <a 
                                 style={{ color: "black" }}
                                 href={`${etherscanBlockExplorers.mainnet.url}` + `/address/` + `${ask.seller}` }
                              >
                                 {"" + shortenedAddress(ask.seller)}
                              </a>
                           </div>                 
                        </div>               
                        <div className=" w-9/12  m-0  row-span-1 col-span-1 text-[#c3f53b] flex flex-row place-content-between justify-self-center items-center text-xl ">
                           <div className="text-white px-1 flex flex-row justify-self-center justify-center">
                              FINDER'S FEE
                           </div>
                           <div className=" bg-white text-black px-2 py-1 flex flex-row justify-self-end justify-end justify-items-end">
                              {truncateNumber(ask.totalBounty) + " ETH"}   
                           </div>
                        
                           
                        </div>
                        { accountLoading || accountError || account == null ? (             
                           <button
                              disabled="true"
                              className="flex flex-row items-center justify-center justify-self-center w-9/12 text-slate-600 py-1 px-2 border-4 border-solid border-slate-600"
                           >
                              CONNECT WALLET TO SHARE
                           </button>
                        
                        ) : (
                        <Link
                           href={`/share/${account.address}/${ask.tokenContract}/${ask.tokenId}/${ask.askCurrency}/${ask.simpleETH}`}
                        >               
                           <button 
                              className="flex flex-row items-center justify-center justify-self-center w-9/12 text-white py-1 px-2 border-4 border-solid border-white hover:bg-[#c3f53b] hover:text-black"
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
               { "::: NO RESULTS :::" }
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
 