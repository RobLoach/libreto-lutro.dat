const games = require('./games.json')
const execSync = require('child_process').execSync
for (var slug in games) {
	var branch = games[slug].branch || 'master'
	var args = `git pull origin ${branch}`
	execSync(args, {
		cwd: slug
	})
}
