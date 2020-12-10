import React,{Component, useEffect} from 'react';
import ArchiveNotes from '../screens/ArchiveNotes';
import {StackNavigator} from './StackNavigator';
import {createDrawerNavigator, DrawerContentScrollView,
  DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import {createAppContainer,NavigationContainer} from '@react-navigation/native';
import {ArchiveStackNavigator} from  './ArchiveStackNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Colors from '../utils/Colors';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Image
}from 'react-native';
import colors from '../utils/Colors';
import { Left } from 'native-base';

//global.currentScreenIndex = 0;
const Drawer = createDrawerNavigator();
const WidthL = Dimensions.get('window').width;
export function MyDrawer({...props}){


  return (

    <Drawer.Navigator drawerContentOptions ={{
      labelStyle : {
       right : 12,
      },
      itemStyle : {
        marginVertical : 5,
        borderTopRightRadius : 25,
        borderBottomRightRadius : 25
      }
    }} drawerContent={(props) => <CustomDrawComponent {...props} />}
    drawerStyle={{
      backgroundColor: Colors.grey100,
    }}>
    
      <Drawer.Screen name="Notes" component={StackNavigator}
      options = {{
        drawerIcon: ({ focused, size }) => (
         <Foundation style = {{marginLeft:10}} name = 'clipboard-notes' color = {focused ? Colors.indigoA700 : 'black'} size = {20} />
        ),
       
      }}
      />

      <Drawer.Screen name="Archive" component={ArchiveStackNavigator} 
      options = {{
        drawerIcon: ({ focused, size }) => (
         <Foundation style = {{
           marginLeft:10
         }} name = 'archive' color = {focused ? Colors.indigoA700 : 'black'} size = {20} />
        ),
      }}
      title = 'Archive'
      />

    </Drawer.Navigator>

  );
}

const CustomDrawComponent=({...props})=> (

<SafeAreaView style = {{flex:1}}>
  <DrawerContentScrollView contentContainerStyle = {{
    width : '100%',
    
    
  }}>
    <View style = {{marginTop:10,borderBottomColor : 'black', borderBottomWidth : 1, flex : 1, height : 100, justifyContent : 'center', alignItems : 'center'}}>
    <FontAwesome color = {Colors.indigo100} size ={WidthL/7} name = 'user-circle-o' />
    <Text>Hello user !</Text>
    </View>
    
  <DrawerItemList
  
  activeBackgroundColor={Colors.blue100}
  activeTintColor={Colors.indigoA700}
  
  {...props}/>
  
  </DrawerContentScrollView>
  </SafeAreaView>

)
