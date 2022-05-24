// create-next-app boilterplate
import Head from 'next/head'
import Image from 'next/image'
import { ethers } from "ethers"

// rainbowkit import
import { ConnectButton } from '@rainbow-me/rainbowkit';

// urql graphql import
import { createClient } from 'urql';
import { useEffect, useState } from 'react';

import DisplayData, {ShitData} from '../components/displaydata';
import DisplayDataHeader from '../components/displaydataheader';

import { useAppContext } from '../context/state.js'; // import based on where you put it

const APIURL = "https://indexer-prod-mainnet.zora.co/v1/graphql";
// link to zora rinkeby indexer: https://indexer-dev-rinkeby.zora.co/v1/graphql
// link to zora mainnet indexer: https://indexer-prod-mainnet.zora.co/v1/graphql

const v3AsksQuery = ` 
query {
  V3Ask(
    where: 
    {
      status: {_eq: "ACTIVE"}, 
      findersFeeBps: {_neq: 0},
      askCurrency: {_eq: "0x0000000000000000000000000000000000000000"}    
    }
    limit: 100
    offset: 0
  ) {
    address
    askCurrency
    askPrice
    findersFeeBps
    seller
    sellerFundsRecipient
    tokenContract  
    tokenId
  }
}
`

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


export default function Home() {
  const [askCount, setAskCount] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);   
  const { variableState, setVariableState } = useAppContext()
  const { variableState2, setVariableState2 } = useAppContext()

  const enrichData = (arrayToSort, sortParam) => {
    return arrayToSort.sort((ask1, ask2) => {
      ask1.simpleETH = Number(ethers.utils.formatUnits((ask1.askPrice), "ether")); 
      ask2.simpleETH = Number(ethers.utils.formatUnits((ask2.askPrice), "ether"));
      ask1.totalBounty = ask1.simpleETH * (ask1.findersFeeBps / 10000); 
      ask2.totalBounty = ask2.simpleETH * (ask2.findersFeeBps / 10000);
      if ( variableState2.directionValue === "DESCENDING") {
/*         console.log("descend sort param check:", sortParam)
        console.log("descdending sort check:", ask2[sortParam], ask1[sortParam]) */
        return ask2[sortParam] - ask1[sortParam]
      } else {
/*         console.log("a sort param check:", sortParam)
        console.log("ascending sort check:", ask1[sortParam], ask2[sortParam]) */
        return ask1[sortParam] - ask2[sortParam]
      }
    })
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
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("promise # " + (i + 1) + " has resolved");
          resolve(client.query(array[i]).toPromise());
        }, 1000 * (i + 1))
      })
      promises.push(promise)
    }
    console.log("promises array :", promises);
    return promises
  }


  const fetchData = async () => {
    /* console.log("top level quey cleaned: ", query.queryValue) */
    console.log("fetch data")

/*     const querySearchTerms = {
      status: {_eq: "ACTIVE"}, 
      findersFeeBps: {_neq: 0},
      askCurrency: {_eq: "0x0000000000000000000000000000000000000000"} 
    } */



    try {
      setLoading(true);

      // await the coutn and put in state

      const aggData = await client.query(v3AsksAggregateQuery).toPromise()
      const aggDataCount = aggData.data.V3Ask_aggregate.aggregate.count
      const numOfCallsRequired = Math.ceil(aggDataCount / 100)
      setAskCount(aggDataCount)

      const finalV3CallArray = generateCalls(numOfCallsRequired);
      console.log("finalV3CallArray", finalV3CallArray);

      const finalV3Promises = generateQueries(finalV3CallArray, numOfCallsRequired)
      console.log("finalV3Promises", finalV3Promises);
      // const bigBlob = Promise.all(client.query(finalV3CallArray))
      //console.log("bigblob", bigBlob);

      Promise.all(finalV3Promises).then((results) => {
        console.log("after stuff is resolved before appended: ", results)
        const resolvedArray = [results]
        console.log("resolved array: ", resolvedArray)
      })

      const {data, error} = await client.query(v3AsksQuery).toPromise();
      console.log("actually fetching data again")
      //^ make this into a long ass function that returns the big array t
      // for loop where you define the queries, and then call them in a promise.all
      /// will be something like for the amount of call syou need to make, run promise.a;;



      if (error){
        throw new Error("Grapqhl failed " + error);
      }
      const cleanedIndexerData = data.V3Ask
      const newArray = enrichData(cleanedIndexerData, variableState.queryValue);
      setData(newArray);

    } catch(error){
      console.error(error.message);
    } finally {
      setLoading(false)
    }
    
  }


  useEffect( () => {
      fetchData();
    },
    [variableState, variableState2] // this is passing variableState in as a dependency, so whenever it changes useEffect will run again
  )

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
        <div>
          {"current sort field: " + variableState.queryValue}
        </div>
        <div>
          {"sorting thru " + askCount + " asks"}
        </div>
        <h2>
          <a
          href="https://twitter.com/ourZORA/status/1492222914086653953?s=20&t=uS-ptUK0ZkAs5ZC-pCd9Sw"
          >
            WHAT IS A FINDER'S FEE?
          </a>
        </h2 >        
        {/* <ConnectButton accountStatus={"address"} /> */}

        {loading ? <ShitData />:   <DisplayDataHeader  asks={data} />}
        {loading ? <ShitData />:   <DisplayData asks={data}/>}



        

{/*         <div>
          {"There are " + dataLength + ' active asks w/ finders fees. Here is the metadata : ' + JSON.stringify(data, null, 3)}
        </div> */}
        
{/*         <div>
          {"" + indexerData}
        </div>
 */}
{/*         <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
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
