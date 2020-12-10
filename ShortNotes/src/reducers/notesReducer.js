import {ADD_NOTE,DELETE_NOTE,ARCHIVE_NOTE,SEARCHED_NOTES,
  ADD_ARRAY_NOTES,ADD_ARRAY_ARCHIVE_NOTES,RESET_ARCHIVE_STATE,
RESET_NOTE_STATE} from '../actions/types';
const initialState = {
  archiveNotes : [],
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
      archiveNotes: [
        ...state.archiveNotes, action.data
      ]
    }
  case SEARCHED_NOTES : 
    return{
      ...state,
      filteredNotes: [
        ...state.filteredNotes, action.data
      ]
    }
    case ADD_ARRAY_NOTES : 
    return{
      ...state,
      notesList : [
        ...state.notesList, ...action.data
      ]
    }
    case ADD_ARRAY_ARCHIVE_NOTES : 
    return{
      ...state,
      archiveNotes : [
        ...state.archiveNotes, ...action.data
      ]
    }

    case RESET_NOTE_STATE : 
    return{
      ...state,
      notesList : initialState.notesList
    }

    case RESET_ARCHIVE_STATE : 
    return{
      ...state,
      archiveNotes : initialState.archiveNotes
    }

    

    default :
    return state;
  }
}

export default notesReducer;
