import { Fragment, useState } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import { etherscanBlockExplorers } from 'wagmi';

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

const shortenedAddress = (address) => {
   let displayAddress = address?.substr(0,4) + "..." + address?.substr(-4)
   return displayAddress
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

export default function MoreInfo({ nftInfo }) {
   let [isOpen, setIsOpen] = useState(false)

   function closeModal() {
   setIsOpen(false)
   }

   function openModal() {
   setIsOpen(true)
   }

   return (
      <>
         <button
            type="button"
            onClick={openModal}
            className="text-white w-9/12 justify-center justify-self-center py-1 px-2 border-4 border-solid border-white hover:bg-[#c3f53b] hover:text-black"
         >
            MORE INFO
         </button>
         <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
               </Transition.Child>

               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                     <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                     <Dialog.Panel className="transform overflow-hidden bg-black align-middletransition-all shadow-[0_0px_30px_10px_rgba(0,0,0,1)]" >
                        <div className="p-4 flex flex-row flex-wrap border-white border-4 border-solid  my-2 overflow-hidden rounded-none shadow-lg">                        
                              <div className="pb-4 w-full flex flex-row justify-center items-center text-xl font-bold">MORE INFO</div>                    
                              <div className="pb-5 w-full flex flex-row justify-center">
                                 <div className="w-fit flex flex-col border-2 border-solid border-white ">
                                    <div className="p-1 border-b-2 border-solid border-white" >CURRENCY</div>
                                    <div className="p-1 border-b-2 border-solid border-white" >LIST PRICE</div>
                                    <div className="p-1 border-b-2 border-solid border-white" >OWNER</div>
                                    <div className="p-1 border-b-2 border-solid border-white" >NFT CONTRACT</div>
                                    <div className="p-1 border-b-2 border-solid border-white" >NFT ID</div>
                                    <div className="p-1 border-white">FINDER'S FEE</div>                        
                                 </div>
                                 <div className="flex flex-col border-r-2 border-b-2 border-t-2 border-solid border-white ">                        
                                    <div className="p-1 border-b-2 border-solid border-white" > {"" + currencyCheck(nftInfo.askCurrency)}</div>
                                    <div className="p-1 border-b-2 border-solid border-white"> {"" + nftInfo.simpleETH + " " + currencyCheck(nftInfo.askCurrency)}</div>
                                    <a                                        
                                       href={`${etherscanBlockExplorers.mainnet.url}` + `/address/` + `${nftInfo.seller}` }
                                    >
                                       <div className="p-1 border-b-2 border-solid border-white"> {"" + shortenedAddress(nftInfo.seller)}</div>
                                    </a>
                                    <a                                        
                                       href={`${etherscanBlockExplorers.mainnet.url}` + `/token/` + `${nftInfo.tokenContract}` }
                                    >
                                       <div className="p-1 border-b-2 border-solid border-white"> {"" + shortenedAddress(nftInfo.tokenContract)}</div>               
                                    </a>
                                    <a href={`${etherscanBlockExplorers.mainnet.url}` + `/nft` + `/${nftInfo.tokenContract}` + `/${nftInfo.tokenId}` }>
                                       <div className="p-1 border-b-2 border-solid border-white"> {"" + nftInfo.tokenId}</div>
                                    </a>   
                                    <div className="p-1">{"" + truncateNumber(nftInfo.totalBounty) + " " + currencyCheck(nftInfo.askCurrency)}</div>                                                                          
                                 </div>                                                                                                     
                              </div>                                                                   
                              <div className="w-full flex flex-col items-center">    
                                 <button                                    
                                    className=" w-fit px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-4 hover:bg-[#c3f53b] hover:text-black disabled:bg-black disabled:text-slate-800 disabled:border-slate-800 " 
                                    onClick={closeModal}
                                 >
                                    CLOSE
                                 </button>
                              </div>
                        </div>
                     </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   )
}