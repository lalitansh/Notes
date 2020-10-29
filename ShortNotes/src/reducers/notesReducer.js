import {ADD_NOTE,DELETE_NOTE,ARCHIVE_NOTE,SEARCHED_NOTES,UNARCHIVE_NOTES} from '../actions/types';
const initialState = {
  notes : [],
  filteredNotes:[],
  notesList : [],
}

const notesReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_NOTE : 
    return{
      ...state,
      notesList: [
        ...state.notesList, action.data
      ]
    }
   
    case DELETE_NOTE : 
      return{
        ...state,
        notesList: state.notesList.filter((item) => 
        item.key !== item.key)
    }

    case ARCHIVE_NOTE : 
    return{
      ...state,
      notes: [
        ...state.notes, action.data
      ]
    }
  case SEARCHED_NOTES : 
    return{
      ...state,
      filteredNotes: [
        ...state.filteredNotes, action.data
      ]
    }
    case UNARCHIVE_NOTES : 
    return{
      ...state,
      notesList: [
        ...state.notesList, action.data
      ]
    }
    
    default :
    return state;
  }
}

export default notesReducer;
