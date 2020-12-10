import AsyncStorage from '@react-native-community/async-storage'
import {Storage} from '../utils/Constants'


export function thiss(){
  console.log('heello')
}

export function notThis(){
  console.log('notThis')
}

export const _setItem = (data)=>{
return new Promise((resolve,reject)=>{
     AsyncStorage.setItem(Storage.Notes,JSON.stringify(data)).then((res)=>{
      console.log('data',res)
      resolve(res)
    }).catch(err => {
      console.log('add user_data local storage auth file', err);
      reject(err);
    });
  
})
}

export const _getItem = ()=>{
  return new Promise((resolve,reject)=>{
       AsyncStorage.getItem(Storage.Notes).then((res)=>{
        console.log('data',res)
        resolve(JSON.parse(res))
      }).catch(err => {
        console.log('get user_data local storage auth file', err);
        reject(err);
      });
  })
  }