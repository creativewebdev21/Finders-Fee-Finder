import { ethers } from "ethers"

const DisplayData = ({ asks }) => {
/*    console.log("asks = ", asks[0]) */
/*    console.log("index = ". asks[index]) */

const commonCurrencies = {
   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "USDC",
   "0x0000000000000000000000000000000000000000": "ETH"
}

   return (
      <>
         {
            asks 
            ? 
            asks.map((ask, index) => {
               return ( 
               <div className="dataheader" style={{ width: "75%", marginTop: '10px', color: 'black'}}>  
                  <div className="bountyHeaderAndDataWrapper">
   {/*                   <div className="askInfoBlobs">
                        {"full json blob" + JSON.stringify(ask, null, 3)}                     
                     </div> */}
                     <div className="askInfoBlobsCleaned">
                        <div className="dataFields">
                           <div className="dataFieldsIndividuals" >CURRENCY</div>
                           <div className="dataFieldsIndividuals" >PRICE</div>
{/*                            <div className="dataFieldsIndividuals" >FINDER'S FEE</div> */}
                           <div className="dataFieldsIndividuals" >SELLER</div>
                           <div className="dataFieldsIndividuals" >NFT CONTRACT</div>
                           <div className="dataFieldsIndividuals" >NFT ID</div>
                           <div style={{ backgroundColor: "yellow"}}className="dataFieldsIndividuals"><b>FINDER'S FEE</b></div>                        
                        </div>
                        <div className="dataValues">                        
                           <div className="dataValuesIndividuals" > {"" + asks[index].askCurrency}</div>
                           <div className="dataValuesIndividuals"> {"" + ethers.utils.formatUnits((asks[index].askPrice), "ether") + " ETH"}</div>
{/*                            <div className="dataValuesIndividuals"> {"" + (asks[index].findersFeeBps / 100) + "%"}</div> */}
                           <div className="dataValuesIndividuals"> {"" + asks[index].seller}</div>
                           <div className="dataValuesIndividuals"> {"" + asks[index].tokenContract}</div>               
                           <div className="dataValuesIndividuals"> {"" + asks[index].tokenId}</div>
                           <div style={{ backgroundColor: "yellow"}} className="dataValuesIndividuals"><b>{"" + ethers.utils.formatUnits((asks[index].askPrice * (asks[index].findersFeeBps / 1000 )).toString(), "ether") + " ETH"}</b></div>                                                                          
                        </div>                                                                                                     
                     </div>
                  </div>
               </div>)
            }): null
         }   
      </>
   ) 
}

export const ShitData = () => (
   <div>
      Loading 
   </div>
)

export default DisplayData