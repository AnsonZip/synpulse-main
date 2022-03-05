import chai, { expect } from 'chai';
import { getRandomInt, genTransaction } from '../../utils/helper';
import sinon from 'sinon';
chai.use(require('chai-uuid'));

describe('getRandomInt', function () {
  it('random integer', function () {
    let result = getRandomInt(-500, 1000);
    expect(result).greaterThanOrEqual(-500);
    expect(result).lessThanOrEqual(1000);
  });
});

describe('genTransaction', function () {
  it('random transaction', function () {
    sinon.useFakeTimers(1646467200000);

    let result = genTransaction('CHF');

    expect(result.key).be.a('string');
    expect(result.key.length).equal(16);
    expect(result.value.identifier).be.a.uuid('v4');
    expect(result.value.amount).greaterThanOrEqual(-500);
    expect(result.value.amount).lessThanOrEqual(1000);
    expect(result.value.iban).equal('CH93-0000-0000-0000-0000-0');
    expect(result.value.date).equal('2022-03-05');
    expect(result.value.description).equal('Online Banking CHF');
  });
});