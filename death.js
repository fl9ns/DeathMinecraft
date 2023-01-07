const fs = require('fs')
const http = require("http")
const zlib = require('zlib')
const readline = require('readline')

const dir = '/home/mcje/spigotServer/logs/'
const host = '0.0.0.0'
const port = 8888

const requestListener = async function (req, res) {
    res.setHeader('Content-Type','text/html')
    res.writeHead(200)
    
    res.end(await getHTML())
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

async function getHTML() {
    let html = '<html><head><style>body{background-color:#333;color:#AAA;}table{border-collapse:collapse;}table,td{border:1px solid #AAA;}td{padding:2px;}</style></head><body>'

    // Redah
    let data = await getDeaths('RedKhey')
    html += '<table>'
    for(let i=0; i<data.length; i++) {
        if(i === 0){
            html += `<tr style="background-color:#777;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else if(i === (data.length-1)) {
            html += `<tr style="background-color:#A50;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else {
            html += `<tr><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        }
    }
    html += '</table><hr/>'

    // Ikki
    data = await getDeaths('ikki95')
    html += '<table>'
    for(let i=0; i<data.length; i++) {
        if(i === 0){
            html += `<tr style="background-color:#777;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else if(i === (data.length-1)) {
            html += `<tr style="background-color:#A50;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else {
            html += `<tr><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        }
    }
    html += '</table><hr/>'

    // Melinda
    data = await getDeaths('melinnnndaaaa')
    html += '<table>'
    for(let i=0; i<data.length; i++) {
        if(i === 0){
            html += `<tr style="background-color:#777;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else if(i === (data.length-1)) {
            html += `<tr style="background-color:#A50;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else {
            html += `<tr><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        }
    }
    html += '</table><hr/>'

    // Flens
    data = await getDeaths('FL9NS')
    html += '<table>'
    for(let i=0; i<data.length; i++) {
        if(i === 0){
            html += `<tr style="background-color:#777;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else if(i === (data.length-1)) {
            html += `<tr style="background-color:#A50;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else {
            html += `<tr><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        }
    }
    html += '</table><hr/>'

    // Jemikko
    data = await getDeaths('Jemikko')
    html += '<table>'
    for(let i=0; i<data.length; i++) {
        if(i === 0){
            html += `<tr style="background-color:#777;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else if(i === (data.length-1)) {
            html += `<tr style="background-color:#A50;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else {
            html += `<tr><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        }
    }
    html += '</table><hr/>'

    // Kadar
    data = await getDeaths('KADAR5002')
    html += '<table>'
    for(let i=0; i<data.length; i++) {
        if(i === 0){
            html += `<tr style="background-color:#777;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else if(i === (data.length-1)) {
            html += `<tr style="background-color:#A50;color:#000;font-weight:bold;"><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        } else {
            html += `<tr><td>${data[i][0]}</td><td style="text-align:center;">${data[i][1]}</td></tr>`
        }
    }
    html += '</table><hr/>'





    html += '</body></html>'
    return html
}

async function getDeaths(user) {

    let death = {}
    let total = 0

    for(let file of fs.readdirSync(dir)) {
        if(file.endsWith('.gz')) {
            for await (const line of readline.createInterface({input:fs.createReadStream(`${dir}${file}`).pipe(zlib.createGunzip())})) {
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
                        total++
                        if (typeof death[`${info}`] != "undefined") {
                            death[`${info}`] = death[`${info}`] + 1
                        } else {
                            death[`${info}`] = 1
                        }
                    }
                }
            }
        }
    }

    // SORT
    let deathSorted = []
    for(let d in death) { deathSorted.push([d, death[d]]) }
    deathSorted.sort(function(a, b) { return b[1] - a[1] })
    deathSorted.push(["Total",total])
    deathSorted.unshift([`${user}`, 'Morts'])

    // RETURN
    return deathSorted
}
