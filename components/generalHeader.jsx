import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
   return (

      <div className="z-50">
         <div className=" fixed top-3 right-3">
            <ConnectButton label="CONNECT WALLET"  accountStatus="address"   />
         </div>
         <div className=" text-center pt-4 m-0 text-6xl leading-tight">
            FINDER'S FEE FINDER ☽
         </div>
         <h2 className=' text-3xl mt-2 flex flex-row justify-center flex-nowrap'>
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

