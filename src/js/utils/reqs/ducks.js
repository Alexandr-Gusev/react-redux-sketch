import {abortReq} from "./core"

export function abort(reqKey) {
	return dispatch => {
		abortReq(reqKey, "aborted")
	}
}
