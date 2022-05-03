let found1 = false
        await axios.get('https://api.github.com/repos/koyex1/CucumberJenkinsAws/contents/src/test/resources/Features',
            {
                headers: {
                    "Accept": 'application/vnd.github.v3+json'
                }
            }).then(dirFiles => {
                console.log()
                    found1 = dirFiles.data.some(x => {
                    return x.name == FeatureFile
                })
            })

        
        if (!found1) {
            console.log("inside not found")
            dispatch({ type: GIT_PULL, payload: {pullMessage: "E2E does not exist", e2eContent: null, envDSContent: null } });
        }





        pullMessage:  "E2E loaded",