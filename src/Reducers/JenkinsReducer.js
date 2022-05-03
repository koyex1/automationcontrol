import { START_JENKINS, START_JENKINS_FAILS } from "../Constants/JenkinsConstants";
import { GIT_PUSH, GIT_PULL } from "../Constants/GitConstants";



export const startJenkinsReducer = ( state = {}, action) => {
    switch (action.type){
        case START_JENKINS:
            console.log(action.payload)
            return {state: action.payload};
        case  START_JENKINS_FAILS:
            return {state: action.payload};
         default:
             return state;
    } 
 }