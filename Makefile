dat: submodules node_modules
	npm test

love-lutris/main.lua: submodules

submodules:
	@git submodule init
	@git submodule update

node_modules:
	npm install

update:
	npm run update
