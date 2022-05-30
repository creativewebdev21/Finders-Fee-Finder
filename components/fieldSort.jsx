import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useAppContext } from '../context/appContext';

  const sortOptions = [
/*     { name: 'CURRENCY', queryValue: 'askCurrency' }, */
    { name: 'PRICE', queryValue: 'simpleETH' },
    { name: 'OWNER', queryValue: 'seller' },
/*     { name: 'NFT CONTRACT', queryValue: 'tokenContract' },
    { name: 'NFT ID', queryValue: 'tokenId' }, */
    { name: "FINDER'S FEE", queryValue: 'totalBounty' }
  ]

  export default function Dropdown() {
    const { sortFilter, setsortFilter } = useAppContext()
    console.log()
    
    const select = (arg) => {
      setsortFilter(arg);
      // console.log("logging sort arg: ", arg)
    }
    
    return (
      <div className="text-white z-10">
        <Listbox value={sortFilter} onChange={select}>
          <div className="relative mt-1">
            <Listbox.Button className="hover:bg-[#c3f53b] hover:text-black cursor-pointer relative w-full border-solid border-white border-2 bg-black py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#c3f53b] sm:text-lg">
              <span className="block truncate">{sortFilter.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <SelectorIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true" 
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-[11] mt-1 max-h-60 w-full overflow-auto  bg-black text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {sortOptions.map((option, optionIdx) => (
                  <Listbox.Option
                    key={optionIdx}
                    className={({ active }) =>
                      `cursor-pointer border-2 border-solid border-white årelative select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-[#c3f53b] text-black' : 'text-white'
                      }`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    )
  }