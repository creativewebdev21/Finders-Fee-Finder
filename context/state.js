import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AppContext = createContext(null);

export function AppWrapper({ children }) {
   const [variableState, setVariableState] = useState({name: "FINDER'S FEE", queryValue: 'findersFeeBps'});

   useEffect(() => {

   }, []);

   const values = useMemo(() => (
      { variableState,      // States que seran visibles en el contexto.
        setVariableState,   // Funciones que son exportadas para manejo externo.
      }), 
      [ 
        variableState ]);   // // States que serán visibles en el contexto.
   
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


/* import { createContext, useContext } from 'react';

const AppContext = createContext({
   theme: undefined, 
})

export function AppWrapper({ children }) {
   let sharedState = AppContext
   console.log(AppContext._currentValue)
   return (
      <AppContext.Provider value={sharedState}>
         {children}
      </AppContext.Provider>
   );
}

export function useAppContext() {
   return useContext(AppContext);
} */