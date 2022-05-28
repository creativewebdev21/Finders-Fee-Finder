import Head from 'next/head'
import { ethers } from "ethers"
import { useEffect, useState } from 'react';
import { Popover } from '@headlessui/react';
import Link from 'next/link';
import { useAppContext } from '../context/appContext.js'; // import based on where you put it

// urql graphql import
import { createClient } from 'urql';

// component imports
import Header from '../components/generalHeader.jsx';
import DisplayData, {LoadingData} from '../components/displaydata';
import DisplayDataHeader, {LoadingHeaderData} from '../components/displaydataheader';





const APIURL = "https://indexer-prod-mainnet.zora.co/v1/graphql";
const APIURL2 = "https://api.zora.co/graphql"
// link to zora rinkeby indexer: https://indexer-dev-rinkeby.zora.co/v1/graphql
// link to zora mainnet indexer: https://indexer-prod-mainnet.zora.co/v1/graphql
// link to new zora indexer (works on multiple chains): "https://api.zora.co/graphql"


// const newIndexer = ` 
//   query MyQuery {
//     markets(filter: {priceFilter: {currencyAddress: "0x0000000000000000000000000000000000000000"}, marketFilters: {marketType: V3_ASK, statuses: ACTIVE}}, pagination: {limit: 500}, networks: {network: ETHEREUM, chain: MAINNET}) {
//       nodes {
//         market {
//           properties {
//             ... on V3Ask {
//               address
//               askCurrency
//               collectionAddress
//               seller
//               tokenId
//               findersFeeBps
//               askPrice {
//                 ethPrice {
//                   decimal
//                 }  
//               }
//               sellerFundsRecipient
//             }
//           }
//           transactionInfo {
//             transactionHash
//           }
//         }
//         token {
//           metadata
//         }
//       }
//     }
//   }
// `

// const client2 = createClient({
//   url: APIURL2
//   })

const v3AsksAggregateQuery = ` 
query {
  V3Ask_aggregate(
    where:
    {
      status: {_eq: "ACTIVE"}
      findersFeeBps: {_neq: 0},  
    }
  ) {
    aggregate {
      count
    }
  }
}
`

const client = createClient({
url: APIURL
})


export default function Home(/* {id, nft, metadata } */) {
  const [askCount, setAskCount] = useState();
  const [rawData, setRawData] = useState();
  const [currentData, setCurrentData] = useState(); 
  const [loading, setLoading] = useState(false);   
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState(""); 

  const { sortFilter, sortDirection } = useAppContext()

  const sortData = (array) => {
    return array.sort((ask1, ask2) => {
      if ( sortDirection.directionValue === "DESCENDING") {        
        return ask2[sortFilter.queryValue] - ask1[sortFilter.queryValue]
      } else {          
        return ask1[sortFilter.queryValue] - ask2[sortFilter.queryValue]
      } 
    })
  }

  const enrichData = (arrayToSort) => {
    return arrayToSort.map((ask) => {
      ask.simpleETH = Number(ethers.utils.formatUnits((ask.askPrice), "ether")); 
      ask.totalBounty = ask.simpleETH * (ask.findersFeeBps / 10000); 
      return ask; 
    });  
  }

  const generateCalls = (numCalls) => {
    const callArray = [];

    for (let i = 0; i < numCalls; i++ ) {
      let call = ` 
      query {
        V3Ask(
          where: 
          {
            status: {_eq: "ACTIVE"}, 
            findersFeeBps: {_neq: 0},
            askCurrency: {_eq: "0x0000000000000000000000000000000000000000"}
            #seller: {_eq: "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8"} 
            #tokenContract: {_eq: "0x6C0845540C0b7B868C3a1739246fC99aDEDC8036"}
            #tokenId: {_eq: "1"}   
          }
          limit: 2
          offset: ${i * 100}
        ) {
          id
          address
          askCurrency
          askPrice 
          findersFeeBps
          seller
          sellerFundsRecipient
          tokenContract  
          tokenId
        }
      }`
      callArray.push(call)
    } 
    return callArray
  }

  const generateQueries = (array, length) => {
    const promises = []
    for (let i = 0; i < length; i++) {
      promises.push(client.query(array[i]).toPromise())
    }
    return promises
  }

    const runPromises = async (inputArray) => {
      return Promise.all(inputArray).then((results) => {
        return [results]
      })
    }

    const concatPromiseResults = (multipleArrays) => {
      const masterArray = []
      for (let i = 0; i < multipleArrays[0].length; i++ ) {
        for (let j = 0; j < multipleArrays[0][i].data.V3Ask.length; j++ ) {
          masterArray.push(multipleArrays[0][i].data.V3Ask[j])
        }
      } return masterArray
    }

  const fetchData = async () => {
    console.log("fetch data")

    try {
      setLoading(true);

      const aggData = await client.query(v3AsksAggregateQuery).toPromise()
      const aggDataCount = aggData.data.V3Ask_aggregate.aggregate.count
      const numOfCallsRequired = Math.ceil(aggDataCount / 100)
      setAskCount(aggDataCount)

      const finalV3CallArray = generateCalls(numOfCallsRequired);

      const finalV3Promises = generateQueries(finalV3CallArray, numOfCallsRequired)

      const promiseReturns = await runPromises(finalV3Promises);

      const promiseResults = concatPromiseResults(promiseReturns);

      const enrichedArray = enrichData(promiseResults);

      setRawData(enrichedArray);
      setCurrentData(sortData(enrichedArray)); 

      // const swag = await client2.query(newIndexer).toPromise();
      // console.log("new indexer test: ", swag);

    } catch(error){
      console.error(error.message);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
    console.log("checking curernt state load", currentData)
    }, 
    [] // this is passing sortFilter in as a dependency, so whenever it changes useEffect will run again
  )

  useEffect(() => {
    if (!!rawData) {
      fetchData();
      setCurrentData(sortData(rawData)); 
    }},
    [
      sortFilter, 
      sortDirection
    ] // this is passing sortFilter in as a dependency, so whenever it changes useEffect will run again
  )


  // ==== ADVANCED SEARCH =====
  const advancedFilter = () => {
    console.log("running")
    if (!!rawData) {
      console.log("what went into advanced filter: ", rawData)
      const specificToken = rawData.filter((ask) => {
        if(ask.tokenContract === contractAddress && ask.tokenId === tokenId){
          return ask; 
        } 
      }); 
      console.log("specificToken = ", specificToken)
      setCurrentData(specificToken)
    } else {
      return
    }
  }  
  // ==== ADVANCED SEARCH =====


  return (
    <div className='px-8 py-5'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white min-h-screen px-0 py-8 flex flex-1 flex-col  items-center">                        
        <Header />
{/*         <h2>
        FIND BUYERS FOR THE LISTINGS BELOW AND RECEIVE THE FINDER'S FEE
        </h2> */}
        {/* <TokenLookup inputContract={contractAddress} inputToken={tokenId} advancedFilterCB={advancedFilter} setContractCB={setContractAddress} setTokenCB={setTokenId} />        */}
{/*         <Popover>
            <Popover.Button className="flex flex-row justify-self-center p-2 bg-black border-2 border-solid border-white">
              ADVANCED SEARCH
            </Popover.Button>                    
            <Popover.Panel>
            {({ close }) => (               
              <div className="border-white border-2 border-solid max-w-xs my-2 overflow-hidden rounded-none shadow-lg">
                <div className="px-6 py-4">
                    <div className=" mb-2 text-xl font-bold">ADVANCED SEARCH</div>                    
                    <div className="flex flex-col"> 
                      <label className="mb-2 italic">CONTRACT ADDRESS</label>
                      <input
                          className="text-black mb-4 border-b-2"
                          placeholder='Ex: 0xa874...'
                          name="contractAddress"
                          type="text"      
                          value={contractAddress}                    
                          onChange={(e) => {
                            e.preventDefault(); 
                            setContractAddress( e.target.value);
                          }}
                          required
                      /> 
                      <label  className="mb-2 italic">TOKEN ID</label>
                      <input
                          className="text-black mb-4 border-b-2"
                          name="tokenId"
                          type="text"      
                          value={tokenId}                      
                          onChange={(e) => {
                            e.preventDefault(); 
                            setTokenId(e.target.value);                           
                          }}
                          required                          
                      />               
                        <button
                          disabled={tokenId !== "" && contractAddress !== "" ? false : true}
                          className=" px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-2 hover:bg-purple-700 disabled:bg-black disabled:text-slate-800 disabled:border-slate-800 " 
                          onClick={() => {
                            advancedFilter()
                            close()
                          }}
                        >
                          Submit
                        </button>
                      <button
                        disabled={tokenId !== "" && contractAddress !== "" ? false : true}
                        className="mt-5 px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-2 hover:bg-purple-700 disabled:bg-black disabled:text-slate-800 disabled:border-slate-800" 
                        onClick={() => {
                          fetchData()
                          setTokenId("")
                          setContractAddress("")
                          close()                          
                        }}
                      >
                        CLEAR SEARCH
                      </button>
                    </div>
                </div>
              </div>
              )}
            </Popover.Panel>
        </Popover> */}
        {loading ? <LoadingHeaderData /> : <DisplayDataHeader inputContract={contractAddress} inputTokenId={tokenId} advancedFilterCB={advancedFilter} setTokenCB={setTokenId} setContractCB={setContractAddress} fetchDataCB={fetchData} count={askCount} />}
        {loading ? <LoadingData /> : <DisplayData asks={currentData}/>}
      </main>

      <footer className="flex flex-1 px-0 py-8 justify-center items-center border-t-1 border-solid border-t-white">      
        <a className="flex justify-center items-center grow"
          href="https://www.twitter.com/0xTranqui"
        >
          tranqui.eth
        </a>
      </footer>
    </div>
  )
}

