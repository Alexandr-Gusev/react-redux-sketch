const SET = "Wait/SET"
const RESET = "Wait/RESET"

export function setWait(message, reqKey) {
	return {type: SET, message, reqKey}
}

export function resetWait() {
	return {type: RESET}
}

const defaultState = {active: false}

export function waitReducer(state = defaultState, action) {
	switch (action.type) {
		case SET:
			return {
				active: true,
				message: action.message,
				reqKey: action.reqKey
			}
		case RESET:
			return {
				active: false
			}
		default:
			return state
	}
}
