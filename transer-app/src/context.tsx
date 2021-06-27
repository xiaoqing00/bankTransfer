import React from 'react';
import { IUser } from './components/Login';
import Screen from './Screen';

export interface ScreenContextProps{
    screen: Screen;
    setScreen: (screen: Screen) => void;
}
export const ScreenContext = React.createContext<ScreenContextProps>({
  screen: Screen.Login,
  setScreen: () => {},
});

export interface LoginContextProps{
    user?: IUser;
    setUser: (user: IUser) => void;
}
export const LoginContext = React.createContext<LoginContextProps>({
    user: undefined,
    setUser: ()=>{}
});