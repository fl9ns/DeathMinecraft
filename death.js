const fs = require('fs')
const zlib = require('zlib')
const readline = require('readline')

const dir = '/home/flens/LOGmc/'

async function main() {
    let number = 0
    let death = {}
    if(process.argv.length >= 2) {
        let user = process.argv[2]
        console.clear()
        console.log('-------------------')
        console.log(` -> ${user}`)
        console.log('-------------------')
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
                            number++
                            if (typeof death[`${info}`] != "undefined") {
                                death[`${info}`] = death[`${info}`] + 1
                            } else {
                                death[`${info}`] = 1
                            }
                            //console.log(info)
                        }
                    }
                }
            }
        }

        // SORT
        let deathSorted = []
        for(let d in death) { deathSorted.push([d, death[d]]) }
        deathSorted.sort(function(a, b) { return b[1] - a[1] })



        for(let i=0; i<deathSorted.length; i++) {
            console.log(`${deathSorted[i][0]} : ${deathSorted[i][1]}`)
        }

        console.log('-------------------')
        console.log(`Total : ${number}`)
        console.log('-------------------')

    } else {
        console.log('Need login')
    }
}; main()
