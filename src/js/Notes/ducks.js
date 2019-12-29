import {sendReq} from "../utils/reqs"
import {setWait, resetWait} from "../Wait"
import {setError} from "../Error"

// action types

const OPEN_NOTE = "Notes/OPEN_NOTE"
const CLOSE_NOTE = "Notes/CLOSE_NOTE"
const NOTES_INITIALIZED = "Notes/NOTES_INITIALIZED"
const NOTES_LOADED = "Notes/NOTES_LOADED"
const NOTE_SAVED = "Notes/NOTE_SAVED"
const NOTE_REMOVED = "Notes/NOTE_REMOVED"

// action creators

export function openNote(id) { // sync action creator
	return {type: OPEN_NOTE, id} // sync action
}

export function closeNote() {
	return {type: CLOSE_NOTE}
}

export function notesInitialized() {
	return {type: NOTES_INITIALIZED}
}

export function initNotes() { // async action creator
	return dispatch => { // async action
		dispatch(loadNotes())
		dispatch(notesInitialized())
	}
}

export function notesLoaded(notes) {
	return {type: NOTES_LOADED, notes}
}

export function loadNotes() {
	return dispatch => {
		const {reqKey, promise} = sendReq(
			"/load-notes",
			{
				method: "POST"
			}
		)
		dispatch(setWait("load...", reqKey))
		promise.then(
			response => response.json(),
			error => ({error})
		)
		.then(
			json => {
				dispatch(resetWait())
				if (json.error === "") {
					dispatch(notesLoaded(json.notes))
				} else if (json.error !== "aborted") {
					dispatch(setError(json.error))
				}
			},
			error => {
				dispatch(resetWait())
				dispatch(setError(error))
			}
		)
	}
}

export function noteSaved(note) {
	return {type: NOTE_SAVED, note}
}

export function saveNote(note) {
	return dispatch => {
		const {reqKey, promise} = sendReq(
			"/save-note",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json;charset=utf-8"
				},
				body: JSON.stringify(note)
			}
		)
		dispatch(setWait("save...", reqKey))
		promise.then(
			response => response.json(),
			error => ({error})
		)
		.then(
			json => {
				dispatch(resetWait())
				if (json.error === "") {
					dispatch(noteSaved({...note, id: json.id}))
					dispatch(closeNote())
				} else if (json.error !== "aborted") {
					dispatch(setError(json.error))
				}
			},
			error => {
				dispatch(resetWait())
				dispatch(setError(error))
			}
		)
	}
}

export function noteRemoved(id) {
	return {type: NOTE_REMOVED, id}
}

export function removeNote(id) {
	return dispatch => {
		const {reqKey, promise} = sendReq(
			"/remove-note",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json;charset=utf-8"
				},
				body: JSON.stringify({id})
			}
		)
		dispatch(setWait("remove...", reqKey))
		promise.then(
			response => response.json(),
			error => ({error})
		)
		.then(
			json => {
				dispatch(resetWait())
				if (json.error === "") {
					dispatch(noteRemoved(id))
				} else if (json.error !== "aborted") {
					dispatch(setError(json.error))
				}
			},
			error => {
				dispatch(resetWait())
				dispatch(setError(error))
			}
		)
	}
}

// reducer section

const defaultState = {
	notesInitialized: false,
	notesLoaded: false,
	note: undefined,
	notes: undefined
}

const defaultNote = {
	title: "title",
	text: "text"
}

export function notesReducer(state = defaultState, action) {
	switch (action.type) {
		case OPEN_NOTE:
			return {
				...state,
				note: !action.id ?
					{...defaultNote, id: 0, ts: new Date().getTime()} :
					{...state.notes.find(note => note.id === action.id)}
			}
		case CLOSE_NOTE:
			return {
				...state,
				note: undefined
			}
		case NOTES_INITIALIZED:
			return {
				...state,
				notesInitialized: true
			}
		case NOTES_LOADED:
			return {
				...state,
				notesLoaded: true,
				notes: action.notes
			}
		case NOTE_SAVED:
			return {
				...state,
				notes: state.notes.find(note => note.id === action.note.id) ?
					state.notes.map(note => note.id === action.note.id ? action.note : note) :
					[...state.notes, action.note]
			}
		case NOTE_REMOVED:
			return {
				...state,
				notes: state.notes.filter(note => note.id !== action.id)
			}
		default:
			return state
	}
}
