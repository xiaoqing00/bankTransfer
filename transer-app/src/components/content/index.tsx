import React, { useContext } from 'react';
import { ScreenContext } from '../../context';
import Screen from '../../Screen';
import AccountScreen from '../AccountScreen';

const Content = () => {
const  { screen } = useContext(ScreenContext)
return(
    <div className="content" >      
     {screen === Screen.Account && <AccountScreen />}
    </div>
  )};

  export default Content;