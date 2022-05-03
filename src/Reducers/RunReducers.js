import { RUN_INVALID, STOP_AUTOMATION, RUN_AUTOMATION } from "../Constants/RunConstants";



export const runReducer = (state = {}, action) => {
    switch (action.type) {
        case RUN_INVALID:
            return action.payload;
        case RUN_AUTOMATION:
            return action.payload;
        default:
            return state;
    }
}

export const stopReducer = (state = {}, action) => {
    switch (action.type) {
        case STOP_AUTOMATION:
            return action.payload;
        case RUN_AUTOMATION:
            return action.payload;
        default:
            return state;
    }
}

export const failReducer = (state = {}, action) => {
    switch (action.type) {
        case STOP_AUTOMATION:
            return action.payload;
        case RUN_AUTOMATION:
            return action.payload;
        default:
            return state;
    }
}

export const successReducer = (state = {}, action) => {
    switch (action.type) {
        case STOP_AUTOMATION:
            return action.payload;
        case RUN_AUTOMATION:
            return action.payload;
        default:
            return state;
    }
}

