import axios from "axios";
import { Jenkinstoken, LOCALHOST, SPRING_LOCALHOST } from "../Constants/constants";
import { RUN_AUTOMATION, AUTOMATION_FAILS, RUN_INVALID, STOP_AUTOMATION, STOP_AUTOMATION_FAILS } from "../Constants/RunConstants";



export const runActions = (featureKey) => async (dispatch) => {
    try {

        let FeatureFile = '@' + featureKey;
        let found1 = false;

        await axios.get('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features',
            {
                headers: {
                    "Accept": 'application/vnd.github.v3+json'
                }
            }).then(dirFiles => {
                found1 = dirFiles.data.some(x => {
                    return x.name == featureKey + '.feature'
                })
            })
        console.log("found")
        console.log(found1)


        if (!found1) {
            dispatch({ type: RUN_INVALID, payload: { running: "stop", runMessage: "E2E does not exist" } });
        }
        else {
            //start jenkins job and springboot
            console.log("debugging here")
            //`${LOCALHOST}/job/AutomationTest/buildWithParameters
            dispatch({ type: RUN_AUTOMATION, payload: { running: "run", runMessage: null } });
            axios.post(`${LOCALHOST}/job/AutomationTest/build`, { FeatureFile },
                {
                    headers: {
                        "Authorization": 'Basic ' + Jenkinstoken
                    }
                });
            // setTimeout(() => {
            //   axios.get(`${SPRING_LOCALHOST}/start/${featureKey}`);
            //}, 15000);
        }

    } catch (error) {
        //action.type and action.payload
        dispatch({
            type: RUN_AUTOMATION,
            payload: { running: "fail", runMessage: error.message },
        }
        )
    }

};
//http://<Jenkins_URL>/job/AutomationTest/42/stop     job/AutomationTest/lastBuild/stop

export const stopActions = (featureKey) => async (dispatch) => {
    try {
        let FeatureFile = '@' + featureKey;
        await fetch(`http://localhost:8080/job/AutomationTest/lastBuild/stop`, {
            method: "POST", 
            headers: {
                "Authorization": "Basic " + Jenkinstoken,
                 },
        })
        dispatch({ type: RUN_AUTOMATION, payload: { running: "stop", runMessage: null } });
    } catch (error) {
        //action.type and action.payload
        console.log("inside catch")
        console.log(error.message)
        dispatch({
            type: RUN_AUTOMATION,
            payload: { running: "stop", runMessage: null },
        }
        )
    }

};

export const failActions = () => async (dispatch) => {
    try {
         dispatch({ type: RUN_AUTOMATION, payload: { running: "stop", runMessage: null } });
    } catch (error) {
        dispatch({
            type: RUN_AUTOMATION,
            payload: { running: "stop", runMessage: null },
        }
        )
    }

};

export const successActions = () => async (dispatch) => {
    try {
         dispatch({ type: RUN_AUTOMATION, payload: { running: "stop", runMessage: null } });
    } catch (error) {
        dispatch({
            type: RUN_AUTOMATION,
            payload: { running: "stop", runMessage: null },
        }
        )
    }

};


