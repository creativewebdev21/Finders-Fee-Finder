import Head from 'next/head'
import { ethers } from "ethers"
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext.js'; // import based on where you put it

// urql graphql import
import { createClient } from 'urql';

// component imports
import Header from '../components/generalHeader.jsx';
import DisplayData, {LoadingData} from '../components/displaydata';
import DisplayDataHeader, {LoadingHeaderData} from '../components/displaydataheader';

const APIURL = "https://indexer-prod-mainnet.zora.co/v1/graphql";
const APIURL2 = "https://api.zora.co/graphql"
// link to zora mainnet indexer: https://indexer-prod-mainnet.zora.co/v1/graphql
// link to new zora indexer (works on multiple chains): "https://api.zora.co/graphql"

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
          }
          limit: 100
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
    console.log("fetching data")

    try {
      setLoading(true);

      const aggData = await client.query(v3AsksAggregateQuery).toPromise()
      const aggDataCount = aggData.data.V3Ask_aggregate.aggregate.count
      const numOfCallsRequired = Math.ceil(aggDataCount / 100)
      setAskCount(aggDataCount)

      // generates all the graphql queries that will be called
      const finalV3CallArray = generateCalls(numOfCallsRequired);

      // uses the generated graphql queries to generate the promised that will be called
      const finalV3Promises = generateQueries(finalV3CallArray, numOfCallsRequired)

      // calls all of the promises
      const promiseReturns = await runPromises(finalV3Promises);

      // cleans promiseReturns
      const promiseResults = concatPromiseResults(promiseReturns);

      // cleans + enriches promiseResults
      const enrichedArray = enrichData(promiseResults);

      setRawData(enrichedArray);
      setCurrentData(sortData(enrichedArray)); 

    } catch(error){
      console.error(error.message);
    } finally {
      setLoading(false)
    }
  }

  const advancedFilter = () => {
    if (!!rawData) {
      const specificToken = rawData.filter((ask) => {
        if(ask.tokenContract === contractAddress && ask.tokenId === tokenId){
          return ask; 
        } 
      }); 
      setCurrentData(specificToken)
    } else {
      return
    }
  }  

  useEffect(() => {
    fetchData();
    }, 
    []
  )

  useEffect(() => {
    if (!!rawData) {
      fetchData();
      setCurrentData(sortData(rawData)); 
    }},
    [
      sortFilter, 
      sortDirection
    ] // this is passing sortFilter + sortDirection in as dependencies, so whenever they change useEffect will run again
  )

  return (
    <div className='px-8 py-0'>
      <Head>
        <title>Finder's Fee Finder</title>
        <meta name="description" content="created by tranqui.eth" />
        <meta name="og:title" content="Finder's Fee Finder" />
        <meta
          property="og:image"
          content="https://findersfeefinder.xyz/finders_fee_img.png"
        />
        <meta name="twitter:card" content="summary_large_image"
        />
        <meta name="twitter:description" content="created by tranqui.eth"
        />

        <meta name="twitter:title" content="Finders Fee Finder"
        />

        <meta name="twitter:image" content="https://findersfeefinder.xyz/finders_fee_img.png"
        />           
        <link rel="icon" href="https://findersfeefinder.xyz/finders_fee_img.png" />
        <link rel="apple-touch-icon" href="https://findersfeefinder.xyz/finders_fee_img.png" />
      </Head>
      <main className="text-white min-h-screen px-0 py-8 flex flex-1 flex-col  items-center">                        
        <Header />
        {loading ? <LoadingHeaderData /> : <DisplayDataHeader inputContract={contractAddress} inputTokenId={tokenId} advancedFilterCB={advancedFilter} setTokenCB={setTokenId} setContractCB={setContractAddress} fetchDataCB={fetchData} count={askCount} />}
        {loading ? <LoadingData /> : <DisplayData asksPerPage={15} asks={currentData}/>}
      </main>
      <footer className="flex flex-1 px-0 py-8 justify-center items-center border-t-1 border-solid border-t-white">      
        <a className="flex justify-center items-center grow"
          href="https://tranqui.xyz/"
        >
          tranqui.eth
        </a>
      </footer>
    </div>
  )
}


// saving new indexer integration code for later 
//
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