import { Popover } from "@headlessui/react"

export default function TokenLookup(inputContract, inputTokenId, advancedFilterCB, setTokenCB, setContractCB) {
      console.log("input Contract", inputContract)
      console.log("input tokenId", inputTokenId)

   return (
      <Popover>
         <Popover.Panel>
            <div className="border-white border-2 border-solid max-w-xs my-2 overflow-hidden rounded-none shadow-lg">
               <div className="px-6 py-4">
                  <div className=" mb-2 text-xl font-bold">ADVANCED SEARCH</div>
                  <div className="flex flex-col"> 
                     <label className="mb-2 italic">CONTRACT ADDRESS</label>
                     <input
                        className="text-black mb-4 border-b-2"
                        name="contractAddress"
                        type="text"      
                        value={inputContract}                    
                        onChange={(e) => {
                           e.preventDefault(); 
                           setContractCB( e.target.value);
                        }}
                        required
                     /> 
                     <label  className="mb-2 italic">TOKEN ID</label>
                     <input
                        className="text-black mb-4 border-b-2"
                        name="tokenId"
                        type="text"      
                        value={inputTokenId}                      
                        onChange={(e) => {
                           e.preventDefault(); 
                           setTokenCB(e.target.value);                           
                        }}
                        required                          
                     />                
                     <button
                        disabled={inputTokenId !== "" && inputContract !== "" ? false : true}
                        className=" px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-2 hover:bg-purple-700 disabled:bg-black disabled:text-slate-800 disabled:border-slate-800 " 
                        onClick={advancedFilterCB}
                     >
                        Submit
                     </button>
                     <button
                        disabled={inputTokenId !== "" && inputContract !== "" ? false : true}
                        className="mt-5 px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-2 hover:bg-purple-700 disabled:bg-black disabled:text-slate-800 disabled:border-slate-800" 
                        onClick={() => {
                        fetchData()
                        setTokenCB("")
                        setContractCB("")                          
                        }}
                     >
                        CLEAR SEARCH
                     </button>
                  </div>
               </div>
            </div>
         </Popover.Panel>
         <Popover.Button className="sm:text-lg relative mt-1 mx-1 flex flex-row justify-self-center p-2 bg-black border-2 border-solid border-white hover:bg-[#c3f53b] hover:text-black ">
         ADVANCED SEARCH
         </Popover.Button>
      </Popover>
   )
}