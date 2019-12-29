const SET = "Error/SET"
const RESET = "Error/RESET"

export function setError(message) {
	return {type: SET, message}
}

export function resetError() {
	return {type: RESET}
}

const defaultState = {active: false}

export function errorReducer(state = defaultState, action) {
	switch (action.type) {
		case SET:
			return {
				active: true,
				message: action.message.toString()
			}
		case RESET:
			return {
				active: false
			}
		default:
			return state
	}
}
