import FieldSort from './fieldSort';
import FieldSortDirection from './fieldSortDirection';
import TokenLookup from './tokenLookup';

const DisplayDataHeader = ({ count }) => {
  
  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2  mt-10 mb-20 w-fit">
        <h2 className="row-span-1 col-start-1 col-end-4 flex flex-wrap justify-center items-center">   
          {`${count}` + " ACTIVE LISTINGS SORTED BY"} 
        </h2>
        <FieldSort className="row-span-2 col-start-1 col-end-2" />
        <FieldSortDirection className="row-span-2 col-start-2 col-end-3" />
        <TokenLookup className="ml-5 row-span-2 col-start-3 col-end-4" />
      </div>
    </>
  ) 
}

export const LoadingHeaderData = () => (
  <div className="mt-5">
     Loading Header . . .
  </div>
)
export default DisplayDataHeader