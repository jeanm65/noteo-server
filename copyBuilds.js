const fs = require('fs-extra');
const wait = require('util').promisify(setTimeout);

const run = async () => {
	//---- client ----//
	console.log('copying client build');
	await fs.remove('./dist');
	await wait(1000);
	await fs.ensureDir('../noteo-client/build');
	await fs.copy('../noteo-client/build', './dist');
	console.log('done');
}

run();