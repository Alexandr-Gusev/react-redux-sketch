import React from "react"

import {connect} from "react-redux"

import {IconButton} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"

import {
	openNote,
	removeNote
} from "./ducks"

export const NotesListItem = connect(
	null,
	dispatch => {
		return {
			onEditNoteClick: id => dispatch(openNote(id)),
			onRemoveNoteClick: id => dispatch(removeNote(id))
		}
	}
)(({id, ts, title, onEditNoteClick, onRemoveNoteClick}) => (
	<div className="notes-list-item">
		<div className="pb8">{new Date(ts).toLocaleString()}</div>
		<div className="pb8">{title}</div>
		<div className="notes-list-item-controls">
			<span className="p8">
				<IconButton size="small" onClick={() => onEditNoteClick(id)}>
					<EditIcon fontSize="small" />
				</IconButton>
			</span>
			<span className="p8">
				<IconButton size="small" onClick={() => onRemoveNoteClick(id)}>
					<DeleteIcon fontSize="small" />
				</IconButton>
			</span>
		</div>
	</div>
))
