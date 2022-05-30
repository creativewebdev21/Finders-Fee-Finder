import Header from "../components/generalHeader"

export default function About() {
   return (
      <div className="px-8 py-0">
         <main className="text-white min-h-screen px-0 py-8 flex flex-1 flex-col  items-center">                        
            <Header />
            <div className="mt-10 w-11/12 sm:w-10/12">
               <div className="mb-10">
                  <div className="mb-2 text-xl ">
                  WHAT IS THIS PROJECT
                  </div>
                  <div>
                     This site was created with the goal of improving the discoverability + sharability of finder's fees in the ZORA ecosystem. These fees act as curatorial incentives to promote distribution of works listed through the ZORA protocol, but until have not been easy to find + share. If the finder's fee still doesn't make sense to you, read the description in the header of the <a style={{ textDecoration: "underline", color: "#c3f53b" }} href="https://twitter.com/ZORA_FFF">ZORA FFF</a> twitter page
                  </div>
               </div>
               <div className="mb-10">
                  <div className="mb-2 text-xl ">
                  HOW TO USE IT - <a style={{ textDecoration: "underline", color: "#c3f53b" }} href="https://www.loom.com/share/ee8579eb87544d3a95333f94a2c10848">VIDEO DEMO</a>
                  </div>
                  <div>
                     - Go to "HOME" page <br />
                     - Connect your wallet (top right corner) <br />
                     - Use sorts/earch to find a piece that speaks to you <br />
                     - Click "SHARE" on that piece, which will take you to your individualized share page<br />
                     - Click "GENERATE SHARE LINK" to copy the share URL to your clipboard. Spread link with the world !<br />
                     - Your share link passes your wallet address as the "finder" into the ZORA purchase function that is present on your individualized share page. If someone buys that NFT through your link, you receieve the finder's fee <br />
                  </div>
               </div>
               <div className="mb-10">
                  <div className="mb-2 text-xl ">
                     GET INVOLVED
                  </div>
                  <div>
                     This is an <a style={{ textDecoration: "underline", color: "#c3f53b" }} href="https://github.com/0xTranqui/Finders-Fee-Finder">open source project</a> with lots of things still to be done. Here are a few items I have in mind already, feel free to submit pull requests for anything that you think could improve the overall experience!
                  </div>
                  <div className="ml-5 mt-2">
                     - Create twitter bot that tracks the V3 Asks module and tweets everytime a new ask with a finder's fee has been created/fufilled/etc.
                  </div>
                  <div className="ml-5 mt-2">
                     - Create a leaderboard that tracks / displays the top "finders" in the ZORA ecosystem
                  </div>
                  <div className="ml-5 mt-2">
                     - Add pagination to the "HOME" page to speed up rendering  times
                  </div>
                  <div className="ml-5 mt-2">
                     - Convert app to the new/improved Zora indexer + new nft-components (not officially out yet) which should improve rendering success + speed (tranqui.eth is already planning to handle this one)
                  </div>
               </div>
               <div className="mb-10">
                  <div className="mb-2 text-xl ">
                  ABOUT THE CREATOR
                  </div>
                  <div>
                     <a
                        style={{ textDecoration: "underline", color: "#c3f53b" }}
                        href="https://twitter.com/0xTranqui "
                     >
                        tranqui.eth
                     </a>
                     {" "} is a passionate ZORA stan + asipiring web3 developer interested in public digital infrastructure. check out more of his work at {" "}
                     <a
                        style={{ textDecoration: "underline", color: "#c3f53b" }}
                        href="https://tranqui.xyz/ "
                     >
                        tranqui.xyz
                     </a>
                  </div>
               </div>                              
            </div>                             
         </main>
      </div>
   )
}