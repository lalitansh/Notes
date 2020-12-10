import React,{Component} from 'react';
import {thiss,notThis} from './functions'
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Alert,
  Dimensions,
  Animated,
  UIManager,
  LayoutAnimation,
  Easing,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,

} from 'react-native';
import {Card,Snackbar} from 'react-native-paper';
import { any, string, bool,number } from 'prop-types';
import Colors from '../utils/Colors';
import {connect} from 'react-redux';
import {archive_Notes,add_Notes,add_Array_Notes,Reset_Note_State} from '../actions/notes';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Storage} from '../utils/Constants';
import {_setItem, _getItem} from './functions';






const DEVICE_WIDTH = Dimensions.get('window').width;

class ViewNotes extends React.Component {

constructor(props) {
  super(props)
  this.archiveNotes = []
  this.isFromUpdate = false
  this.spinValue = new Animated.Value(0)
  this.searchingText = '';
  this.newData = []
  
}

state = {
  animationValue : new Animated.Value(1),
  note : any,
  selectionMode : false,
  tempNote:[],
  searchBarActive : false,
  data : [],
  gridView : true,
  visible : false,
  isFromAddNote : false,
  onlyOnce : true
}


setOnFocus=async()=>{
  SplashScreen.hide()
  this.props.notes.forEach((item,i)=> {
    item.selected = false
  })
  this.setState({searchBarActive : false})
  this.setState({data:this.props.notes})

  // updating list after update existing searched note

  if(this.isFromUpdate) {
    this.setState({data:[]})
    this.newData = []
    this.textInput.clear()
    this.setState({data:this.props.notes})
    this.setState({searchBarActive:false})
    this.isFromUpdate = false
  }
}



shouldComponentUpdate(){
  if (this.props.notes.length > 0) {
    console.log('this.prop',this.props.notes)
  }
  return true;
}

async componentWillUnmount(){
  
  //console.log('called componentWillUnmount ViewNotes')
 // await AsyncStorage.removeItem('mainNotes')
}

componentDidMount(){
  
  this.focusListener = this.props.navigation.addListener('focus', () => {
    this.setOnFocus()
    //console.log('called ComponentDidMount On Focus')
   
  })
  thiss()
  notThis()
  this.setLocalDb()
}

// Initially setting value of local database

setLocalDb =async()=> {
  let get = await _getItem() 
  console.log('get',get)  
}

 // update Async storage data 

 updateAsyncStorage=async()=>{
  _setItem(this.props.notes)
   
}

render() {

  // Select item After Long press

  const toggleSelect = async (item)=>{

      this.setState({selectionMode : true})
      //console.log('from LongPress',item)

        this.props.notes.map(i => {
          if (item === i){
            i.selected = !i.selected;
            if (i.selected){
             this.setState({tempNote:[...this.state.tempNote,item]})
            }else{
              var index = this.state.tempNote.indexOf(item)
              this.state.tempNote.splice(index,1) // Delete item after Deselet from Array
              var len = this.state.tempNote.length;
              if(len == 0 ){
                this.setState({selectionMode : false})
              }
            }
          }
          return i;
        })
  };

  // Start searching after onChangeText in searchBar

 const searchFilterFunction =  (text) => {
    this.searchingText = text

    if(!this.isFromUpdate){
      if (this.searchingText.length > 0) {
          this.newData =  this.props.notes.filter(item => {
            const itemData = `${item.noteTitle.toUpperCase()}

            ${item.noteDescription.toUpperCase()}`;

              const textData = this.searchingText.toUpperCase();

              return itemData.indexOf(textData) > -1;

          });
            this.setState({ data: this.newData });

    }else {
      this.setState({ data: this.props.notes });
      }
    }
  };

  // onPress event Fired

  const onPress =item=>{
    if (this.state.selectionMode){ //called when if item already selected
      toggleSelect(item);
    }else{
      pressItem(item);
      this.props.navigation.navigate('AddNotes', {updateNote, item}) // called when no item selected
    }
  }

  // Long press event fired for selectionMode On

  const onLongPress =item=> {
    if (this.state.selectionMode===false){
      toggleSelect(item);
    }
  };

  const pressItem=item=>{
    console.log(JSON.stringify(item) + "pressed");
  }

  const showHideSnack=()=>{

    this.setState({visible:true})
        setTimeout(() => {
          this.setState({
            visible: false
          });
        }, 1200);
  }


  //Add New Note
    const addNotes=(note)=> {
        
        this.props.addToNotes(note)
          this.setState({isFromAddNote:true})
          this.updateAsyncStorage()
          this.shouldComponentUpdate();
        showHideSnack()
  }

  // Edit and Update Existing Note

  const updateNote = (note) => {

    const index = this.props.notes.indexOf(note.id);
    this.props.notes.splice(index, 1);

    this.props.addToNotes(note)
    this.setState({data: this.props.notes})
    

    if (this.state.searchBarActive){
      if(this.newData.length > 0) {
        this.isFromUpdate = true
      }else{
        console.log('this.newData.length',this.newData.length)
      }
    }else{
      this.isFromUpdate = false
      this.setState({searchBarActive:false})
    }

    if(this.state.isFromAddNote){
      this.setState({isFromAddNote:false})
    }

    showHideSnack()

    this.updateAsyncStorage()
  }

  // Remove Item from Notes

  const removeItem = () => {
    deleteNote()
  }

  // Delete Note From Notes

  const deleteNote=async()=>{

    for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
      for (var j = 0, len2 = this.props.notes.length; j < len2; j++) {
          if (this.state.tempNote[i].id === this.props.notes[j].id)  {

                            this.spinValue.setValue(0)
                              Animated.timing(
                                this.spinValue,
                                {
                                  toValue: 1,
                                  duration: 500,
                                  useNativeDriver: true,
                                  easing: Easing.linear
                                }
                              ).start()
                              this.props.notes.splice(j, 1)

                              break;

              }
          }
      }

      for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
        for (var j = 0, len2 = this.state.data.length; j < len2; j++) {
            if (this.state.tempNote[i].id === this.state.data[j].id)  {

                          this.state.data.splice(j, 1)

                           break;

                }
            }
        }

   // transfor value in searchable array
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  this.setState({selectionMode:false})
  this.setState({tempNote: []})
  this.updateAsyncStorage()
  }


// Alert for delete Note

  const confirmDelete=()=>{
    Alert.alert(
      'Delete !!',
      'Do you really want to delete this note!!',
      [
        {
          text : 'cancel',
          onPress : ()=>console.log('cancel Pressed and total notes',this.props.notes),
          style : 'cancel'
        },
        {
          text : 'Ok',
          onPress : ()=>{removeItem()},
        }
      ]
    )
  }

  const archiveArray= async ()=> {

    try {
      this.archiveNotes = this.state.tempNote
      this.archiveNotes.forEach((item,i)=> {
        item.selected = false;
        this.props.addToArchive(item)
      })

      this.setState({data:this.state.data})

       // transfor value in searchable array
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({selectionMode:false})
      this.setState({tempNote: []})
      this.archiveNotes = []

      for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
        for (var j = 0, len2 = this.props.notes.length; j < len2; j++) {
            if (this.state.tempNote[i].id === this.props.notes[j].id)  {
                                this.props.notes.splice(j, 1)
                                len2=this.state.tempNote.length;
                                break;
                }
            }
        }

        for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
          for (var j = 0, len2 = this.state.data.length; j < len2; j++) {
              if (this.state.tempNote[i].id === this.state.data[j].id)  {

                            this.state.data.splice(j, 1)
                            len2=this.state.tempNote.length;
                             break;

                  }
              }
          }

          await AsyncStorage.setItem(Storage.Archive,JSON.stringify(this.props.archiveNotes))
          .then(json => console.log('success !', json))
          .catch(error => console.log('error in storing',error))

      this.updateAsyncStorage()

    }catch(err){
      console.log('error...',err)
    }
  }

  // Searching

  const handleSearch=()=> {
    if (!this.state.searchBarActive){
      this.setState({searchBarActive:true})
      this.setState({data:this.props.notes})
    }else{
      this.setState({searchBarActive:false})
    }
  }

  const changeUi=()=> {
    if(this.state.gridView) {
      this.setState({gridView:false})
    }else{
      this.setState({gridView:true})
    }

  }

  const openDrawer=()=> {
    this.props.navigation.toggleDrawer();
  }

  const spin = this.spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  return(
      <>
      
{!this.state.selectionMode ?
    <View style = {styles.appHeader}>

   <View style = {{width : 100,backgroundColor : Colors.indigo500, flex : 1,justifyContent : 'center',marginBottom : 15, height : '100%'}}>
    {/* marginLeft : (DEVICE_WIDTH/3) + 10}}> */}


    <TouchableOpacity  style = {{ left : 20,  height: 30, width : 30,alignSelf : 'flex-start', top:40  }}
     onPress={openDrawer}>
    <Image
     source={require('../../assets/images/icons8-menu.png')}
     style = {{ height: 25 , width:25,  }}
    />
    </TouchableOpacity>


      <Text style = {{marginLeft : (DEVICE_WIDTH/4),alignSelf : 'center', fontSize : 17,fontWeight:'400', color : 'white', marginTop : 10}}>Short Notes</Text>

   </View>

    <View style = {{
      flex : 3/10,
      flexDirection : 'row' ,
      backgroundColor :Colors.indigo500,
      justifyContent:'flex-end'}}>



    <TouchableOpacity  style = {{height: 40, width : 40,alignSelf : 'flex-end',marginRight : 2  }}
    onPress={changeUi}>
    {
      this.state.gridView ? <Image
      source={require('../../assets/images/equal.png')}
      style = {{ height: 26 , width:23, marginTop:2, alignSelf:'center', }}
     /> : <Image
      source={require('../../assets/images/icons8-grid-white.png')}
      style = {{ height: 27 , width:25, marginTop:2, alignSelf:'center',}}
     />
    }
    </TouchableOpacity>

    <TouchableOpacity  style = {{  height: 40, width : 40,alignSelf : 'flex-end', marginRight : 2  }}
    onPress={handleSearch}>
    <Image

     source={require('../../assets/images/icons8-search-white.png')}
     style = {{ height: 23 , width:23, alignSelf:'center', top : 2 }}
    />
    </TouchableOpacity>

    </View>

    </View> :

    <View style = {styles.appHeader}>
   <View style = {{flex : 1,justifyContent : 'flex-end', alignItems : 'center',marginBottom : 15, marginLeft : (DEVICE_WIDTH/3) + 10}}>

   <Text style = {{fontSize : 17,fontWeight:'400', color : 'white'}}>{this.state.tempNote.length} selected</Text>

   </View>

    <View style = {{
      flex : 1,
      flexDirection : 'row' ,
      backgroundColor :Colors.indigo500,
      justifyContent:'flex-end'}}>

    <TouchableOpacity  style = {{  height: 40, width : 40,alignSelf : 'flex-end', marginRight : 2  }}  onPress={archiveArray}>
    <Image

     source={require('../../assets/images/archive_white_96x96.png')}
     style = {{ height: 23 , width:23, alignSelf:'center', top : 4 }}
    />
    </TouchableOpacity>
    <TouchableOpacity  style = {{  height: 40, width : 40,alignSelf : 'flex-end', marginRight : 2  }}  onPress={confirmDelete}>
    <Image

     source={require('../../assets/images/icons8-delete.png')}
     style = {{ height: 23 , width:23, alignSelf:'center', top : 2 }}
    />
    </TouchableOpacity>

    </View>

    </View>
  }

    {this.state.searchBarActive &&
     <View style = {{backgroundColor: Colors.indigo500, alignItems : 'center'}}>
    <TextInput
      ref={input => { this.textInput = input }}
      placeholder="Search"
      onChangeText={(text)=> searchFilterFunction(text)}
      //value={searchQuery}
      //icon='close'
      clearIcon = 'delete'
      clearButtonMode='always'
      style = {styles.searchBar}
      autoFocus = {this.state.searchBarActive ? true : false}
      />
      </View>
    }

    <View style = {styles.container}>
      {this.props.notes.length == 0 ? (
      <View style = {styles.titleContainer}>
      <AntDesign name = 'delete' size = {DEVICE_WIDTH/3} color = {Colors.indigo100} />
      <Text style = {styles.title}>
        No Notes in List !
      </Text>
      <Text style = {styles.endHeading}>
        -By Lalitansh
      </Text>
      <View>
    </View>

    </View> ) : (

        <FlatList
       keyExtractor={(item) => item.id }

        numColumns={this.state.gridView ? 2 : 1}
        key={(this.state.gridView ? 'h' : 'v')}
        horizontal={false}
        data={ !this.state.searchBarActive ?  this.props.notes.sort(function(a, b) {
          return a.date + a.time  < b.date + b.time
        }) : this.state.data.sort(function(a, b) {
          return a.date + a.time  < b.date + b.time
        }) }

      renderItem={({item, index}) =>{
          return(
    
            <Card

              style = { this.state.gridView ?  [styles.myCardNormal,{backgroundColor: item.selected ? Colors.APP_GRAY :'white'  }] :  [styles.myListCard,{backgroundColor: item.selected ? Colors.APP_GRAY :'white'  }] }  key={index}  onLongPress = {()=> onLongPress(item)} onPress = {()=> onPress(item) } >
              {item.selected && this.state.gridView ?
              <AntDesign style = {{alignSelf:'flex-end', position:'absolute' }} name = 'checkcircle' size = {30} color = {Colors.indigo800} /> :
              null
              }
             <Animated.View style = {{flex:1,alignItems: 'flex-start',marginLeft : 10, transform: [{rotate: spin}] }}>
             
             <Text numberOfLines = {1} style = {styles.noteTitleText}>{item.noteTitle}</Text>
             <Text ellipsizeMode = 'tail' numberOfLines = {this.state.gridView ? 5 : 1} style = { this.state.gridView ? styles.descTextGrid : styles.descTextList }>{item.noteDescription}</Text>
             <View style = {this.state.gridView ? styles.dateParentGridView : styles.dateParentListView}>
             <Text style = {this.state.gridView ? styles.dateGrid : styles.dateList}>{item.date}</Text>
             {this.state.gridView ?
            <Text style = {styles.timeGrid}>{item.time}</Text>
            :
            <Text></Text>
            }
            </View>
             </Animated.View>
             </Card>
            

          )
          }
      }
        />
      )
}

<TouchableOpacity  style = {styles.fab}
 onPress={()=> this.props.navigation.navigate('AddNotes',{addNotes})}>
<Image
 source={require('../../assets/images/icons8-plus-96.png')}
 style = {{ height: 25 , width:25, }}
/>
</TouchableOpacity>


        <View style = {styles.modal}>
        <Snackbar style = {{marginLeft : -10}}
          visible={this.state.visible}
          > {this.state.isFromAddNote ? 'note has been added' :' note has been updated' }
          {/* <Text>Hello Snackbar</Text> */}
        </Snackbar>
        </View>
    </View>
   </>
  );
}
}


const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor : '#f4f4f6',
     paddingVertical: 10,
     paddingHorizontal: 10,
  },
  appHeader : {
    ...Platform.select({
      android:{
        flex:1,
      flexDirection : 'row',
      maxHeight:90,
      backgroundColor : Colors.indigo500,
      width: DEVICE_WIDTH,
      },
      ios:{
        flex:1,
      flexDirection : 'row',
      maxHeight:100,
      backgroundColor : Colors.indigo500,
      width: DEVICE_WIDTH,
      }
    })

  },
  noteTitleText:{
    marginBottom:13, 
    marginTop:5, 
    fontSize : 17, 
    fontWeight : '500',
    width :'60%',
  },
  titleContainer : {
    alignItems:'center',
    justifyContent:'center',
    flex:1,

  },
  searchBar : {
    height : 50,
    backgroundColor:'white',
    width : '98%',
    fontSize : 16,
    margin : '1%'
    //marginRight : 20,
  },
  title : {
    fontSize : 15,
  },
  parent: {
    width: '100%',
    flexDirection : 'row',
    flexWrap : 'wrap',
  },
  dateGrid : {

    ...Platform.select({
      default : {
        textAlign : 'right',
        fontSize:13,
        fontWeight:'200',
        color : Colors.grey500
      }
    })
  },
  timeGrid : {
    ...Platform.select({
      default: {
        fontSize:12,
        fontWeight:'200',
        marginRight : 3,
        color : Colors.grey500
      }
    })
  },

  dateList : {
    fontSize:13,
    fontWeight:'200',
    marginRight : 5,
    marginTop : 2,
    color : Colors.grey500
  },
  dateParentGridView: {
    justifyContent : 'flex-end',
    alignContent:'flex-end',
    alignSelf : 'flex-end',
    marginRight : 5,
    marginBottom:5,

  },
  dateParentListView: {
    position : 'absolute',
    justifyContent : 'flex-start',
    alignContent:'flex-end',
    alignSelf : 'flex-end',
    marginRight : 5,

  },
  child: {
    width: '48%',
    margin: '1%',
    aspectRatio: 1,
  },
  fab : {
    backgroundColor:Colors.indigo300, //#219653
    position: 'absolute',
    alignSelf : 'flex-end',
    alignItems : 'center',
    justifyContent:'center',
    right:30,
    bottom:42,
    borderColor : '#ffff',
    height : 60,
    width : 60,
    borderRadius : 30,
    elevation: 5,
  },
  listTitle : {
    fontSize : 20,
  },
  descTextGrid : {

    ...Platform.select({
      android : {
        flex:1,
        marginRight : 10,
        paddingRight : 10,
      },
      default : {
        flex:1,
        marginRight : 10,
        paddingRight : 10,
      }
    })
  },
  descTextList : {
    marginRight : 25,
    paddingRight : 25
  },
  cardParentGridView : {
    borderRadius : 10,
    backgroundColor:Colors.white,
    //borderWidth : 0.3,
    borderColor: Colors.green3000,
    borderWidth : 0.3,
    width: '48%',
    margin: '1%',
    aspectRatio: 1,
    ...Platform.select({
      default : {
        shadowColor: '#6b6162',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.60,
        shadowRadius: 5,
        elevation: 5,
      }
    })
  },
cardParentListView : {
  borderRadius : 5,
  backgroundColor:'white',
  borderWidth : 0.3,
  width: '98%',
  marginTop: '1.7%',
  aspectRatio: 5/1,
  ...Platform.select({
    default : {
      shadowColor: '#6b6162',
      shadowOffset: {
      width: 1,
      height: 0.5,
      },
      shadowOpacity: 0.60,
      shadowRadius: 5,
      elevation: 7,
    }
  })
},
myCardNormal: {
  ...Platform.select({
    default : {
      borderRadius : 10,
  backgroundColor:Colors.white,
  //borderColor: Colors.black,
  //borderWidth : 0.3,
  width: '48%',
  margin: '1%',
  aspectRatio: 1, 
  shadowColor: '#6b6162',
  shadowOffset: {
    width: 0,
    height: 7,
  },
  shadowOpacity: 0.60,
  shadowRadius: 5,
  elevation: 5,
    }
  })
  
},
    myListCard : {
      borderRadius : 5,
      backgroundColor:'white',
      borderWidth : 0.3,
      width: '98%',
      marginTop: '1.7%',
      aspectRatio: 5/1,
      ...Platform.select({
        default : {
          shadowColor: '#6b6162',
          shadowOffset: {
          width: 1,
          height: 0.5,
          },
          shadowOpacity: 0.60,
          shadowRadius: 5,
          elevation: 7,
        }
      })
    },
  myCardSelected: {
      //padding : 5,
      ...Platform.select({
        android: {
          backgroundColor:'red',
          borderWidth : 0.3,
        }
      })
  },
    noteBorder : {
      borderBottomColor : 'black',
      borderTopColor : 'black',
      borderWidth : 0.3,
      paddingTop:5,
      paddingBottom:5,
      alignSelf: 'stretch',
    },
    headerCount : {

    },
    modal: {
      width: '63%',
      justifyContent:'flex-start',
      //backgroundColor : 'black',
      aspectRatio : 6/1,
      position : 'absolute',
      left:-10,
      top:-30,
      margin : 5,
      paddingVertical:-10,
    },
    endHeading : {
      bottom : 30, 
      left:10, 
      position:'absolute', 
      fontSize:15, 
      fontWeight:'800',
     fontFamily : 'serif'
    }
});


const mapStateToProps = (state) => {
  console.log('add Note state',state);
  return {
    archiveNotes : state.notesReducer.archiveNotes,
    notes : state.notesReducer.notesList
  }
}

const mapDispatchToProps = dispatch => {
  //console.log(state);
  return {
    addToArchive : (notes) => dispatch(archive_Notes(notes)),
    addToNotes : (note) => dispatch(add_Notes(note)),
    addArrayToNotes : (note) => dispatch(add_Array_Notes(note)),
    ResetNoteState : ()=> dispatch(Reset_Note_State()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps) (ViewNotes)
