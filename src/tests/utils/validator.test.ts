import { expect } from 'chai';
import { toValidate } from '../../utils/validator';
import RequestBody from '../../models/requestBody.model';

describe('validate pass', function () {
  const body = new RequestBody({
    currency: 'CHF',
    numberOfTransactions: 10
  });

  it('validate pass', async function () {
    let result = await toValidate(body);
    expect(result).have.lengthOf(0);
  });
});

describe('currency empty', function () {
  let reqBody = {
    numberOfTransactions: 10
  } as any;

  const body = new RequestBody(reqBody);

  const stub = [{
    field: 'currency',
    msg: [
      'currency must be one of the following values: GBP, EUR, CHF',
      'currency must be a string',
      'currency should not be empty'
    ]
  }];

  it('validate fail', async function () {
    let result = await toValidate(body);
    expect(result).to.eql(stub);
  });
});

describe('numberOfTransactions empty', function () {
  let reqBody = {
    currency: 'CHF'
  } as any;
  const body = new RequestBody(reqBody);

  const stub = [{
    field: 'numberOfTransactions',
    msg: [
      'numberOfTransactions must not be less than 0',
      'numberOfTransactions must be an integer number'
    ]
  }];

  it('validate fail', async function () {
    let result = await toValidate(body);
    expect(result).to.eql(stub);
  });
});

describe('both empty', function () {
  let reqBody = {} as any;

  const body = new RequestBody(reqBody);

  const stub = [{
    field: 'currency',
    msg: [
      'currency must be one of the following values: GBP, EUR, CHF',
      'currency must be a string',
      'currency should not be empty'
    ]
  }, {
    field: 'numberOfTransactions',
    msg: [
      'numberOfTransactions must not be less than 0',
      'numberOfTransactions must be an integer number'
    ]
  }];

  it('validate fail', async function () {
    let result = await toValidate(body);
    expect(result).to.eql(stub);
  });
});

describe('invalid currency', function () {
  const body = new RequestBody({
    currency: 'ABC',
    numberOfTransactions: 10
  });

  const stub = [{
    field: 'currency',
    msg: [
      'currency must be one of the following values: GBP, EUR, CHF'
    ]
  }];

  it('validate fail', async function () {
    let result = await toValidate(body);
    expect(result).to.eql(stub);
  });
});

describe('numberOfTransactions less than 0', function () {
  const body = new RequestBody({
    currency: 'CHF',
    numberOfTransactions: -1
  });

  const stub = [{
    field: 'numberOfTransactions',
    msg: [
      'numberOfTransactions must not be less than 0'
    ]
  }];

  it('validate fail', async function () {
    let result = await toValidate(body);
    expect(result).to.eql(stub);
  });
});