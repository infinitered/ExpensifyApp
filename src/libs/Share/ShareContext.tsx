import React, {createContext, PropsWithChildren} from 'react';

const ShareContext = createContext<null>(null);

function Provider({children}: PropsWithChildren<Record<string, never>>) {
    return <ShareContext.Provider value={null}>{children}</ShareContext.Provider>;
}

const useShareData = (): null => null;

export default {Provider, useShareData};
