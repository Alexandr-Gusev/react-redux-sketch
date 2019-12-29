import React from "react"

import {connect} from "react-redux"

import {Button} from "@material-ui/core"

import {resetError} from "./ducks"

export const Error = connect(
	state => {
		return {
			message: state.error.message
		}
	},
	dispatch => {
		return {
			onClearErrorClick: () => dispatch(resetError())
		}
	}
)(({message, onClearErrorClick}) => (
	<div>
		<div className="pb8">{message}</div>
		<div><Button variant="contained" color="primary" onClick={() => onClearErrorClick()}>OK</Button></div>
	</div>
))
