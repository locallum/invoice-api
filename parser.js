const HTTPError = require('http-errors');
const parseString = require('xml2js').parseString;
const stripPrefix = require('xml2js').processors.stripPrefix;
var countries = require("i18n-iso-countries");

async function parser(data) {
  try {
    return new Promise((resolve, reject) => {
      parseString(
          data,
          {tagNameProcessors: [stripPrefix]},
          function(err, result) 
      {
        if (err) {
          reject(err);
        } else {
          var invoice = {};
          const prefix = result.Invoice;
          
          // gets customer information
          if (result.Invoice.AccountingCustomerParty != undefined) {
            const customer = getPartyInfo(
              prefix.AccountingCustomerParty[0].Party[0],
              `customer_`
            );
            invoice = Object.assign(invoice, customer);
          }
          // gets supplier information
          if (result.Invoice.AccountingSupplierParty != undefined) {
            const supplier = getPartyInfo(
              prefix.AccountingSupplierParty[0].Party[0],
              `supplier_`
            );
            invoice = Object.assign(invoice, supplier);
          }
          
          // gets invoice date
          invoice.date = prefix.IssueDate 
              ? prefix.IssueDate[0] 
              : undefined;
          // gets invoice reference number
          invoice.reference = prefix.BuyerReference 
              ? prefix.BuyerReference[0] 
              : undefined;
          
          // gets item details
          if (prefix.InvoiceLine != undefined) {
            invoice.items = [];
            for (var i = 0; i < prefix.InvoiceLine.length; i++) {
              var item = {};
              item.quantity = prefix.InvoiceLine[i].InvoicedQuantity 
                  ? prefix.InvoiceLine[i].InvoicedQuantity[0] 
                  : undefined;
              item.amount = prefix.InvoiceLine[i].LineExtensionAmount 
                  ? prefix.InvoiceLine[i].LineExtensionAmount[0] 
                  : undefined;
              if (prefix.InvoiceLine[i].Item != undefined) {
                item.name = prefix.InvoiceLine[i].Item[0].Name[0] 
                    ? prefix.InvoiceLine[i].Item[0].Name[0] 
                    : undefined;
                if (prefix.InvoiceLine[i].Item[0].ClassifiedTaxCategory != undefined) {
                  item.taxPercent = 
                    prefix.InvoiceLine[i].Item[0].ClassifiedTaxCategory[0].Percent[0]
                      ? prefix.InvoiceLine[i].Item[0].ClassifiedTaxCategory[0].Percent[0]
                      : undefined;
                  item.taxScheme = 
                    prefix.InvoiceLine[i].Item[0].ClassifiedTaxCategory[0].TaxScheme[0].ID[0]
                      ? prefix.InvoiceLine[i].Item[0].ClassifiedTaxCategory[0].TaxScheme[0].ID[0] 
                      : undefined;
                }
              }
              if (prefix.InvoiceLine[i].Price != undefined) {
                item.price = prefix.InvoiceLine[i].Price[0].PriceAmount[0] 
                    ? prefix.InvoiceLine[i].Price[0].PriceAmount[0] 
                    : undefined;
              }
              for (const property in item) {
                item[property] = checkType(item[property]);
              }
              invoice.items.push(item);
            }
          }
          // gets total
          if (prefix.LegalMonetaryTotal != undefined) {
            invoice.total = prefix.LegalMonetaryTotal[0].PayableAmount[0] 
                ? prefix.LegalMonetaryTotal[0].PayableAmount[0] 
                : undefined;
            invoice.total = checkType(invoice.total);
          }
          resolve(invoice);
        }
      });
    });
  } catch (error) {
    throw HTTPError(400, 'Failed to read input xml file');
  }
}

// gets all necessary information about party
function getPartyInfo(prefix, type) {
  var party = {};
  party.name = prefix.PartyName ? prefix.PartyName[0].Name[0] : undefined;

  if (prefix.PostalAddress != undefined) {
    party.streetName = prefix.PostalAddress[0].StreetName[0] 
        ? prefix.PostalAddress[0].StreetName[0] 
        : undefined;
    party.addStreetName = prefix.PostalAddress[0].AdditionalStreetName 
        ? prefix.PostalAddress[0].AdditionalStreetName[0] 
        : undefined;
    party.city = prefix.PostalAddress[0].CityName[0] 
        ? prefix.PostalAddress[0].CityName[0] 
        : undefined;
    party.postalZone = prefix.PostalAddress[0].PostalZone[0] 
        ? prefix.PostalAddress[0].PostalZone[0] 
        : undefined;
    if (prefix.PostalAddress[0].Country != undefined) {
      party.country = prefix.PostalAddress[0].Country[0].IdentificationCode[0]
          ? prefix.PostalAddress[0].Country[0].IdentificationCode[0] 
          : undefined;
      party.country = countries.getName(checkType(party.country), "en");
    }
  }
  var abn = prefix.PartyIdentification 
      ? prefix.PartyIdentification 
      : undefined;
  if (abn !== undefined) {
    party.abn = abn[0].ID[0];
  }

  for (const property in party) {
    party[property] = checkType(party[property]);
  }

  party = Object.keys(party).reduce(
    (a, c) => (a[`${type}${c}`] = party[c], a), {}
  );

  return party
}

// checks that if the value is an object, the inside value is extracted
function checkType(value) {
  if (typeof value === 'object') {
    value = value._;
  }
  return value
}

module.exports = { parser, getPartyInfo, checkType };