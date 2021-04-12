const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');

// sets up chai to use some plugins
const should = chai.should();
chai.use(chaiAsPromised);
chai.use(chaiHttp);

module.exports = { should, chai };
