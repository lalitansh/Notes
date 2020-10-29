import React,{Component} from 'react';
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
import {Card, FAB, Appbar,Snackbar,Provider} from 'react-native-paper';
import archiveNotes from './ViewNotes';
import { any, string, bool,number } from 'prop-types';
import { darkorange } from 'color-name';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons';
//import AsyncStorage from '@react-native-community/async-storage'
import {connect} from 'react-redux';
import {searched_Notes,archive_Notes,unarchive_Notes} from '../actions/notes'


const DEVICE_WIDTH = Dimensions.get('window').width;

class ArchiveNotes extends React.Component {

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
  noteBook : [],
  note : any,
  selectionMode : false,
  searchText : '',
  tempNote:[],
  searchBarActive : false,
  data : [],
  gridView : true,
  visible : false,
}

setOnFocus=async()=>{
  this.props.archiveNotes.forEach((item,i)=> {
    item.selected = false
    item.id = i+1;
  })
  this.setState({noteBook:this.props.archiveNotes})
  this.setState({searchBarActive:false})
  if(this.isFromUpdate) {
    this.setState({noteBook:[]})
    this.newData = []
    this.textInput.clear()
    this.setState({noteBook:this.props.archiveNotes})
    this.setState({searchBarActive:false})
    this.isFromUpdate = false
  }
}

componentWillUnmount(){
  console.log('called componentWillUnmount')
}

 componentDidMount(){
  this.focusListener = this.props.navigation.addListener('focus', () => {
    this.setOnFocus()
    console.log('called ComponentDidMount')

  })

}

render() {

  const toggleSelect = async (item)=>{

      this.setState({selectionMode : true})

        this.props.archiveNotes.map(i => {
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

          this.newData =  this.props.archiveNotes.filter(item => {
            const itemData = `${item.noteTitle.toUpperCase()}

            ${item.noteDescription.toUpperCase()}`;

              const textData = this.searchingText.toUpperCase();

              return itemData.indexOf(textData) > -1;

          });
          this.setState({noteBook:this.newData})
    }else {
     this.setState({noteBook:this.props.archiveNotes})
      }
    }
  };

  // onPress event Fired

  const onPress =item=>{
    if (this.state.selectionMode){ //called when if item already selected
      toggleSelect(item);
    }else{
      pressItem(item);
      this.props.navigation.navigate('updateNote', {updateNote, item}) // called when no item selected
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

  // Edit and Update Existing Note

  const updateNote = (note) => {

    this.props.archiveNotes.sort(function(a, b) {
      return a.id > b.id
    })

    this.props.archiveNotes.splice(note.id - 1, 1);

    this.props.addToArchive(note)

    this.setState({noteBook: this.props.archiveNotes})

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

    showHideSnack()
    //makeNewNotesByRegularId();
  }


  // Remove Item from Notes

  const removeItem = () => {
    deleteNote()
  }

  // Delete Note From Notes

  const deleteNote=async()=>{
  try {
    for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
      for (var j = 0, len2 = this.props.archiveNotes.length; j < len2; j++) {
          if (this.state.tempNote[i].id === this.props.archiveNotes[j].id)  {

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
                              this.props.archiveNotes.splice(j, 1)

                              break;

              }
          }
      }

      for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
        for (var j = 0, len2 = this.state.noteBook.length; j < len2; j++) {
            if (this.state.tempNote[i].id === this.state.noteBook[j].id)  {
                                this.state.noteBook.splice(j, 1)

                                break;

                }
            }
        }

   makeNewNotesByRegularId();

   // transfor value in searchable array
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  this.setState({selectionMode:false})
  this.setState({tempNote: []})
  }catch(err){
    console.log(err)
  }
  }


  // Update with new Id Notes after deleting Notes

  const makeNewNotesByRegularId=()=> {
    this.props.archiveNotes.forEach((item, i) => {
      item.id = i + 1; // providing note id in noteBook array
    });
  }

// Alert for delete Note

  const confirmDelete=()=>{
    Alert.alert(
      'Delete !!',
      'Do you really want to delete this note!!',
      [
        {
          text : 'cancel',
          onPress : ()=>console.log('cancel Pressed and total noteBook',this.state.noteBook),
          style : 'cancel'
        },
        {
          text : 'Ok',
          onPress : ()=>{removeItem()},
        }
      ]
    )
  }

  const unarchiveArray=async()=> {

    try {
      this.archiveNotes = this.state.tempNote
      this.archiveNotes.forEach((item,i)=> {
        item.selected = false;
        this.props.addToUnarchive(item)
      })

      this.setState({selectionMode:false})
      this.setState({tempNote: []})
      this.archiveNotes = []

      for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
        for (var j = 0, len2 = this.props.archiveNotes.length; j < len2; j++) {
            if (this.state.tempNote[i].id === this.props.archiveNotes[j].id)  {
                                this.props.archiveNotes.splice(j, 1)
                                len2=this.state.tempNote.length;
                                break;
                }
            }
        }

        for (var i = 0, len = this.state.tempNote.length ; i < len; i++) {
          for (var j = 0, len2 = this.state.noteBook.length; j < len2; j++) {
              if (this.state.tempNote[i].id === this.state.noteBook[j].id)  {

                            this.state.noteBook.splice(j, 1)
                            len2=this.state.tempNote.length;
                             break;
                  }
              }
          }

    makeNewNotesByRegularId();

     // transfor value in searchable array
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);


    }catch(err){
      console.log(err)
    }
  }

  // Searching

  const handleSearch=()=> {
    if (!this.state.searchBarActive){
      this.setState({searchBarActive:true})
      this.setState({noteBook:this.props.archiveNotes})
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


    <TouchableOpacity  style = {{left : 20,  height: 30, width : 30,alignSelf : 'flex-start', top:40  }}
     onPress={openDrawer}>
    <Image
     source={require('../../assets/images/icons8-menu.png')}
     style = {{ height: 25 , width:25,  }}
    />
    </TouchableOpacity>


      <Text style = {{marginLeft : (DEVICE_WIDTH/4),alignSelf : 'center', fontSize : 17,fontWeight:'400', color : 'white', marginTop : 10}}>Archive Notes</Text>

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
      style = {{ height: 26 , width:23, alignSelf:'center',}}
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
      flexDirection : 'row',
      backgroundColor :Colors.indigo500,
      justifyContent:'flex-end'}}>

    <TouchableOpacity  style = {{  height: 40, width : 40,alignSelf : 'flex-end', marginRight : 2  }}  onPress={unarchiveArray}>
    <Image

     source={require('../../assets/images/unarchive_white_96x96.png')}
     style = {{ height: 23 , width:23, alignSelf:'center', top : 2 }}
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
      onChangeText={(text)=> searchFilterFunction(this.state.searchText = text)}
      //value={searchQuery}
      //icon='close'
      clearIcon = 'delete'
      clearButtonMode='always'
      style = {styles.searchBar}
      />
      </View>
    }

    <View style = {styles.container}>
      {this.props.archiveNotes.length == 0 ? (
      <View style = {styles.titleContainer}>
      <Text style = {styles.title}>
        Archive Notes is Empty !!
      </Text>
      <View>

    </View>

    </View> ) : (



        <FlatList
       keyExtractor={(item) => item.id.toString() }

        numColumns={this.state.gridView ? 2 : 1}
        key={(this.state.gridView ? 'h' : 'v')}
        horizontal={false}
        data= { !this.state.searchBarActive ?  this.props.archiveNotes.sort(function(a, b) {
          return a.date + a.time  < b.date + b.time
        })  :   this.state.noteBook.sort(function(a, b) {
            return a.date + a.time  < b.date + b.time
          }) }

      renderItem={({item, index}) =>{
          return(

            <View style = {this.state.gridView ? styles.cardParentGridView : styles.cardParentListView }>

            <Card

              style = { this.state.gridView ? [styles.myCardNormal,{backgroundColor: item.selected ? Colors.APP_GRAY :'white'  }] : [styles.myListCard,{backgroundColor: item.selected ? Colors.APP_GRAY :'white'  }] }  key={index}  onLongPress = {()=> onLongPress(item)} onPress = {()=> onPress(item) } >

             <Animated.View style = {{ flex:1,alignItems: 'flex-start',marginLeft : 10, transform: [{rotate: spin}] }}>
             <Text numberOfLines = {1} style = {{marginBottom:13, marginTop:5, fontSize : 17, fontWeight : '500',width :'60%'}}>{item.noteTitle}</Text>
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
             </View>

          )
          }
      }
        />


      )
}

        <View style = {styles.modal}>
        <Snackbar
          visible={this.state.visible}
          > {'Archive note has been updated' }

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
    backgroundColor : 'white',
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
    fontSize : 20,
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
      }
    })
  },
  timeGrid : {
    ...Platform.select({
      default: {
        fontSize:12,
        fontWeight:'200',
        marginRight : 3
      }
    })
  },

  dateList : {
    fontSize:13,
    fontWeight:'200',
    marginRight : 5,
    marginTop : 2,
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
    backgroundColor:'#219653',
    position: 'absolute',
    alignSelf : 'flex-end',
    alignItems : 'center',
  //  margin : 20,
    right:30,
    bottom:35,
    borderColor : '#ffff',
    borderWidth : 4,
    height : 60,
    width : 60,
    borderRadius : 30
        // height:70,
    // width:70,
    // borderRadius:35,
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
    backgroundColor:'white',
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
    //padding : 5,
    ...Platform.select({
      android : {
          flex:1,
        //backgroundColor : 'red',
        width: '98%',
        margin: '1%',
        aspectRatio: 1,

      },
      ios : {
        flex:1,
    //  backgroundColor :
      width: '98%',
      margin: '1%',
      aspectRatio: 1,

      }
    })
  },
    myListCard : {
    //  backgroundColor:
     // borderWidth : 0.3,
      width: '99.5%',
      height : '99%',

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
      width: '60%',
      justifyContent:'flex-start',
      //backgroundColor : 'black',
      aspectRatio : 6/1,
      position : 'absolute',
      left:-10,
      top:-30,
      margin : 5,
    },
});

const mapStateToProps= (state) => {
  console.log('archive Note state',state)
  return{
    searchedNotes : state.notesReducer.filteredNotes,
    archiveNotes : state.notesReducer.notes,
    notes : state.notesReducer.notesList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addToSearched : (not) => dispatch(searched_Notes(not)),
    addToArchive : (notes) => dispatch(archive_Notes(notes)),
    addToUnarchive : (notes) => dispatch(unarchive_Notes(notes))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ArchiveNotes);
