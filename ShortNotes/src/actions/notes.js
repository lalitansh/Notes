import {ADD_NOTE,DELETE_NOTE,ARCHIVE_NOTE,
  SEARCHED_NOTES, ADD_ARRAY_NOTES, 
  ADD_ARRAY_ARCHIVE_NOTES,RESET_STATE,RESET_NOTE_STATE,RESET_ARCHIVE_STATE } from './types'

let id = 1;
export const add_Notes=(notes)=> (
{
type : ADD_NOTE,
data : notes
}
);

export const delete_Notes=(key)=> (
{
  type : DELETE_NOTE,
  key : key
}
)

export const archive_Notes=(notes)=> (
{
    type : ARCHIVE_NOTE,
    data : notes
}
)

export const searched_Notes=(notes)=> (
{
    type : SEARCHED_NOTES,
    data : notes
})

export const add_Array_Notes=(notes)=> (
{
    type : ADD_ARRAY_NOTES,
    data : notes
}
);
export const add_Array_Archive_Notes=(notes)=> (
{
    type : ADD_ARRAY_ARCHIVE_NOTES,
    data : notes
}
);

export const check_For_Empty=(result)=>({
    type : IS_EMPTY_OR_NOT,
    data : result
});

export const Reset_Note_State=()=>({
    type : RESET_NOTE_STATE,
});
export const Reset_Archive_State=()=>({
    type : RESET_ARCHIVE_STATE,
});
