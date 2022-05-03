import axios from "axios";
import { LOCALHOST, othertoken } from "../Constants/constants";
import { GIT_PUSH, GIT_PUSH_OK, GIT_PULL, UNDECIDED } from "../Constants/GitConstants";


export const gitPullAction = (featureKey) => async (dispatch) => {
    try {
        let FeatureFile = featureKey + '.feature';
        let found1 = false;

        await axios.get('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features',
            {
                headers: {
                    "Accept": 'application/vnd.github.v3+json'
                }
            }).then(dirFiles => {
                    found1 = dirFiles.data.some(x => {
                    return x.name == FeatureFile
                })
            })


            if (!found1) {
                dispatch({ type: GIT_PULL, payload: {pullMessage: "E2E does not exist", e2eContent: null, envDSContent: null } });
            }
        
        else{
            
        axios.all([
            await axios.get(`https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features/${FeatureFile}`,
                {
                    headers: {
                        "Accept": 'application/vnd.github.v3+json'
                    }
                }),
            await axios.get('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/java/environmentVariables.yaml',

                {
                    headers: {
                        "Accept": 'application/vnd.github.v3+json'
                    }
                })
        ]).then(axios.spread((datae2e, dataenvds) => {


            dispatch({ type: GIT_PULL, payload: {pullMessage: "E2E loaded", e2eContent: decodeURIComponent(escape(atob(datae2e.data.content))), envDSContent: atob(dataenvds.data.content) } });

        }));
    }
    }
    catch (error) {
        //action.type and action.payload
        dispatch({
            type: UNDECIDED,
            payload: { running: false, message: error.message },
        }

        )
    }

};

export const gitPushAction = (featureKey, e2ETextArea, envDSTextArea) => async (dispatch) => {
    try {
        let encodedE2E = btoa(e2ETextArea);
        let encodeEnvds = btoa(envDSTextArea);
        let FeatureFile = featureKey + '.feature';
        //no new changes - get returns content and content compare same
        //sure about updating - get returns content and content compare not same
        //sure about creating - get returns nothing.
        //try one repository if statement here 
        //axios.get(repot)
        //if(feateurefile in not in repo - push to git){
        //      axios get envds content
        //    if (envds content diff) push to one
        //     else both
        //} 
        let found = false
        await axios.get('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features',
            {
                headers: {
                    "Accept": 'application/vnd.github.v3+json'
                }
            }).then(dirFiles => {
                    found = dirFiles.data.some(x => {
                    return x.name == FeatureFile
                })
            })



        
        if (!found) {
             await axios.get('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/java/environmentVariables.yaml',
                {
                    headers: {
                        "Accept": 'application/vnd.github.v3+json'
                    }
                }).then((dataenvds)=>{
                    if (encodeEnvds != dataenvds.data.content.replace(/(\r\n|\n|\r)/gm, "")) {
                        dispatch({ type: GIT_PUSH, payload: { pushMessage: "Are you certain you what to create a new E2E and push update to envds", action: "CREATE_E2E", e2esha: "sha", envsha: dataenvds.data.sha } });
        
                    }
                    else if (encodeEnvds == dataenvds.data.content.replace(/(\r\n|\n|\r)/gm, "")) {
                        dispatch({ type: GIT_PUSH, payload: { pushMessage: "Are you certain you what to create a new E2E", action: "CREATE_E2E_UPDATE", e2esha: "sha", envsha: null } });
        
                    }
                })          

        }
        else {
            axios.all([
                await axios.get(`https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features/${FeatureFile}`,
                    {
                        headers: {
                            "Accept": 'application/vnd.github.v3+json'
                        }
                    }),
                await axios.get('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/java/environmentVariables.yaml',
                    {
                        headers: {
                            "Accept": 'application/vnd.github.v3+json'
                        }
                    })
            ]).then(axios.spread((datae2e, dataenvds) => {


                //no changes
                if (encodedE2E == datae2e.data.content.replace(/(\r\n|\n|\r)/gm, "") && encodeEnvds == dataenvds.data.content.replace(/(\r\n|\n|\r)/gm, "")) {
                    dispatch({ type: GIT_PUSH, payload: { pushMessage: "No changes was made", action: "NOTHING", e2esha: null, envsha: null, noOK: true } });
                }

                //sure about updating changes
                else if (encodeEnvds != dataenvds.data.content.replace(/(\r\n|\n|\r)/gm, "") && encodedE2E == datae2e.data.content.replace(/(\r\n|\n|\r)/gm, "")) {
                    dispatch({ type: GIT_PUSH, payload: { pushMessage: "Are you certain you what to push an update to Environment Sheet ", action: "UPDATE_ENV", e2esha: null, envsha: dataenvds.data.sha } });
                }

                else if (encodeEnvds == dataenvds.data.content.replace(/(\r\n|\n|\r)/gm, "") && encodedE2E != datae2e.data.content.replace(/(\r\n|\n|\r)/gm, "")) {
                    dispatch({ type: GIT_PUSH, payload: { pushMessage: "Are you certain you what to push an update to E2E", action: "UPDATE_E2E", e2esha: datae2e.data.sha, envsha: null } });
                }

                else if (encodeEnvds != dataenvds.data.content.replace(/(\r\n|\n|\r)/gm, "") && encodedE2E != datae2e.data.content.replace(/(\r\n|\n|\r)/gm, "")) {
                    dispatch({ type: GIT_PUSH, payload: { pushMessage: "Are you certain you what to push an update to both the E2E and Environment Sheet", action: "UPDATE_BOTH", e2esha: datae2e.data.sha, envsha: dataenvds.data.sha } });

                }


            }));
        }
    } catch (error) {
        //action.type and action.payload
        dispatch({
            type: UNDECIDED,
            payload: { running: false, message: error.message },
        }

        )
    }

};



export const gitPushOKAction = (featureKey, e2ETextArea, envDSTextArea, action, e2esha, envdssha) => async (dispatch) => {
    const encodedE2E = btoa(e2ETextArea);
    const encodeEnvds = btoa(envDSTextArea);
    try {
        let FeatureFile = featureKey + '.feature';

        if (action == 'UPDATE_ENV') {

            await axios.put('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/java/environmentVariables.yaml',
                {
                    "message": "updated ennvironment",
                    "content": encodeEnvds,
                    "sha": envdssha
                },
                {
                    headers: {
                        "Accept": 'application/vnd.github.v3+json',
                        "Authorization": 'Basic ' + othertoken,
                        "Content-Type": "charset=utf-8"
                    }
                })

            dispatch({ type: GIT_PUSH_OK, payload: { pushOKMessage: "Enivronment successfully updated" } });


        }
        else if (action == 'UPDATE_E2E') {
            await axios.put(`https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features/${FeatureFile}`,
                {
                    "message": "updated e2E",
                    "content": encodedE2E,
                    "sha": e2esha
                },
                {
                    headers: {
                        "Accept": 'application/vnd.github.v3+json',
                        "Authorization": 'Basic '+othertoken,
                        "Content-Type": "charset=utf-8"
                    }
                })
            dispatch({ type: GIT_PUSH_OK, payload: { pushOKMessage: "E2E successfully updated" } });
        }

        else if (action == 'UPDATE_BOTH') {
            axios.all([
                await axios.put(`https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features/${FeatureFile}`,
                    {
                        "message": "updated e2E",
                        "content": encodedE2E,
                        "sha": e2esha
                    },
                    {
                        headers: {
                            "Accept": 'application/vnd.github.v3+json',
                            "Authorization": 'Basic ' + othertoken,
                            "Content-Type": "charset=utf-8"
                        }
                    }),
                await axios.put('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/java/environmentVariables.yaml',
                    {
                        "message": "updated environment",
                        "content": encodeEnvds,
                        "sha": envdssha
                    },
                    {
                        headers: {
                            "Accept": 'application/vnd.github.v3+json',
                            "Authorization": 'Basic ' + othertoken,
                            "Content-Type": "charset=utf-8"
                        }
                    })
            ]).then(axios.spread(() => {

                dispatch({ type: GIT_PUSH_OK, payload: { pushOKMessage: "Envrionment and E2E successfully updated" } });

            }));
        }

        else if (action == 'CREATE_E2E') {

            await axios.put(`https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features/${FeatureFile}`,
                {
                    "message": "created new e2E",
                    "content": encodedE2E,
                    "sha": e2esha
                },
                {
                    headers: {
                        "Accept": 'application/vnd.github.v3+json',
                        "Authorization": 'Basic ' + othertoken,
                        "Content-Type": "charset=utf-8"
                    }
                })

            dispatch({ type: GIT_PUSH_OK, payload: { pushOKMessage: "E2E successfully created" } });
        }
        else if (action == 'CREATE_E2E_UPDATE') {
            axios.all([
                await axios.put(`https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/resources/Features/${FeatureFile}`,
                    {
                        "message": "updated e2E",
                        "content": encodedE2E,
                        "sha": e2esha
                    },
                    {
                        headers: {
                            "Accept": 'application/vnd.github.v3+json',
                            "Authorization": 'Basic ' + othertoken,
                            "Content-Type": "charset=utf-8"
                        }
                    }),
                await axios.put('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/main/java/environmentVariables.yaml',
                    {
                        "message": "updated environment",
                        "content": encodeEnvds,
                        "sha": envdssha
                    },
                    {
                        headers: {
                            "Accept": 'application/vnd.github.v3+json',
                            "Authorization": 'Basic ' + othertoken,
                            "Content-Type": "charset=utf-8"
                        }
                    })
            ]).then(axios.spread(() => {

                dispatch({ type: GIT_PUSH_OK, payload: { pushOKMessage: "Successfully created E2E and updated envDS" } });

            }));



        }


    }
    catch (error) {
        //action.type and action.payload
        dispatch({
            type: UNDECIDED,
            payload: { running: false, message: error.message },
        }

        )
    }

}; 