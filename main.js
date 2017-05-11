const http = require("http")
const { exec } = require("child_process")

const config = JSON.parse(require("fs").readFileSync("config.json").toString())

http.createServer((req, res) => {
    const id = req.url.replace(/^\//, "")
    const c = config[id]

    if (!c) {
        res.statusCode = 404
        res.write("id not found: " + id)
        res.end()
        return
    }

    exec("git pull", { cwd: c.path }, (err, stdout) => {
        if (err) {
            res.statusCode = 500
            res.write(err.toString())
            res.end()
        }
        else if (stdout == "Already up-to-date.\n") {
            res.statusCode = 200
            res.write(stdout)
            res.end()
        }
        else {
            let out = stdout + "\n\n"
            exec(c.update_command, { cwd: c.path }, (err, stdout) => {
                if (err) {
                    res.statusCode = 500
                    res.write(err.toString())
                    res.end()
                }
                else {
                    res.statusCode = 200
                    res.write(out + stdout)
                    res.end()
                    console.log("[UPDATE] " + new Date(Date.now()) + " " + id)
                }
            })
        }
    })
}).listen(8082)