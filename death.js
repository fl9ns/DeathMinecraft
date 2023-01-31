console.clear()

const version = `beta 2`

const fs = require('fs')
const http = require("http")
const zlib = require('zlib')
const readline = require('readline')

const dirSpigot = '/path/to/server'
const host = '0.0.0.0'
const port = 8888



// Web server
const requestListener = async function (req, res) {
    res.setHeader('Content-Type','text/html')
    res.writeHead(200)
    res.end(await getHTML())
}
const server = http.createServer(requestListener)
server.listen(port, host, () => { console.log(`Server is running on http://${host}:${port}`) })



// HTML
async function getHTML() {

    let jsonUsers = JSON.parse(fs.readFileSync(`${dirSpigot}/whitelist.json`, {encoding:'utf8', flag:'r'}))
    let users = []

    for(let l=0; l<jsonUsers.length; l++) { users.push(jsonUsers[l].name) }
    //users.push('ikki95')
    users.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}))
    delete jsonUsers

    
    let html = '<html><head><meta charset="UTF-8"><style>body{background-color:#333;color:#AAA;}table{border-collapse:collapse;}table,td{border:1px solid #AAA;}td{padding:2px;}</style></head><body>'

    for(let u=0; u<users.length; u++) {

        let data = await getUserInfos(`${users[u]}`)
        html += '<table style="margin-bottom:10px;">'
        for(let i=0; i<data.length; i++) {
            // Header
            if(i === 0){
                html += `<tr style="background-color:#777;color:#000;font-weight:bold;text-align:center;"><td style="text-align:center;">${data[i][0]}</td><td>${data[i][1]}</td></tr>`
            
            // Total death
            } else if(i === (data.length-3)) {
                html += `<tr style="background-color:#333;color:#940;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`

            // Co/deco
            } else if(i === (data.length-2)) {
                html += `<tr style="color:#666;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`

            // Time lapse
            } else if(i === (data.length-1)) {
                html += `<tr style="background-color:#333;color:#090;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`

            // all Death
            } else{
                html += `<tr><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
            }
        }
        html += '</table>'
    }

    html += '</body></html>'
    return html
}



// Death
async function getUserInfos(user) {

    let death = {}
    let connexion = []
    let disconnexion = []
    let fl9nsco = []
    let fl9nsdeco = []
    let timeout = []
    let total = 0

    for(let file of fs.readdirSync(`${dirSpigot}/logs`)) {
        if(file.endsWith('.gz')) {
            for await (const line of readline.createInterface({input:fs.createReadStream(`${dirSpigot}/logs/${file}`).pipe(zlib.createGunzip())})) {
                
                // Date
                let date = file.slice(0, 10)
                
                //Death
                if(line.indexOf(`${user}`) > -1
                && line.indexOf(`[Server thread/INFO]: ${user}`) > -1
                ) {
                    let info = line.slice(34 + user.length)
                    if(info.indexOf(':') === -1
                    && info.indexOf('[') === -1
                    && info.indexOf('!') === -1
                    && info.indexOf('/') === -1
                    && info.indexOf('joined the game') === -1
                    && info.indexOf('left the game') === -1
                    ) {
                        let location = info.indexOf(' at ') 
                        if(location > -1) { info = info.slice(0, location) }

                        total++
                        if (typeof death[`${info}`] != "undefined") {
                            death[`${info}`] = death[`${info}`] + 1
                        } else {
                            death[`${info}`] = 1
                        }
                    }
                    
                }

                // Time
                if(line.indexOf(`${user}`) > -1
                && line != '[17:50:15] [Server thread/INFO]: FL9NS joined the game'
                && (line.indexOf(`[Server thread/INFO]`) > -1
                 || line.indexOf(`[Spigot Watchdog Thread/INFO]`) > -1)
                ) {
                    
                    let hour = line.slice(1,9)
                    if(line.indexOf(`${user} joined the game`) > -1) {
                        connexion.push(`${date} ${hour}`)
                        fl9nsco.push(`${date} ${hour}`)
                    } else if(line.indexOf(`${user} lost connection`) > -1) {
                        disconnexion.push(`${date} ${hour}`)
                        fl9nsdeco.push(`${date} ${hour}`)
                    }
                    if(line.indexOf(`${user} lost connection: Timed out`) > -1) {
                        timeout.push(`${date} ${hour}`)
                    }
                }
            }
        }
    }
    

    // SORT
    let dataSorted = []
    for(let d in death) { dataSorted.push([d, death[d]]) }
    dataSorted.sort(function(a, b) { return b[1] - a[1] })
    dataSorted.push(["Total de morts",total])
    dataSorted.push([`${connexion.length} connexions<br>${disconnexion.length} déconnexions`,`${timeout.length} timeout`])
    
    let totalms = 0
    for(let l=0; l<disconnexion.length; l++){
        diff = Date.parse(disconnexion[l]) - Date.parse(connexion[l])
        totalms += diff
    }

    dataSorted.push(['Temps de jeu', `${jhms(totalms)}`])
    dataSorted.unshift([`${user}`, 'Morts'])

    // RETURN
    return dataSorted
}

function jhms(ms) {
    seconds = Number(ms) / 1000;
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + 'j ' : "";
    var hDisplay = h > 0 ? h + 'h ' : "";
    var mDisplay = m > 0 ? m + 'm ' : "";
    var sDisplay = s > 0 ? s + 's' : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
    }
