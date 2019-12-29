import React from "react"

import {connect} from "react-redux"

import {Button} from "@material-ui/core"

import {abort} from "../utils/reqs"

export const Wait = connect(
	state => {
		return {
			message: state.wait.message,
			reqKey: state.wait.reqKey
		}
	},
	dispatch => {
		return {
			onAbortClick: reqKey => dispatch(abort(reqKey))
		}
	}
)(({message, reqKey, onAbortClick}) => (
	<div>
		<div className="pb8">{message}</div>
		<div><Button variant="contained" color="primary" onClick={() => onAbortClick(reqKey)}>Abort</Button></div>
	</div>
))
