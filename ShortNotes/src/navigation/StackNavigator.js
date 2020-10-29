import {createAppContainer, createSwitchNavigator, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ViewNotes from '../screens/ViewNotes';
import AddNotes from '../screens/AddNotes';
import ArchiveNotes from '../screens/ArchiveNotes';
import DrawerNavigation from './DrawerNavigator';
import React,{Component} from 'react';

 const Stack = createStackNavigator();


export function StackNavigator({navigation}){
  return(
<Stack.Navigator
      initialRouteName="ViewNotes"
      headerMode = 'none'
      //screenOptions={{ gestureEnabled: false }}
      mode = "modal"
    >
      <Stack.Screen
        name="ViewNotes"
        component={ViewNotes}
        options={{ title: 'My app' }}
      />
      <Stack.Screen
        name="AddNotes"
        component={AddNotes}
        //initialParams={{ user: 'me' }}
      />
    </Stack.Navigator>
  )
}
