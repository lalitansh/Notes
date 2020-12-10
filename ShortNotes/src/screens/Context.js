import React,{Component} from 'react';
import {
View,
Text
} from 'react-native';

 class Context extends React  {
  constructor(props){
    super(props)
    
  }
  render()

  {
    return(
      <View> 
        <Text title = {this.props.title} />
      </View>
      )
  }
 
  
}

export default Context;

