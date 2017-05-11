const http = require("http")
const { exec } = require("child_process")

const config = require("fs").readFileSync("config.json").toString()

http.createServer((req, res) => {
    const id = req.url.replace(/^\//, "")
    const c = config[id]

    exec("git pull", { cwd: c.path }, _ =>
        exec(c.update_command, { cwd: c.path }, err => {
            if (err) {
                res.statusCode = 500
                res.write(err)
                res.end()
            }
            else {
                res.statusCode = 200
                res.end()
            }
        }))
}).listen(80)