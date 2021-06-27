
import React, { useContext, useState } from 'react';
import {MemoryRouter, Switch, Route} from 'react-router-dom';
import AccountScreen from '../AccountScreen';
import Content from '../content';
import Login from '../Login';
import TransferScreen from '../TransferScreen';

const LoginComponent = () =>{
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/account" component ={AccountScreen} />
      <Route exact path="/transfer" component ={TransferScreen} />
    </Switch>
  );
};

const LoginSegment = () => (
<MemoryRouter>
   <LoginComponent />
  </MemoryRouter>
);
export default LoginSegment;