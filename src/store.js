import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { startJenkinsReducer } from './Reducers/JenkinsReducer';
import { gitPullReducer,gitPushReducer, gitPushOKReducer } from './Reducers/GitReducers';
import { failReducer, runReducer, stopReducer, successReducer } from './Reducers/RunReducers';





const initialState = {
    startJenkins: {running: false, message: null},
};

const reducer = combineReducers({
      startJenkins: startJenkinsReducer,
      gitPull: gitPullReducer,
      gitPush: gitPushReducer,
      gitPushOK: gitPushOKReducer,
      runClicked: runReducer,
      stopClicked: stopReducer,
      fail: failReducer,
      success: successReducer,
      
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||  compose;

//USEREDUDCER ARCHITECTURE (REDUCER,INITIALSTATE)
const store = createStore(
    reducer, 
    initialState, 
    composeEnhancer(applyMiddleware(thunk)));

export default store;