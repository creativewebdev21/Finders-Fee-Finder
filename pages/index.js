// create-next-app boilterplate
import Head from 'next/head'
import Image from 'next/image'
import { ethers } from "ethers"

// rainbowkit import
import { ConnectButton } from '@rainbow-me/rainbowkit';

// urql graphql import
import { createClient } from 'urql';
import { useEffect, useState } from 'react';

import DisplayData, {LoadingData} from '../components/displaydata';
import DisplayDataHeader from '../components/displaydataheader';

import { useAppContext } from '../context/appContext.js'; // import based on where you put it
import NFTRender from "../components/nftPreview";

//
import { MediaFetchAgent, Networks } from '@zoralabs/nft-hooks';
import { NFTPreview } from "@zoralabs/nft-components";
import { Fragment } from "react";
//

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
      askCurrency: {_eq: "0x0000000000000000000000000000000000000000"}
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

  // useEffect(() => {
  //   if (!!rawData) {

          // below chunk wasn't working for some reason

  //     let sortedArray = sortData(rawData); 
  //     setCurrentData(sortedArray);



  //   }},
  //   [
  //       sortFilter, 
  //       sortDirection
  //   ])

  function fuckingbullshit() {
    return (
    <NFTPreview
      id="5731"
      contract="0x5180db8F5c931aaE63c74266b211F580155ecac8"
    />
    )
  }

  return (
    <div className='px-8 py-0'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-white min-h-screen px-0 py-24 flex flex-1 flex-col  justify-center items-center">
        <h1 className="flex m-0 text-6xl leading-tight">
        ☼ FINDER'S FEE FINDER ☼
        </h1>
        <h2>
        FIND BUYERS FOR THE LISTINGS BELOW AND RECEIVE THE FINDER'S FEE
        </h2>
        <h2>
          <a
          href="https://twitter.com/ourZORA/status/1492222914086653953?s=20&t=uS-ptUK0ZkAs5ZC-pCd9Sw"
          >
            WHAT IS A FINDER'S FEE?
          </a> 
        </h2 >        
        {/* <NFTPreview initialData={{ nft, metadata }} id={id} /> */}
        {/* {fuckingbullshit()} */}
        {loading ? <LoadingData /> : <DisplayDataHeader count={askCount} />}
        {loading ? <LoadingData /> : <DisplayData asks={currentData}/>}

      </main>

      <footer className="flex flex-1 px-0 py-8 justify-center items-center border-t-1 border-solid border-t-white">
        <a className="flex justify-center items-center grow"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className="h-4 ml-2">
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

/* export async function getServerSideProps() {
  // zNFT id to render
  const id = "3158";
  // Create the fetcher object
  const fetcher = new MediaFetchAgent(Networks.MAINNET);
  // Fetch the NFT information on the server-side
  const nft = await fetcher.loadNFTData(id);
  const metadata = await fetcher.fetchIPFSMetadata(nft.nft.metadataURI);

  // Function required to remove `undefined` from JSON passed to client.
  function prepareJson(json) {
    return JSON.parse(JSON.stringify(json));
  }

  return {
    props: prepareJson({
      nft: nft,
      metadata,
      id,
    })
  };
} */
