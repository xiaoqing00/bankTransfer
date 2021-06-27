import React, { useState } from 'react';
import { Route, Switch} from 'react-router-dom';
import './App.scss';
import Header from './components/Header';
import Hero from './components/Hero';
import Login, { IUser } from './components/Login';
import Screen from './Screen';
import { LoginContext, ScreenContext } from './context';
import LoginSegment from './components/LoginSegment';

function App() {
  const [screen, setScreen] = useState<Screen>(Screen.Blank);
  const [user, setUser] = useState<IUser | undefined>(undefined);
  return (
    <div className="App">
      <ScreenContext.Provider value={{
        screen,
setScreen}}
      >
        <LoginContext.Provider value={{user, setUser}}>
      <div className="content">
      <Header />
      <Hero />
        <Switch>
          {/* <Route exact path="/" component = {MainSegment} /> */}
          <Route exact path="/" component = {LoginSegment} />
        </Switch>
      </div>
      </LoginContext.Provider>
      </ScreenContext.Provider>
      
    </div>
  );
}

export default App;
