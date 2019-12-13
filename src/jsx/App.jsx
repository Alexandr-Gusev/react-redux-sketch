import React from "react" // we need import React in every jsx module

import {combineReducers, createStore, applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {render} from "react-dom"
import {Provider} from "react-redux"

import notes_page_reducer, {load_notes, NotesPage} from "./NotesPage.jsx"

const root_reducer = combineReducers({
	notes_page: notes_page_reducer
})
const store = createStore(root_reducer, applyMiddleware(thunk))

render(
	<Provider store={store}>
		<NotesPage />
	</Provider>,
	document.getElementById("app")
)

store.dispatch(load_notes())
