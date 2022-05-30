import FieldSort from './fieldSort';
import FieldSortDirection from './fieldSortDirection';
import TokenLookup from './tokenLookup';

const DisplayDataHeader = ({ count, inputContract, inputTokenId, advancedFilterCB, setTokenCB, setContractCB, fetchDataCB  }) => {

  return (
    <>
      <div className=" md:grid md:grid-cols-3 md:grid-rows-2 grid-cols-1 grid-rows-4 my-3 sm:my-5 w-fit">
        <h2 className="text-center row-span-1 col-start-1 col-end-4 flex flex-wrap justify-center items-center">   
          <span className="text-[#c3f53b] pr-2">
            {count}
          </span>
          ACTIVE LISTINGS SORTED BY
        </h2>
        <FieldSort className="row-span-2 col-start-1 col-end-2" />
        <FieldSortDirection className="md:row-span-2 md:col-start-2 md:col-end-3 row-span-3 col-start-1 col-end-2" />
        <TokenLookup
          className="ml-5 md:row-span-2 md:col-start-3 md:col-end-4 row-span-4 col-start-1 col-end-2 "
          inputContract={inputContract}
          inputTokenId={inputTokenId}
          advancedFilterCB={advancedFilterCB}
          setTokenCB={setTokenCB}
          setContractCB={setContractCB}
          fetchDataCB={fetchDataCB}
        />
      </div>
    </>
  ) 
}

export const LoadingHeaderData = () => (
  <div className="mt-5">
    ::: F I N D I N G ::: F I N D E R ' S ::: F E E S :::
  </div>
)
export default DisplayDataHeader