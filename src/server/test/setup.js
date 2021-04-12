const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');

const should = chai.should();
chai.use(chaiAsPromised);
chai.use(chaiHttp);

module.exports = { should, chai };
