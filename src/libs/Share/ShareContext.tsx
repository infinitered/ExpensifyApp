import React, {createContext, PropsWithChildren} from 'react';

const ShareContext = createContext<null>(null);

type ShareContextProviderProps<T = Record<string, never>> = PropsWithChildren<T>;

function ShareContextProvider({children}: ShareContextProviderProps) {
    return <ShareContext.Provider value={null}>{children}</ShareContext.Provider>;
}

const useShareData = (): null => null;

export default {ShareContextProvider, useShareData};
