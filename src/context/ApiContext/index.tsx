import { ReactNode, createContext, useContext } from "react";
import { Api } from "../../api";

export const api = new Api();
const apiContext = createContext(api);

export const useApi = () => useContext(apiContext);

export const ApiProvider = ({ children }: {children: ReactNode}) => <apiContext.Provider value={api}>{children}</apiContext.Provider>;
