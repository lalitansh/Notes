import React,{Component} from 'react';
import ArchiveNotes from '../screens/ArchiveNotes'
import {StackNavigator} from './StackNavigator'
import {createDrawerNavigator, DrawerItems,DrawerContentScrollView} from '@react-navigation/drawer';
import {createAppContainer,NavigationContainer} from '@react-navigation/native';
//import Ionicons from 'react-native-vector-icons/Ionicons'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import {ArchiveStackNavigator} from  './ArchiveStackNavigator'

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text
}from 'react-native';
//global.currentScreenIndex = 0;
const Drawer = createDrawerNavigator();
export function MyDrawer({...props}){
  return (

    <Drawer.Navigator DrawerContent={(props) => (
          <CustomDrawComponent {...props} />
        )}>
      <Drawer.Screen name="Notes" component={StackNavigator} />
      <Drawer.Screen name="ArchiveNotes" component={ArchiveStackNavigator} />
    </Drawer.Navigator>

  );
}

const CustomDrawComponent=({...props})=> (

<SafeAreaView style = {{flex:1}}>
  <ScrollView>
    <View style = {{borderBottomColor : 'black', borderBottomWidth : 1, flex : 1, height : 100, justifyContent : 'center', alignItems : 'center'}}>
    <Text>Hello this is </Text>
    </View>
  <DrawerItems
  activeBackgroundColor={"#6300ee"}
  activeTintColor={"white"}
  {...props}/>
  </ScrollView>
  </SafeAreaView>

)
