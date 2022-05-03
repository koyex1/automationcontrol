import { GIT_PUSH, GIT_PULL, GIT_PUSH_OK } from "../Constants/GitConstants";



export const gitPullReducer = ( state = {}, action) => {
    switch (action.type){
        case GIT_PULL:
            return action.payload
         default:
             return state;
    } 
 }


 export const gitPushReducer = ( state = {}, action) => {
    switch (action.type){
        case GIT_PUSH:
            return action.payload
         default:
             return state;
    } 
 }


 export const gitPushOKReducer = ( state = {}, action) => {
    switch (action.type){
        case GIT_PUSH_OK:
            return action.payload
         default:
             return state;
    } 
 }