import {createMuiTheme} from "@material-ui/core/styles"

export const mainTheme = createMuiTheme({
	palette: {
		primary: {
			main: "#468DBC"
		}
	},
	overrides: {
		MuiOutlinedInput: {
			input: {
				padding: "8px"
			}
		}
	}
})
