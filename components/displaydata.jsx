import { useState, useEffect } from "react";
import { useNFT, useNFTMetadata } from "@zoralabs/nft-hooks"
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components"
import { Popover } from "@headlessui/react"
import Link from 'next/link';
import { useAccount, useEnsName, etherscanBlockExplorers } from "wagmi";
import ReactPaginate from "react-paginate";
import MoreInfo from "./moreInfo";


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
      const shortenNumber = number.toFixed(2)
      return shortenNumber
   } else {
      return number
   }
}

const shortenedAddress = (address) => {
   let displayAddress = address?.substr(0,4) + "..." + address?.substr(-4)
   return displayAddress
}

// wrapper function for paginated items
const DisplayData = ( {asks, asksPerPage} ) => {
   // We start with an empty list of items.
   const [currentAsks, setCurrentAsks] = useState(null);
   const [pageCount, setPageCount] = useState(0);
   // Here we use item offsets; we could also use page offsets
   // following the API or data you're working with.
   const [askOffset, setAskOffset] = useState(0);
   useEffect(() => {
      // check if asks exist
      if (asks && asks.length > 0){
         // Fetch items from another resources.
         const endOffset = askOffset + asksPerPage;
         setCurrentAsks(asks.slice(askOffset, endOffset));
         setPageCount(Math.ceil(asks.length / asksPerPage));
      }
   }, [asks, askOffset, asksPerPage]);
   // check if asks exist
   if (asks && asks.length > 0){
      // Invoke when user click to request another page.
      const handlePageClick = (event) => {
         const newOffset = (event.selected * asksPerPage) % asks.length;
         setAskOffset(newOffset);
      };
      return (
      <>
         <Items asks={currentAsks} />
         <ReactPaginate
            breakLabel="..."
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={"PREV"}
            nextLabel={"NEXT"}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
         />
      </>
      );
   }else{
      return (
         <div className="text-4xl">
               { "::: NO RESULTS :::" }
            </div>
      )
   }
 }

const Items = ({ asks }) => {

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
                              defaultBorderRadius: "0px",
                              spacingUnit: "0",
                              textBlockPadding: "0",
                              placeHolderColor: "black",
                              lineSpacing: "0"                              
                           } 
                        }}
                     >
                        <a href={`${etherscanBlockExplorers.mainnet.url}` + `/nft` + `/${ask.tokenContract}` + `/${ask.tokenId}` }>
                           <NFTPreview
                              useBetaIndexer="true"
                              contract={ask.tokenContract.toString()}
                              id={ask.tokenId.toString()}
                              showBids={false}
                              showPerpetual={false}
                           />
                        </a>
                     </MediaConfiguration>                     
                     <div className="grid grid-cols-1 grid-rows-2 gap-2 ">                                          
                        <div className="w-9/12 m-0 row-span-1 col-span-1 text-[#c3f53b] flex flex-row place-content-between justify-self-center items-center text-xl ">
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
                        <MoreInfo nftInfo={ask} />
                        { accountLoading || accountError || account == null ? (             
                           <button
                              disabled="true"
                              className="flex flex-row items-center justify-center justify-self-center w-9/12 text-slate-600 py-1 px-2 border-4 border-solid border-slate-600"
                           >
                              CONNECT WALLET TO SHARE
                           </button>
                        
                        ) : (
                        <Link
                           href={`/share/${account.address}/${ask.seller}/${ask.tokenContract}/${ask.tokenId}/${ask.askCurrency}/${ask.simpleETH}`}
                        >               
                           <button 
                              className="flex flex-row items-center justify-center justify-self-center w-9/12 text-white py-1 px-2 border-4 border-solid border-white hover:bg-[#c3f53b] hover:text-black"
                           >
                              SHARE
                           </button>
                        </Link>
                        )}                                                                                                                                                              
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
      {""}
   </div>
)
export default DisplayData
 