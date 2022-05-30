import { Fragment, useState } from 'react'
import { Dialog, Transition } from "@headlessui/react";

export default function TokenLookup({ inputContract, inputTokenId, advancedFilterCB, setTokenCB, setContractCB, fetchDataCB }) {
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
            className="w-full sm:text-lg relative mt-1 flex flex-row p-2 pl-3 bg-black border-2 border-solid border-white hover:bg-[#c3f53b] hover:text-black"
         >
            ADVANCED SEARCH
         </button>
         <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
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
                     <Dialog.Panel className="w-fit transform overflow-hidden bg-black align-middletransition-all shadow-[0_0px_30px_10px_rgba(0,0,0,1)]" >
                        <div className="border-white border-4 border-solid max-w-xs my-2 overflow-hidden rounded-none shadow-lg">
                           <div className="px-6 py-4">
                              <div className=" mb-2 text-xl font-bold">ADVANCED SEARCH</div>                    
                              <div className="flex flex-col"> 
                                 <label className="mb-2">CONTRACT ADDRESS</label>
                                 <input
                                    className="text-white bg-black mb-4 border-4 px-2 py-1 border-solid border-white"
                                    placeholder='Ex: 0xa874...'
                                    name="inputContract"
                                    type="text"      
                                    value={inputContract}                    
                                    onChange={(e) => {
                                       e.preventDefault(); 
                                       setContractCB( e.target.value);
                                    }}
                                    required
                                 /> 
                                 <label  className="mb-2">TOKEN ID</label>
                                 <input
                                    className="text-white bg-black mb-4 px-2 py-1 border-4 border-solid border-white"
                                    placeholder="Ex: 927"
                                    name="inputTokenId"
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
                                    className=" px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-4 hover:bg-[#c3f53b] hover:text-black disabled:bg-black disabled:text-slate-800 disabled:border-slate-800 " 
                                    onClick={() => {
                                       advancedFilterCB()
                                       closeModal()
                                    }}
                                    >
                                    SUBMIT
                                    </button>
                                 <button
                                    disabled={inputTokenId !== "" && inputContract !== "" ? false : true}
                                    className="mt-5 px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-4 hover:bg-[#c3f53b] hover:text-black disabled:bg-black disabled:text-slate-800 disabled:border-slate-800" 
                                    onClick={() => {
                                    fetchDataCB()
                                    setTokenCB("")
                                    setContractCB("")
                                    closeModal()                          
                                    }}
                                 >
                                    CLEAR SEARCH
                                 </button>
                              </div>
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