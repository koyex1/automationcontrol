import axios from "axios";
import { LOCALHOST, Jenkinstoken } from "../Constants/constants";
import {START_JENKINS, START_JENKINS_FAILS} from "../Constants/JenkinsConstants";



export const startJenkinsActions = (featureKey) => async(dispatch) =>{
try{
    let FeatureFile = '@' + featureKey;
    await axios.post(`${LOCALHOST}/job/AutomationTest/buildWithParameters`,{FeatureFile}, 
     {
        headers: {
          "Authorization": 'Basic ' + Jenkinstoken
        }
       });
    dispatch({type: START_JENKINS, payload : {running: true, message: null} });
}catch(error){
	//action.type and action.payload
    dispatch({
        type: START_JENKINS_FAILS,
        payload: {running: false, message: error.message}, 
    }
    )
}

};

