import {connect} from "react-redux"

// action types

const WAIT = "NotesPage/WAIT"
const CLEAR_WAIT = "NotesPage/CLEAR_WAIT"
const ERROR = "NotesPage/ERROR"
const CLEAR_ERROR = "NotesPage/CLEAR_ERROR"
const OPEN_NOTE = "NotesPage/OPEN_NOTE"
const CLOSE_NOTE = "NotesPage/CLOSE_NOTE"
const NOTES_LOADED = "NotesPage/NOTES_LOADED"
const NOTE_SAVED = "NotesPage/NOTE_SAVED"
const NOTE_REMOVED = "NotesPage/NOTE_REMOVED"

// action creators

function wait(message, req_key) { // sync action creator
	return {type: WAIT, message, req_key} // sync action
}

function clear_wait() {
	return {type: CLEAR_WAIT}
}

function error(message) {
	return {type: ERROR, message}
}

function clear_error() {
	return {type: CLEAR_ERROR}
}

function open_note(id) {
	return {type: OPEN_NOTE, id}
}

function close_note() {
	return {type: CLOSE_NOTE}
}

let requests_count = 0
let requests = {}

function abort_req(req_key, message) {
	let request = requests[req_key]
	if (request) {
		request.promise.reject(message)
		request.controller.abort()
		delete requests[req_key]
	}
}

function send_req(url, options, timeout = 5000) {
	let controller = new AbortController()
	let promise = fetch(url, {...options, signal: controller.signal})
	let req_key = "_" + requests_count
	requests_count++
	requests[req_key] = {controller, promise}
	setTimeout(
		() => {
			abort_req(req_key, "timeout")
		},
		timeout
	)
	return {req_key, promise}
}

function abort(req_key) { // async action creator
	return (dispatch) => { // async action
		abort_req(req_key, "aborted")
	}
}

function notes_loaded(notes) {
	return {type: NOTES_LOADED, notes}
}

function load_notes() {
	return (dispatch) => {
		const {req_key, promise} = send_req(
			"http://127.0.0.1/load_notes",
			{
				method: "POST"
			}
		)
		dispatch(wait("load...", req_key))
		promise.then(
			response => response.json(),
			error => ({error})
		)
		.then(
			json => {
				dispatch(clear_wait())
				if (json.error === "") {
					dispatch(notes_loaded(json.notes))
				} else if (json.error !== "aborted") {
					dispatch(error(json.error))
				}
			}
		)
	}
}

function note_saved(note) {
	return {type: NOTE_SAVED, note}
}

function save_note(note) {
	return (dispatch) => {
		const {req_key, promise} = send_req(
			"http://127.0.0.1/save_note",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json;charset=utf-8"
				},
				body: JSON.stringify(note)
			}
		)
		dispatch(wait("save...", req_key))
		promise.then(
			response => response.json(),
			error => ({error})
		)
		.then(
			json => {
				dispatch(clear_wait())
				if (json.error === "") {
					dispatch(note_saved({...note, id: json.id}))
					dispatch(close_note())
				} else if (json.error !== "aborted") {
					dispatch(error(json.error))
				}
			}
		)
	}
}

function note_removed(id) {
	return {type: NOTE_REMOVED, id}
}

function remove_note(id) {
	return (dispatch) => {
		const {req_key, promise} = send_req(
			"http://127.0.0.1/remove_note",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json;charset=utf-8"
				},
				body: JSON.stringify({id})
			}
		)
		dispatch(wait("remove...", req_key))
		promise.then(
			response => response.json(),
			error => ({error})
		)
		.then(
			json => {
				dispatch(clear_wait())
				if (json.error === "") {
					dispatch(note_removed(id))
				} else if (json.error !== "aborted") {
					dispatch(error(json.error))
				}
			}
		)
	}
}

const default_state = {
	wait: undefined,
	req_key: undefined,
	error: undefined,
	note: undefined,
	notes: [
		{
			id: 1,
			ts: 1575329084642,
			title: "t1",
			text: "d1"
		},
		{
			id: 2,
			ts: 1575329084642,
			title: "t2",
			text: "d2"
		}
	]
}

const default_note = {
	title: "Title",
	text: "Text"
}

// reducer

export default function reducer(state = default_state, action) {
	switch (action.type) {
		case WAIT:
			return {
				...state,
				wait: action.message,
				req_key: action.req_key
			}
		case CLEAR_WAIT:
			return {
				...state,
				wait: undefined,
				req_key: undefined
			}
		case ERROR:
			return {
				...state,
				error: action.message
			}
		case CLEAR_ERROR:
			return {
				...state,
				error: undefined
			}
		case OPEN_NOTE:
			return {
				...state,
				note: id === 0 ?
					{...default_note, id: 0, ts: new Date().getTime()} :
					{...state.notes.find((note) => note.id === action.id)}
			}
		case CLOSE_NOTE:
			return {
				...state,
				note: undefined
			}
		case NOTES_LOADED:
			return {
				...state,
				notes: action.notes
			}
		case NOTE_SAVED:
			return {
				...state,
				notes: [...state.notes, action.note]
			}
		case NOTE_REMOVED:
			return {
				...state,
				notes: state.notes.filter((note) => note.id !== action.id)
			}
		default:
			return state
	}
}

// container components

const WaitView = connect(
	// mapping functions (redux store state -> react component props)
	(state) => {
		return {
			wait: state.wait,
			req_key: state.req_key
		}
	},
	(dispatch) => {
		return {
			onAbortClick: (req_key) => {
				dispatch(abort(req_key))
			}
		}
	}
)(({wait, req_key, onAbortClick}) => (
	// presentational component
	<div>
		{wait}
		<button onClick={() => onAbortClick(req_key)}>Abort</button>
	</div>
))

const ErrorView = connect(
	(state) => {
		return {
			error: state.error
		}
	},
	(dispatch) => {
		return {
			onClearErrorClick: () => {
				dispatch(clear_error())
			}
		}
	}
)(({error, onClearErrorClick}) => (
	<div>
		{error}
		<button onClick={() => onClearErrorClick()}>OK</button>
	</div>
))

const Note = connect(
	null,
	(dispatch) => {
		return {
			onEditNoteClick: (id) => {
				dispatch(open_note(id))
			},
			onRemoveNoteClick: (id) => {
				dispatch(remove_note(id))
			}
		}
	}
)(({id, ts, title, onEditNoteClick, onRemoveNoteClick}) => (
	<div>
		<div>{title}</div>
		<div>{new Date(ts).toLocaleDateString()}</div>
		<button onClick={() => onEditNoteClick(id)}>Edit</button>
		<button onClick={() => onRemoveNoteClick(id)}>Remove</button>
	</div>
))

const NotesView = connect(
	(state) => {
		return {
			notes: state.notes
		}
	},
	(dispatch) => {
		return {
			onCreateNoteClick: () => {
				dispatch(open_note(0))
			}
		}
	}
)(({notes, onCreateNoteClick}) => (
	<div>
		<h1>Notes</h1>
		{notes.map(note => <Note key={note.id} {...note} />)}
		<button onClick={() => onCreateNoteClick()}>Create</button>
	</div>
))

const NoteView = connect(
	(state) => {
		return {
			note: state.note
		}
	},
	(dispatch) => {
		return {
			onSaveNoteClick: (note) => {
				dispatch(save_note(note))
			},
			onCloseNoteClick: () => {
				dispatch(close_note())
			}
		}
	}
)(({note, onSaveNoteClick, onCloseNoteClick}) => (
	<div>
		<div>{new Date(ts).toLocaleDateString()}</div>
		<input value={note.title} />
		<input value={note.text} />
		<button onClick={() => onSaveNoteClick(note)}>Save</button>
		<button onClick={() => onCloseNoteClick()}>Close</button>
	</div>
))

export const NotesPage = connect(
	(state) => {
		return {
			wait: state.wait,
			error: state.error,
			note: state.note
		}
	}
)(({wait, error, note}) => (
	<div>
		{wait !== undefined && <WaitView />}
		{error !== undefined && <ErrorView />}
		{note === undefined ? <NotesView /> : <NoteView />}
	</div>
))
