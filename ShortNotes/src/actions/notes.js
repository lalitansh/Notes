import {ADD_NOTE,DELETE_NOTE,ARCHIVE_NOTE,SEARCHED_NOTES,UNARCHIVE_NOTES } from './types'

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
  export const unarchive_Notes=(notes)=> (
    {
        type : UNARCHIVE_NOTES,
        data : notes
    })