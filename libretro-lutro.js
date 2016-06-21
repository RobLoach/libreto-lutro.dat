const fs = require('fs');
const crc = require('crc')
const rimraf = require('rimraf')
const shellEscape = require('shell-escape')
const pkg = require('./package.json')
const games = require('./games.json')
const execSync = require('child_process').execSync
const crlf = require('crlf-helper')

// Clean the games directory.
rimraf.sync('games')
fs.mkdirSync('games')

function crc32(input) {
	return crc.crc32(input).toString(16)
}

var dat = `clrmamepro (
	name "${pkg.title}"
	description "${pkg.title}"
	comment "${pkg.description}"
	version ${pkg.version}
	date "${pkg.date}"
	author "${pkg.author}"
	homepage ${pkg.authorUrl}
	url ${pkg.homepage}
)
`

for (var slug in games) {
	console.log(slug)
	var game = games[slug]
	var out = `${__dirname}/games/${slug}.lutro`
	var main = fs.readFileSync(`${__dirname}/${slug}/main.lua`, {
		encoding: 'ascii'
	})
	var branch = game.branch || 'master'
	var args = `git archive --format zip --output ${out} ${branch}`
	execSync(args, {
		cwd: slug
	})

	dat += `
game (
	name "${game.name}"
	description "${game.name}"
	rom ( name "main.lua" crc ${crc32(main)} )
	rom ( name "main-LF.lua" crc ${crc32(crlf.setLineEnding(main, 'LF'))} )
	rom ( name "main-CR.lua" crc ${crc32(crlf.setLineEnding(main, 'CR'))} )
	rom ( name "main-CRLF.lua" crc ${crc32(crlf.setLineEnding(main, 'CRLF'))} )
)
`
}

// Write the DAT file.
fs.writeFileSync('Lutro.dat', dat)
