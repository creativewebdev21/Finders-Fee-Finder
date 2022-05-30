import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useAppContext } from '../context/appContext.js';

  const directionOptions = [
    { direction: 'ASCENDING', directionValue: 'ASCENDING' },
    { direction: 'DESCENDING', directionValue: 'DESCENDING' }
  ]

  export default function FieldSortDirection() {

  const { sortDirection, setsortDirection } = useAppContext()


/*    console.log("what is avariable state2: ", sortDirection); */
    
    const select = (arg) => {
      setsortDirection(arg);
      // console.log("logging direction arg: ", arg)
    }
    
    return ( 
      <div className="text-white z-10">
        <Listbox value={sortDirection} onChange={select}>
          <div className="relative mt-1">
            <Listbox.Button className="hover:bg-[#c3f53b] hover:text-black relative w-full cursor-pointer border-white border-2 border-solid bg-black py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#c3f53b] sm:text-lg">
              <span className="block truncate">{sortDirection.direction}</span>
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
              <Listbox.Options className="absolute z-[12] mt-1 max-h-60 w-full overflow-auto bg-black text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {directionOptions.map((direction, directionIdx) => (
                  <Listbox.Option
                    key={directionIdx}
                    className={({ active }) =>
                    `border-2 border-solid border-white relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-[#c3f53b] text-black' : 'text-white'
                    }`
                  }
                    value={direction}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {direction.direction}
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