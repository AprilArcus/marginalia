/* eslint-env node */
/* eslint-disable strict, quotes, no-console */

'use strict';

require('source-map-support').install();
require('babel/register')({
	sourceMap: 'inline',
	blacklist: ['regenerator']
});


require('./server').listen(3000);
console.log('Marginalia API Server listening on localhost:3000');
