const { parser, getPartyInfo, checkType } = require('./parser.js');
const { describe, test, expect } = require('@jest/globals');

// Parser function tests
describe('XML Parser', () => {
  test('parser function is given an invalid xml file', async () => {
    await expect(parser('test_files/fake.xml'))
      .rejects
      .toThrow("Failed to read input xml file");
  }); 

  test('parser function should return an object with undefined properties for missing invoice details', async () => {
    const result = await parser('test_files/invoice_only.xml');
    expect(result).toEqual({
      date: undefined,
      reference: undefined
    });
  }); 

  test('parser function should return an object with invoice details', async () => {
    const result = await parser('test_files/example1.xml');
    expect(result).toHaveProperty('customer_name');
    expect(result).toHaveProperty('supplier_name');
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('reference');
    expect(result).toHaveProperty('items');
    expect(result.items[0]).toHaveProperty('quantity');
    expect(result.items[0]).toHaveProperty('amount');
    expect(result.items[0]).toHaveProperty('name');
    expect(result.items[0]).toHaveProperty('taxPercent');
    expect(result.items[0]).toHaveProperty('taxScheme');
    expect(result.items[0]).toHaveProperty('price');
    expect(result).toHaveProperty('total');
  });

  test('parser function should return an object with invoice details for multiple items', async () => {
    const result = await parser('test_files/multiple.xml');
    expect(result).toHaveProperty('items');
    expect(result.items.length).toBe(2);
  });


// getPartyInfo function tests
  test('getPartyInfo function should return an object with party details', () => {
    const sampleParty = {
      PartyName: [{ Name: ['Test Company'] }],
      PostalAddress: [{ StreetName: ['Main St'], CityName: ['City'], PostalZone: ['12345'], Country: [{ IdentificationCode: ['US'] }] }],
      PartyIdentification: [{ ID: ['123456'] }]
    };
    const result = getPartyInfo(sampleParty, 'test_'); 
    expect(result).toHaveProperty('test_name', 'Test Company');
    expect(result).toHaveProperty('test_streetName', 'Main St');
    expect(result).toHaveProperty('test_city', 'City');
    expect(result).toHaveProperty('test_postalZone', '12345');
    expect(result).toHaveProperty('test_country', 'United States of America');
    expect(result).toHaveProperty('test_abn', '123456');
  });

  test('getPartyInfo function should handle missing properties gracefully', () => {
    const sampleParty = {
      PartyName: [{ Name: ['Test Company'] }],
    };
    const result = getPartyInfo(sampleParty, 'test_');
    expect(result).toBeDefined();
    expect(result.test_name).toEqual('Test Company');
    expect(result.test_streetName).toBeUndefined();
    expect(result.test_city).toBeUndefined();
    expect(result.test_postalZone).toBeUndefined();
    expect(result.test_country).toBeUndefined();
    expect(result.test_abn).toBeUndefined();
  });

  test('getPartyInfo function should handle empty objects gracefully', () => {
    const sampleParty = {};
    const result = getPartyInfo(sampleParty, 'test_');
    expect(result).toBeDefined();
    expect(result.test_name).toBeUndefined();
    expect(result.test_streetName).toBeUndefined();
    expect(result.test_city).toBeUndefined();
    expect(result.test_postalZone).toBeUndefined();
    expect(result.test_country).toBeUndefined();
    expect(result.test_abn).toBeUndefined();
  });

  test('getPartyInfo function should handle undefined values in party information', () => {
    const sampleParty = {
      PartyName: undefined,
      PostalAddress: undefined,
      PartyIdentification: undefined
    };
    const result = getPartyInfo(sampleParty, 'test_');
    expect(result).toEqual({});
  });
  
  test('getPartyInfo function should handle null values in party information', () => {
    const sampleParty = {
      PartyName: null,
      PostalAddress: null,
      PartyIdentification: null
    };
    const result = getPartyInfo(sampleParty, 'test_');
    expect(result).toEqual({});
  });
  
  test('getPartyInfo function should handle missing party information gracefully', () => {
    const sampleParty = {}; 
    const result = getPartyInfo(sampleParty, 'test_');
    expect(result).toEqual({});
  });

// checkType tests:
  test('checkType function should return the value unchanged if not an object', () => {
    const stringValue = 'test';
    const result = checkType(stringValue);
    expect(result).toEqual(stringValue);
  });

  test('checkType function should return the value of "_"" property if it is an object', () => {
    const objectValue = { _: 'test' };
    const result = checkType(objectValue);
    expect(result).toEqual('test');
  });

  test('checkType function should return undefined if value is undefined', () => {
    const undefinedValue = undefined;
    const result = checkType(undefinedValue);
    expect(result).toBeUndefined();
  });

  test('checkType function should return the value unchanged for valid input', () => {
    const validValue = 123;
    const result = checkType(validValue);
    expect(result).toEqual(validValue);
  });

  test('checkType function should return undefined for invalid input', () => {
    const invalidValue = undefined;
    const result = checkType(invalidValue);
    expect(result).toBeUndefined();
  });

});