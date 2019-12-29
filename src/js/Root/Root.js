import React from "react"

import {connect} from "react-redux"

import {ThemeProvider} from "@material-ui/core/styles"

import {Wait} from "../Wait"
import {Error} from "../Error"
import {Notes} from "../Notes"

// themes

import {mainTheme} from "../themes"

// styles

import "../../css/common.css"

// container components

export const Root = connect(
	// mapping functions (redux store state -> react component props)
	state => {
		return {
			waitActive: state.wait.active,
			errorActive: state.error.active
		}
	}
)(({waitActive, errorActive}) => (
	// presentational component
	<ThemeProvider theme={mainTheme}>
		<div className="root">
			{waitActive && !errorActive && <Wait />}
			{!waitActive && errorActive && <Error />}
			{!waitActive && !errorActive && <Notes />}
		</div>
	</ThemeProvider>
))
