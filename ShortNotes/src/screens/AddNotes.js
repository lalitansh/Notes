import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Text
} from 'react-native';
import { IconButton,TextInput, FAB,Appbar} from 'react-native-paper';
import {number, any, string } from 'prop-types';
import { isFlowBaseAnnotation } from '@babel/types';
import {connect} from 'react-redux';
import {add_Notes} from '../actions/notes'
const DEVICE_WIDTH = Dimensions.get('window').width;
import Colors from '../utils/Colors';
//import console = require('console');

var currDate = Date()
var currTime = Date()

class AddNotes extends React.Component{

  constructor(props){
    super(props);
    this.name = '',
    this.state = {
      noteTitle : '',
      noteDescription  :'',
      time : Date,
      date : Date,
      isFocused : false,

    }
  }



  componentDidMount(){
    getValuesInLocalNote();
    getCurrentDateTime();
  }



  render(){
    const data = this.props.route.params.item; // Received note for updation

     getValuesInLocalNote=()=>{
       if (data){
        this.state.noteTitle = data.noteTitle
        this.state.noteDescription = data.noteDescription
      }
    }

  // Get Current Data and Time

  getCurrentDateTime=()=>{
    var currentData = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    // Creating variables to hold time.
    var date, TimeType, hour, minutes, seconds, fullTime;

    // Creating Date() function object.
    date = new Date();

    // Getting current hour from Date object.
    hour = date.getHours();

    // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
    if(hour <= 11)
    {

      TimeType = 'AM';

    }
    else{

      // If the Hour is Not less than equals to 11 then Set the Time format as PM.
      TimeType = 'PM';

    }

    // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
    if( hour > 12 )
    {
      hour = hour - 12;
    }

    // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format.
    if( hour == 0 )
    {
        hour = 12;
    }

    // Getting the current minutes from date object.
    minutes = date.getMinutes();

    // Checking if the minutes value is less then 10 then add 0 before minutes.
    if(minutes < 10)
    {
      minutes = '0' + minutes.toString();
    }


    //Getting current seconds from date object.
    seconds = date.getSeconds();

    // If seconds value is less than 10 then add 0 before seconds.
    if(seconds < 10)
    {
      seconds = '0' + seconds.toString();
    }


    // Adding all the variables in fullTime variable.
    fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();

    this.setState({
      time : fullTime.toString(),
      date : currentData.toString()+'/'+month.toString()+'/'+year.toString()
    });


    this.currDate = currentData+'/'+month+'/'+year
    this.currTime = fullTime
    console.log('currentDate:',this.currDate)
    console.log('currentTime:',this.currTime)
  }

    const onSaveNote=(noteTitle,noteDescription,date,time)=>{

    this.props.route.params.addNotes({noteTitle, noteDescription,date,time})
    this.props.navigation.setParams('EmbedArchiveStack',{name:this.name})
    this.props.navigation.goBack()
  }
    const onUpdateNote=(data,noteTitle,noteDescription,date,time)=>{
    if (data.id == data.id) {
      console.log('dataid',data.id)
      var id = data.id
      this.props.route.params.updateNote({id,noteTitle, noteDescription,date,time})
      this.props.navigation.goBack()
    }
  }

  return(
    <>

    { !data ? (<View style = {styles.appHeader}>
      <Text style = {{fontSize : 17,fontWeight:'400', color : 'white', alignSelf:'center',marginBottom:13.5}}>
      Add Note</Text>
    </View>) :  (<View style = {styles.appHeader}>
      <Text style = {{alignSelf : 'center', fontSize : 17,fontWeight:'400', color : 'white', marginBottom : 13.5}}>
      Update Note</Text>
    </View>) }


    <View style = {styles.container}>



      {(!data) ? (<>

     <TextInput
     label = {'Note Title'}
     defaultValue = {!data ? (this.state.noteTitle ) : (data.noteTitle ) }
     mode = 'flat'
     onChangeText =  {(text) => this.setState({noteTitle : text})}
     style = { !data ? styles.title : [styles.title,underlineColor="transparent"] }
     />

    <TextInput
    label = {'Note Description'}
    defaultValue = {!data ? (this.state.noteDescription ) : (data.noteDescription ) }
    onChangeText = {(text) => this.setState({noteDescription : text})}
     mode = 'flat'
     multiline = {true}
     style = {styles.text}
     scrollEnabled = {true}
     returnKeyLabel = 'done'
     blurOnSubmit = {true}
    />
    </>) :

    (<>

    <TextInput
    label = {this.state.isFocused ? 'Update Note' : ''}
    defaultValue = {!data ? (this.state.noteTitle ) : (data.noteTitle ) }
    mode = { 'flat' }
    onFocus = {()=> this.setState({isFocused : true})}
    onChangeText =  {(text) => this.setState({noteTitle : text})}
    theme={{ colors: { primary: 'red',underlineColor:'transparent',}}}
    style =  {styles.updateTitle }
    />

   <TextInput
   label = {this.state.isFocused ? 'Update Description' : ''}
   defaultValue = {!data ? (this.state.noteDescription ) : (data.noteDescription ) }
   onChangeText = {(text) => this.setState({noteDescription : text})}
    mode = { 'flat' }
    onFocus = {()=> this.setState({isFocused : true})}
    multiline = {true}
    style = {[ styles.updateText,{underlineColor : 'transparent'}  ]}
    theme={{ colors: { primary: 'red',underlineColor:'transparent',}}}
    scrollEnabled = {true}
    returnKeyLabel = 'done'
    blurOnSubmit = {true}
   />
   </>) }


    </View>
    { this.state.noteTitle === '' ?
    <TouchableOpacity  style = {styles.iconButton}
     onPress= {()=>this.props.navigation.pop()}>
    <Image
     source={require('../../assets/images/icons8-multiply-96.png')}
     style = {{ height: 27 , width:27, }}
    />
    </TouchableOpacity> :

    <TouchableOpacity  style = {styles.iconButton}
     onPress={ !data ? (()=>onSaveNote(this.state.noteTitle,this.state.noteDescription,this.currDate,this.currTime)) :
       (()=>onUpdateNote(data,this.state.noteTitle,this.state.noteDescription,this.currDate,this.currTime)) }>
    <Image
     source={require('../../assets/images/check.png')}
     style = {{ height: 22 , width:22, alignSelf:'center', marginTop:9 }}
    />
    </TouchableOpacity>
  }
    </>
  );
}
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor : '#fff',
    paddingVertical:10,
    paddingHorizontal:10,

  },
  appHeader : {
    ...Platform.select({
      android:{
      flex:1,
      justifyContent:'flex-end',
      alignItems:'center',
      maxHeight:90,
      backgroundColor : Colors.indigo500,
      width: DEVICE_WIDTH,
      },
      ios:{
        flex:1,
      justifyContent:'center',

      maxHeight:100,
      backgroundColor : Colors.indigo500,
      width: DEVICE_WIDTH,
      }
    })
  },
  iconButton : {
    ...Platform.select({
      android : {
        backgroundColor:'#219653',
        position: 'absolute',
        //alignSelf : 'flex-start',
        alignItems : 'center',
        justifyContent:'center',
        right:20,
        top:42,
        borderColor : '#ffff',

        height : 42,
        width : 42,
        borderRadius : 21
      },
      ios:{
        backgroundColor : '#219653',
        position : 'absolute',
        right:0,
        top:40,
        margin:10,
      }
    })

  },
  attatchmentButton : {
      ...Platform.select({
        android : {
          //backgroundColor : '#219653',
          position: 'absolute',
          marginRight: 20,
           right:40,
           marginTop : 35,
        },
        ios:{
          backgroundColor : '#219653',
          position : 'absolute',
          right:50,
          top:40,
          margin:10,
        }
      })
  },
  title : {
    fontSize : 20,
    marginBottom:16,
    backgroundColor : 'white'
  },
  updateTitle: {
    fontSize : 20,
    marginBottom:16,
    backgroundColor : 'white',
    height:100,
  },
  text: {
    maxHeight:400,
    fontSize:16,
    backgroundColor : 'white'
  },
  updateText: {
    maxHeight:300,
    fontSize:16,
    backgroundColor : 'white'
  },
  fab : {
    ...Platform.select({
      android : {
        backgroundColor : '#219653',
        position: 'absolute',

        left:10,
        top : 10,
      },
      ios:{
        backgroundColor : '#219653',
        position : 'absolute',
        left:0,
        top:40,
        margin:10,
      }
    })

  },
})

export default (AddNotes)
