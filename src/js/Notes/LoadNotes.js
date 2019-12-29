import React from "react"

import {connect} from "react-redux"

import {Button} from "@material-ui/core"

import {loadNotes} from "./ducks"

export const LoadNotes = connect(
	null,
	dispatch => {
		return {
			onLoadNotesClick: () => dispatch(loadNotes())
		}
	}
)(({onLoadNotesClick}) => (
	<div>
		<h1>Connection error</h1>
		<Button variant="contained" color="primary" onClick={() => onLoadNotesClick()}>Load</Button>
	</div>
))
