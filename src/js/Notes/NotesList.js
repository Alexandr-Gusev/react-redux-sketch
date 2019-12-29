import React from "react"

import {connect} from "react-redux"

import {Button} from "@material-ui/core"

import {openNote} from "./ducks"
import {NotesListItem} from "./NotesListItem"

export const NotesList = connect(
	state => {
		return {
			notes: state.notes.notes
		}
	},
	dispatch => {
		return {
			onCreateNoteClick: () => dispatch(openNote(0))
		}
	}
)(({notes, onCreateNoteClick}) => (
	<div>
		<h1>Notes</h1>
		{notes.map(note => <NotesListItem key={note.id} {...note} />)}
		<div className="pt8">
			<Button variant="contained" color="primary" onClick={() => onCreateNoteClick()}>Create</Button>
		</div>
	</div>
))
