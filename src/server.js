const http = require("http")
const url = require("url")
const fs = require("fs")
const mime = require("C:/Program Files/nodejs/node_modules/npm/node_modules/mime-types")

const port = 3000

let notes = [
	{
		id: 1,
		ts: 1575329084642,
		title: "title 1",
		text: "text 1"
	},
	{
		id: 2,
		ts: 1575329084642,
		title: "title 2",
		text: "text 2"
	}
]
let noteId = 3

const requestHandler = (request, response) => {
	let body = []

	request.on("data", chunk => {
		body.push(chunk)
	})

	request.on("end", () => {
		let pathname = url.parse(request.url, true).pathname
		console.log(pathname)
		if (pathname === "/load-notes") {
			const res = {error: "", notes: notes}
			response.writeHead(200, {"Content-Type": "application/json"})
			response.write(JSON.stringify(res))
			response.end()
		} else if (pathname === "/save-note") {
			let res = {error: "unknown error"}
			let json = JSON.parse(body)
			if (!json.id) {
				json.id = noteId++
				notes.push(json)
				res.error = ""
				res.id = json.id
			} else {
				const i = notes.findIndex(note => note.id === json.id)
				if (i === -1) {
					res.error = "bad id"
				} else {
					notes[i] = json
					res.error = ""
					res.id = json.id
				}
			}
			response.writeHead(200, {"Content-Type": "application/json"})
			response.write(JSON.stringify(res))
			response.end()
		} else if (pathname === "/remove-note") {
			let res = {error: "unknown error"}
			const json = JSON.parse(body)
			const i = notes.findIndex(note => note.id === json.id)
			if (i === -1) {
				res.error = "bad id"
			} else {
				notes.splice(i, 1)
				res.error = ""
			}
			response.writeHead(200, {"Content-Type": "application/json"})
			response.write(JSON.stringify(res))
			response.end()
		} else {
			if (pathname === "/") {
				pathname = "/index.html"
			}
			fs.readFile(__dirname + pathname, (err, content) => {
				if (err) {
					response.writeHead(404, {"Content-Type": "text/plain"})
					response.write("Not Found")
				} else {
					response.writeHead(200, {"Content-Type": mime.lookup(pathname) || "text/plain"})
					response.write(content)
				}
				response.end()
			})
		}
	})
}

const server = http.createServer(requestHandler)
server.listen(port)
