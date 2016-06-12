const fs = require('fs');
const crc = require('crc')
const rimraf = require('rimraf')
const shellEscape = require('shell-escape')
const pkg = require('./package.json')
const games = require('./games.json')
const execSync = require('child_process').execSync

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
	var game = games[slug]
	var out = `${__dirname}/games/${slug}.lutro`
	var branch = game.branch || 'master'
	var args = `git archive --format zip --output ${out} ${branch}`
	execSync(args, {
		cwd: slug
	})

	var crcValue = crc32(fs.readFileSync(out))
	dat += `
game (
	name "${game.name}"
	description "${game.name}"
	rom ( name "${slug}.lutro" crc ${crcValue} )
)
`
}

// Write the DAT file.
fs.writeFileSync('Lutro.dat', dat)
