import React from "react"

import {useState} from "react"
import {connect} from "react-redux"

import {
	Button,
	TextField
} from "@material-ui/core"

import {
	saveNote,
	closeNote
} from "./ducks"

export const Note = connect(
	state => {
		return {
			note: state.notes.note
		}
	},
	dispatch => {
		return {
			onSaveNoteClick: note => dispatch(saveNote(note)),
			onCloseNoteClick: () => dispatch(closeNote())
		}
	}
)(({note, onSaveNoteClick, onCloseNoteClick}) => {
	const [title, setTitle] = useState(note.title)
	const [text, setText] = useState(note.text)
	return (
		<div>
			<h1>Note</h1>
			<div className="pb8">{new Date(note.ts).toLocaleString()}</div>
			<div className="pb8"><TextField variant="outlined" value={title} onChange={e => setTitle(e.target.value)} /></div>
			<div className="pb8"><TextField variant="outlined" value={text} onChange={e => setText(e.target.value)} /></div>
			<span className="pr8"><Button variant="contained" color="primary" onClick={() => onSaveNoteClick({...note, title, text})}>Save</Button></span>
			<span className="pr8"><Button className="pr8" variant="outlined" onClick={() => onCloseNoteClick()}>Close</Button></span>
		</div>
	)
})
