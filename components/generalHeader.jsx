import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
   return (

      <div>
         <div className=" fixed top-3 right-3">
            <ConnectButton accountStatus="address"  />
         </div>
         <h1 className="flex m-0 text-6xl leading-tight">
         FINDER'S FEE FINDER ☽
         </h1>
         <h2 className='flex flex-row justify-center flex-nowrap'>
            <Link  href="/">
               <a className="mx-5" >
                  HOME
               </a>
            </Link>
            <div>
            ☼
            </div>
            <Link href="/about">
               <a className="mx-5">
                  ABOUT
               </a>
            </Link>
         </h2>
      </div>

   )
}

