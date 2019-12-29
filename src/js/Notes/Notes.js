import React from "react"

import {connect} from "react-redux"

import {initNotes} from "./ducks"
import {LoadNotes} from "./LoadNotes"
import {Note} from "./Note"
import {NotesList} from "./NotesList"

import "../../css/notes.css"

export const Notes = connect(
	state => {
		return {
			notesInitialized: state.notes.notesInitialized,
			notesLoaded: state.notes.notesLoaded, // use notesLoaded instead of notes for performance reasons
			note: state.notes.note
		}
	},
	dispatch => {
		return {
			onStartup: () => dispatch(initNotes())
		}
	}
)(({notesInitialized, notesLoaded, note, onStartup}) => {
	if (!notesInitialized) onStartup()
	return (
		!notesInitialized ?
			<span></span> :
			!notesLoaded ?
				<LoadNotes /> :
				note !== undefined ?
					<Note /> :
					<NotesList />
	)
})
