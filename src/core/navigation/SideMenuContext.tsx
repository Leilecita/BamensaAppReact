import React, { createContext, useContext } from 'react';
import type { AppStackParamList } from './AppStack';

export type AppRoute = 'home' | 'operations' | 'coins' | 'accounts' | 'createAccount';

type SideMenuContextType = {
 openMenu: () => void;
 closeMenu: () => void;
 navigateTo: <R extends AppRoute>(route: R, params?: AppStackParamList[R]) => void;
 currentRoute: AppRoute;
};

const SideMenuContext = createContext<SideMenuContextType>({
 openMenu: () => {},
 closeMenu: () => {},
 navigateTo: () => {},
 currentRoute: 'home',
});

export const SideMenuProvider = SideMenuContext.Provider;

export const useSideMenu = () => useContext(SideMenuContext);
