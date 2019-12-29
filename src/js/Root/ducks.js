import {combineReducers} from "redux"

import {waitReducer} from "../Wait"
import {errorReducer} from "../Error"
import {notesReducer} from "../Notes"

export const rootReducer = combineReducers({
	wait: waitReducer,
	error: errorReducer,
	notes: notesReducer
})
