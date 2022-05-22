import Dropdown from './dropdown';

const DisplayDataHeader = ({ asks }) => {
  
  return (
    <>
      <div className="mt-10 mb-5 border-black border-2 border-solid flex flex-row flex-wrap w-fit">
        <h3 className="ml-5 mr-5 self-center">   
          {`${ asks ? asks.length : null}` + " ACTIVE LISTINGS SORTED BY"} 
        </h3>
        <Dropdown  />
      </div>
    </>
  ) 
}

export default DisplayDataHeader