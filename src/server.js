const http = require("http")
const url = require("url")
const fs = require("fs")

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
let note_id = 3

const request_handler = (request, response) => {
	let body = ""

	request.on("data", chunk => {
		body += chunk
	})

	request.on("end", () => {
		let pathname = url.parse(request.url, true).pathname
		console.log("pathname: " + pathname)
		console.log("body: " + body)
		if (pathname === "/load_notes") {
			const res = {error: "", notes: notes}
			response.writeHead(200)
			response.write(JSON.stringify(res))
			response.end()
		} else if (pathname === "/save_note") {
			let res = {error: "unknown error"}
			let json = JSON.parse(body)
			if (!json.id) {
				json.id = note_id++
				notes.push(json)
				res.error = ""
				res.id = json.id
			} else {
				const i = notes.findIndex(note => json.id)
				if (i === -1) {
					res.error = "bad id"
				} else {
					notes[i] = json
					res.error = ""
					res.id = json.id
				}
			}
			response.writeHead(200)
			response.write(JSON.stringify(res))
			response.end()
		} else if (pathname === "/remove_note") {
			let res = {error: "unknown error"}
			const json = JSON.parse(body)
			const i = notes.findIndex(note => json.id)
			if (i === -1) {
				res.error = "bad id"
			} else {
				delete notes[i]
				res.error = ""
			}
			response.writeHead(200)
			response.write(JSON.stringify(res))
			response.end()
		} else {
			if (pathname === "/") {
				pathname = "/index.html"
			}
			fs.readFile(__dirname + pathname, "utf-8", (err, content) => {
				if (err) {
					response.writeHead(404)
					response.write("Not Found")
				} else {
					response.writeHead(200)
					response.write(content)
				}
				response.end()
			})
		}
	})
}

const server = http.createServer(request_handler)
server.listen(port)
