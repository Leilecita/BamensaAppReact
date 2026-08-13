import React, { createContext, useContext } from 'react';
import type { AppStackParamList } from './AppStack';

export type AppRoute =
 | 'home'
 | 'homeNew'
 | 'operations'
 | 'statistics'
 | 'coins'
 | 'accounts'
 | 'createAccount'
 | 'outcomes'
 | 'boxBalance'
 | 'boxBalanceFisherton'
 | 'checks'
 | 'transfers';

type SideMenuContextType = {
 openMenu: () => void;
 closeMenu: () => void;
 navigateTo: <R extends AppRoute>(route: R, params?: AppStackParamList[R]) => void;
 currentRoute: AppRoute;
 homeRoute: 'home' | 'homeNew';
};

const SideMenuContext = createContext<SideMenuContextType>({
 openMenu: () => {},
 closeMenu: () => {},
 navigateTo: () => {},
 currentRoute: 'home',
 homeRoute: 'homeNew',
});

export const SideMenuProvider = SideMenuContext.Provider;

export const useSideMenu = () => useContext(SideMenuContext);
