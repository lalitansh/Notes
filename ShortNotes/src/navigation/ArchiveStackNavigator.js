import ArchiveNotes from '../screens/ArchiveNotes';
import AddNotes from '../screens/AddNotes';
import {createStackNavigator} from '@react-navigation/stack';
import {createAppContainer,NavigationContainer} from '@react-navigation/native';
import React,{Component} from 'react';

 const Stack = createStackNavigator();
export function ArchiveStackNavigator({navigation}){
  return(
<Stack.Navigator
      initialRouteName="ArchiveNotes"
      headerMode = 'none'
    //mode : 'modal',
      //screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name="ArchiveNotes"
        component={ArchiveNotes}
        options={{ title: 'My app' }}
      />
      <Stack.Screen
        name="updateNote"
        component={AddNotes}

      />
    </Stack.Navigator>
  )
}
