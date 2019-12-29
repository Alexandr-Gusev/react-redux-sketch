import React from "react" // we need import React in every jsx module

import {createStore, applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {render} from "react-dom"
import {Provider} from "react-redux"

import {rootReducer, Root} from "./Root"

const store = createStore(rootReducer, applyMiddleware(thunk))

render(
	<Provider store={store}>
		<Root />
	</Provider>,
	document.getElementById("app")
)
