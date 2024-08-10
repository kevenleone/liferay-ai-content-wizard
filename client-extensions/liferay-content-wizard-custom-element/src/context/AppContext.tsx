import { ReactNode, createContext, useContext } from 'react';

import { useMyUserAccount } from '../hooks/useMyUserAccount';

const AppContext = createContext<{ myUserAccount: any }>({
    myUserAccount: null,
});

type AppContextProviderProps = {
    children: ReactNode;
};

const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
}) => {
    const { data: myUserAccount } = useMyUserAccount();

    return (
        <AppContext.Provider value={{ myUserAccount }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
