const DisplayData = ({ asks }) => {

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
               <div key={ask.id} className="dataheader" style={{ width: "75%", marginTop: '10px', color: 'black'}}>  
                  <div className="bountyHeaderAndDataWrapper">
                     <div className="askInfoBlobsCleaned">
                        <div className="dataFields">
                           <div className="dataFieldsIndividuals" >CURRENCY</div>
                           <div className="dataFieldsIndividuals" >PRICE</div>
                           <div className="dataFieldsIndividuals" >SELLER</div>
                           <div className="dataFieldsIndividuals" >NFT CONTRACT</div>
                           <div className="dataFieldsIndividuals" >NFT ID</div>
                           <div style={{ backgroundColor: "yellow"}}className="dataFieldsIndividuals"><b>FINDER'S FEE</b></div>                        
                        </div>
                        <div className="dataValues">                        
                           <div className="dataValuesIndividuals" > {"" + ask.askCurrency}</div>
                           <div className="dataValuesIndividuals"> {"" + ask.simpleETH+ " ETH"}</div>
                           <div className="dataValuesIndividuals"> {"" + ask.seller}</div>
                           <div className="dataValuesIndividuals"> {"" + ask.tokenContract}</div>               
                           <div className="dataValuesIndividuals"> {"" + ask.tokenId}</div>
                           <div style={{ backgroundColor: "yellow"}} className="dataValuesIndividuals"><b>{"" + ask.totalBounty + " ETH"}</b></div>                                                                          
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