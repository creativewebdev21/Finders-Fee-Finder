import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AppContext = createContext(null);

export function AppWrapper({ children }) {
   const [variableState, setVariableState] = useState({name: "FINDER'S FEE", queryValue: 'totalBounty' });
   const [variableState2, setVariableState2] = useState({direction: "DESCENDING", directionValue: 'DESCENDING'})

   useEffect(() => {

   }, []);

   const values = useMemo(() => (
      {
         variableState, variableState2,      // States que seran visibles en el contexto.
         setVariableState, setVariableState2  // Funciones que son exportadas para manejo externo.
      }/* ,
      {
         variableState,
         setVariableState2 
      } */), 
      [ 
         variableState,
         variableState2
      ]
      );   // // States que serán visibles en el contexto.
   
   return (
      <AppContext.Provider value={values}>
         {children}
      </AppContext.Provider>
   );
}

export function useAppContext() {
   const context = useContext(AppContext);
 
   if(!context){
     console.error('Error deploying App Context!!!');
   }
 
   return context;
 }

export default useAppContext;

