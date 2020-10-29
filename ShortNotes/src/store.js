import {createStore,combineReducers} from 'redux';
import notesReducer  from './reducers/notesReducer';

const rootReducer = combineReducers({
  notesReducer: notesReducer
})

const configureStore =()=> createStore(rootReducer)

export default configureStore;

