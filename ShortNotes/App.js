

import React,{Component} from 'react';
import {MyDrawer} from './src/navigation/DrawerNavigator'
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'




export default class App extends Component {
  render(){
    return(
      <>

      <StatusBar translucent = {true} barStyle = "light-content" hidden = {false} backgroundColor = "#303f9f"/>
      <NavigationContainer>
      <MyDrawer/>
      </NavigationContainer>
      </>
    )
  }
}
