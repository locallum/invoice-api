const generate = require('./generate');
const { beforeEach, describe, test, expect } = require('@jest/globals');

jest.mock('jspdf', () => {
  const mJsPDF = { 
    save: jest.fn(),
    text: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    line: jest.fn()
  };
  return { jsPDF: jest.fn(() => mJsPDF) };
});

// template 1 tests
describe('Template 1 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function counts before each test
  });

  // should create a pdf with only TO: 
  test('Create pdf with empty object', async () => {
    generate.toFile({});
    // only one element (TO:) is outputted to pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(1);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  // should create a pdf with only TO: 
  test('Create pdf with object with undefined fields', async () => {
    generate.toFile({ date: undefined, reference: undefined });
    // only one element (TO:) is outputted to pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(1);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  test('Create pdf with object with some missing fields and 1 item', async () => {
    generate.toFile({
      customer_name: 'Awolako Enterprises Pty Ltd',
      customer_streetName: 'Suite 123 Level 45',
      customer_addStreetName: '999 The Crescent',
      customer_city: 'Homebush West',
      customer_postalZone: '2140',
      customer_country: 'Australia',
      supplier_name: 'Ebusiness Software Services Pty Ltd',
      supplier_streetName: '100 Business St',
      supplier_addStreetName: undefined,
      supplier_city: 'Dulwich Hill',
      supplier_postalZone: '2203',
      supplier_country: 'Australia',
      supplier_abn: '80647710156',
      date: '2022-02-07',
      reference: 'EBWASP1002',
      items: [
        {
          quantity: '500.0',
          amount: '100.00',
          name: 'pencils',
          taxPercent: '10.0',
          taxScheme: 'GST',
          price: '0.20'
        }
      ],
      total: '110.00'
    });
    // 35 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(35);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });
  
  test('Create pdf with object with completed fields and 1 item', async () => {
    generate.toFile({
      customer_name: 'Trotters Trading Co Ltd',
      customer_streetName: '100 Queen Street',
      customer_addStreetName: 'Po box 878',
      customer_city: 'Sydney',
      customer_postalZone: '2000',
      customer_country: 'Australia',
      customer_abn: '91888222000',
      supplier_name: 'Supplier Trading Name Ltd',
      supplier_streetName: 'Main street 1',
      supplier_addStreetName: 'Postbox 123',
      supplier_city: 'Harrison',
      supplier_postalZone: '2912',
      supplier_country: 'Australia',
      supplier_abn: '47555222000',
      date: '2019-07-29',
      reference: '0150abc',
      items: [
        {
          quantity: '10',
          amount: '299.90',
          name: 'True-Widgets',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '29.99'
        }
      ],
      total: '1636.14'
    });
    // 36 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(36);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  test('Create pdf with object with some missing fields and multiple items', async () => {
    generate.toFile({
      customer_name: 'Awolako Enterprises Pty Ltd',
      customer_streetName: 'Suite 123 Level 45',
      customer_addStreetName: '999 The Crescent',
      customer_city: 'Homebush West',
      customer_postalZone: '2140',
      customer_country: 'Australia',
      supplier_name: 'Ebusiness Software Services Pty Ltd',
      supplier_streetName: '100 Business St',
      supplier_addStreetName: undefined,
      supplier_city: 'Dulwich Hill',
      supplier_postalZone: '2203',
      supplier_country: 'Australia',
      supplier_abn: '80647710156',
      date: '2022-02-07',
      reference: 'EBWASP1002',
      items: [
        {
          quantity: '500.0',
          amount: '100.00',
          name: 'pencils',
          taxPercent: '10.0',
          taxScheme: 'GST',
          price: '0.20'
        },
        {
          quantity: '750.0',
          amount: '300.00',
          name: 'pens',
          taxPercent: '10.0',
          taxScheme: 'GST',
          price: '0.50'
        }
      ],
      total: '110.00'
    });
    // 40 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(40);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  test('Create pdf with object with completed fields and multiple items', async () => {
    generate.toFile({
      customer_name: 'Trotters Trading Co Ltd',
      customer_streetName: '100 Queen Street',
      customer_addStreetName: 'Po box 878',
      customer_city: 'Sydney',
      customer_postalZone: '2000',
      customer_country: 'Australia',
      customer_abn: '91888222000',
      supplier_name: 'Supplier Trading Name Ltd',
      supplier_streetName: 'Main street 1',
      supplier_addStreetName: 'Postbox 123',
      supplier_city: 'Harrison',
      supplier_postalZone: '2912',
      supplier_country: 'Australia',
      supplier_abn: '47555222000',
      date: '2019-07-29',
      reference: '0150abc',
      items: [
        {
          quantity: '10',
          amount: '299.90',
          name: 'True-Widgets',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '29.99'
        },
        {
          quantity: '2',
          amount: '1000',
          name: 'item name 2',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '500'
        },
        {
          quantity: '25',
          amount: '187.50',
          name: 'True-Widgets',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '7.50'
        }
      ],
      total: '1636.14'
    });
    // 46 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(46);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });
});

// template 2 tests
describe('Template 2 Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function counts before each test
  });

  // should create a pdf with only TO: 
  test('Create pdf with empty object', async () => {
    generate.toFile({}, 2);
    // only one element (TO:) is outputted to pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(1);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  // should create a pdf with only TO: 
  test('Create pdf with object with undefined fields', async () => {
    generate.toFile({ date: undefined, reference: undefined }, 2);
    // only one element (TO:) is outputted to pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(1);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  test('Create pdf with object with some missing fields and 1 item', async () => {
    generate.toFile({
      customer_name: 'Awolako Enterprises Pty Ltd',
      customer_streetName: 'Suite 123 Level 45',
      customer_addStreetName: '999 The Crescent',
      customer_city: 'Homebush West',
      customer_postalZone: '2140',
      customer_country: 'Australia',
      supplier_name: 'Ebusiness Software Services Pty Ltd',
      supplier_streetName: '100 Business St',
      supplier_addStreetName: undefined,
      supplier_city: 'Dulwich Hill',
      supplier_postalZone: '2203',
      supplier_country: 'Australia',
      supplier_abn: '80647710156',
      date: '2022-02-07',
      reference: 'EBWASP1002',
      items: [
        {
          quantity: '500.0',
          amount: '100.00',
          name: 'pencils',
          taxPercent: '10.0',
          taxScheme: 'GST',
          price: '0.20'
        }
      ],
      total: '110.00'
    }, 2);
    // 32 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(32);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  test('Create pdf with object with completed fields and 1 item', async () => {
    generate.toFile({
      customer_name: 'Trotters Trading Co Ltd',
      customer_streetName: '100 Queen Street',
      customer_addStreetName: 'Po box 878',
      customer_city: 'Sydney',
      customer_postalZone: '2000',
      customer_country: 'Australia',
      customer_abn: '91888222000',
      supplier_name: 'Supplier Trading Name Ltd',
      supplier_streetName: 'Main street 1',
      supplier_addStreetName: 'Postbox 123',
      supplier_city: 'Harrison',
      supplier_postalZone: '2912',
      supplier_country: 'Australia',
      supplier_abn: '47555222000',
      date: '2019-07-29',
      reference: '0150abc',
      items: [
        {
          quantity: '10',
          amount: '299.90',
          name: 'True-Widgets',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '29.99'
        }
      ],
      total: '1636.14'
    }, 2);
    // 33 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(33);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  test('Create pdf with object with some missing fields and multiple items', async () => {
    generate.toFile({
      customer_name: 'Awolako Enterprises Pty Ltd',
      customer_streetName: 'Suite 123 Level 45',
      customer_addStreetName: '999 The Crescent',
      customer_city: 'Homebush West',
      customer_postalZone: '2140',
      customer_country: 'Australia',
      supplier_name: 'Ebusiness Software Services Pty Ltd',
      supplier_streetName: '100 Business St',
      supplier_addStreetName: undefined,
      supplier_city: 'Dulwich Hill',
      supplier_postalZone: '2203',
      supplier_country: 'Australia',
      supplier_abn: '80647710156',
      date: '2022-02-07',
      reference: 'EBWASP1002',
      items: [
        {
          quantity: '500.0',
          amount: '100.00',
          name: 'pencils',
          taxPercent: '10.0',
          taxScheme: 'GST',
          price: '0.20'
        },
        {
          quantity: '750.0',
          amount: '300.00',
          name: 'pens',
          taxPercent: '10.0',
          taxScheme: 'GST',
          price: '0.50'
        }
      ],
      total: '110.00'
    }, 2);
    // 37 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(37);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });

  test('Create pdf with object with completed fields and multiple items', async () => {
    generate.toFile({
      customer_name: 'Trotters Trading Co Ltd',
      customer_streetName: '100 Queen Street',
      customer_addStreetName: 'Po box 878',
      customer_city: 'Sydney',
      customer_postalZone: '2000',
      customer_country: 'Australia',
      customer_abn: '91888222000',
      supplier_name: 'Supplier Trading Name Ltd',
      supplier_streetName: 'Main street 1',
      supplier_addStreetName: 'Postbox 123',
      supplier_city: 'Harrison',
      supplier_postalZone: '2912',
      supplier_country: 'Australia',
      supplier_abn: '47555222000',
      date: '2019-07-29',
      reference: '0150abc',
      items: [
        {
          quantity: '10',
          amount: '299.90',
          name: 'True-Widgets',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '29.99'
        },
        {
          quantity: '2',
          amount: '1000',
          name: 'item name 2',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '500'
        },
        {
          quantity: '25',
          amount: '187.50',
          name: 'True-Widgets',
          taxPercent: '10',
          taxScheme: 'GST',
          price: '7.50'
        }
      ],
      total: '1636.14'
    }, 2);
    // 43 elements are outputted onto the pdf
    expect(jest.requireMock('jspdf').jsPDF().text).toHaveBeenCalledTimes(43);
    // pdf is saved
    expect(jest.requireMock('jspdf').jsPDF().save).toHaveBeenCalledTimes(1);
  });
});