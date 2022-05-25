import { useNFT, useNFTMetadata } from "@zoralabs/nft-hooks"
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components"
import { Popover } from "@headlessui/react"
import Link from 'next/link';

const currencyCheck = (currency) => {
   if ( currency === "0x0000000000000000000000000000000000000000") {
      return "ETH"
   }  else if ( currency === "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48") {
      return "USDC"
   }  else {
      return "NON INDEXED CURRENCY"
   }
}

const truncateNumber = (number) => {
   const stringNumber = number.toString()
   console.log("what stringnumber is getting passed: ", stringNumber)
   if ( stringNumber.length > 6) {
      const shortenNumber = number.toFixed(4)
      console.log("checking shortened number: ", shortenNumber)
      return shortenNumber
   } else {
      return number
   }
}

function MyPopover({ nftInfo }) {
   return (
      <Popover className="relative mb-2 flex flex-row justify-center">
         <Popover.Button
            className="text-[#7f7f7f] p-1 border-2 border-solid border-[#7f7f7f]"
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
            <Link href={`/share/cap`}>
               <a>SHARE</a>
            </Link>
         </Popover.Panel>
      </Popover>
   )
} 


/* const MyNFT = (nft) => {
   const { data, error } = useNFT(
      nft.tokenContract,
      nft.tokenId
      
   )
   console.log("whats the data: ", data )
   const { metadata } = useNFTMetadata(
      data && data.metadataURI
   )
   console.log("whats the metadata: ", metadata )
   console.log("whats {data, error, metadata}: ", data + " " + error + " " + metadata)
   return {data, error, metadata}
} */


const DisplayData = ({ asks }) => {

   return (
      <>
         {
            asks 
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
                     <div className="text-[#c3f53b] p-1 mb-2 flex flex-row justify-center text-xl">
                        {"FINDER'S FEE : " + truncateNumber(ask.totalBounty) + " ETH"}
                     </div>
                     <MyPopover nftInfo={ask} />                        
                  </div>
               </div>)
            }): null
         }   
      </>
   ) 
}

export const LoadingData = () => (
   <div>
      Loading . . .
   </div>
)
export default DisplayData

export async function getServerSideProps() {
   // zNFT id to render
   const id = "3158";
   // Create the fetcher object
   const fetcher = new MediaFetchAgent(Networks.MAINNET);
   // Fetch the NFT information on the server-side
   const nft = await fetcher.loadNFTData(id);
   const metadata = await fetcher.fetchIPFSMetadata(nft.nft.metadataURI);
 
   // Function required to remove `undefined` from JSON passed to client.
   function prepareJson(json) {
     return JSON.parse(JSON.stringify(json));
   }
 
   return {
     props: prepareJson({
       nft: nft,
       metadata,
       id,
     })
   };
 }
 