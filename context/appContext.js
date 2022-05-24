import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AppContext = createContext(null);

export function AppWrapper({ children }) {
   const [sortFilter, setsortFilter] = useState({name: "FINDER'S FEE", queryValue: 'totalBounty' });
   const [sortDirection, setsortDirection] = useState({direction: "DESCENDING", directionValue: 'DESCENDING'})

   const values = {
   sortFilter,
   setsortFilter,
   sortDirection,
   setsortDirection
   }

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

