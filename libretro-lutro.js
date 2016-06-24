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
)
`
}

// Write the DAT file.
fs.writeFileSync('Lutro.dat', dat)
