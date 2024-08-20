const { jsPDF } = require("jspdf"); // will automatically load the node version

const generate = {
  toFile(myObject, template = 1) {
    // Create a new jsPDF instance
    var doc = new jsPDF();

    if (template == 2) {
      doc = template2(myObject, doc);
    } else {
      // Iterate over the keys of the object and add them to the PDF
      var yPos = 25;
      var xPos = 20;

      yPos = addText(doc, 14, xPos, yPos, "TO:", 4);

      for (var key in myObject) {
        if (Object.prototype.hasOwnProperty.call(myObject, key)) {
          var value = myObject[key];
          var formatted = value;
          if (formatted == undefined) continue;
          switch (key) {
            case "customer_name":
              doc.setFontSize(9);
              formatted = value.toUpperCase();
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "customer_streetName":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "customer_addStreetName":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "customer_city":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "customer_postalZone":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "customer_country":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 20;

              doc.setFontSize(20);
              doc.setFont(undefined, "bold");
              doc.text(xPos, yPos, "INVOICE");
              yPos += 10;

              doc.setFontSize(14);
              doc.setFont(undefined, "normal");
              doc.text(xPos, yPos, "FROM:");
              yPos += 4;
              break;
            case "supplier_name":
              doc.setFontSize(9);
              formatted = value.toUpperCase();
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "supplier_streetName":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "supplier_addStreetName":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "supplier_city":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "supplier_postalZone":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "supplier_country":
              doc.setFontSize(9);
              doc.text(xPos, yPos, formatted);
              yPos += 4;
              break;
            case "supplier_abn":
              doc.setFontSize(9);
              doc.text(xPos, yPos, "ABN:" + formatted);
              yPos += 10;

              doc.setFont(undefined, "bold");
              doc.text(xPos, yPos, "Invoice Date");
              xPos += 50;
              doc.text(xPos, yPos, "Invoice Number");
              xPos -= 50;
              doc.setFont(undefined, "normal");
              yPos += 4;
              break;
            case "date":
              doc.setFontSize(9);
              doc.text(xPos, yPos, new Date("2022-02-07").toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }));
              xPos += 50;
              break;
            case "reference":
              doc.text(xPos, yPos, formatted);
              yPos += 16;
              xPos -= 50;
              break;
            case "items":
              doc.setFont(undefined, "bold");
              doc.text(xPos, yPos, "Quantity");
              xPos += 20;
              doc.text(xPos, yPos, "Code");
              xPos += 20;
              doc.text(xPos, yPos, "Account");
              xPos += 20;
              doc.text(xPos, yPos, "Description");
              xPos += 30;
              doc.text(xPos, yPos, "Price");
              xPos += 30;
              doc.text(xPos, yPos, "Amount");
              xPos += 20;
              doc.text(xPos, yPos, "GST%");
              xPos += 20;
              doc.setFont(undefined, "normal");
              // for each item in the items array
              for (var i in myObject.items) {
                yPos += 10;
                // output the item info to the pdf
                for (var item_key in myObject.items[i]) {
                  if (Object.prototype.hasOwnProperty.call(
                    myObject.items[i],
                    item_key
                  )) {
                    var item_value = myObject.items[i][item_key];
                    var item_formatted = item_value;

                    switch (item_key) {
                      case "quantity":
                        xPos = 20;
                        doc.text(xPos, yPos, item_formatted);
                        xPos += 120;
                        break;
                      case "amount":
                        doc.text(xPos, yPos, item_formatted);
                        xPos -= 60;
                        break;
                      case "name":
                        doc.text(xPos, yPos, item_formatted);
                        xPos += 80;
                        break;
                      case "taxPercent":
                        doc.text(xPos, yPos, item_formatted + "%");
                        xPos -= 50;
                        break;
                      case "price":
                        doc.text(xPos, yPos, "$" + item_formatted);
                        xPos += 20;
                        break;
                    }
                  }
                }
              }
              break;
            case "total":
              if (formatted == undefined) break;
              xPos = 100;
              yPos += 10;
              doc.setFont(undefined, "bold");
              doc.setFontSize(15);
              doc.text(xPos, yPos, "TOTAL:");
              xPos = 160;
              doc.text(xPos, yPos, "$" + formatted);
              yPos += 8;
              xPos = 100;
              doc.text(xPos, yPos, "Payable Amount:");
              xPos = 160;
              doc.text(xPos, yPos, "$" + formatted);
              break;
          }
        }
      }
    }
      
    // Save the PDF
    doc.save("invoice.pdf");
  }
};

const template2 = (myObject, doc) => {
  var yPos = 20;
  var xPos = 20;

  var c_yPos = 30;
  var c_xPos = 200;

  doc.setFontSize(20);
  doc.setFont("Helvetica");
  doc.text(20, 30, "INVOICE");


  for (var key in myObject) {
    if (Object.prototype.hasOwnProperty.call(myObject, key)) {
      var value = myObject[key];
      var formatted = value;

      if (formatted == undefined) continue;
  
      switch (key) {
        case "customer_name":
          doc.setFontSize(11);
          formatted = value.toUpperCase();
          doc.text(formatted, c_xPos, c_yPos, 'right');
          c_yPos += 5;
          break;
        case "customer_streetName":
          doc.setFontSize(10);
          doc.text(formatted, c_xPos, c_yPos, 'right');
          c_yPos += 5;
          break;
        case "customer_addStreetName":
          doc.setFontSize(10);
          doc.text(formatted, c_xPos, c_yPos, 'right');
          c_yPos += 5;
          break;
        case "customer_city":
          doc.setFontSize(10);
          doc.text(formatted, c_xPos, c_yPos, 'right');
          c_yPos += 5;
          break;
        case "customer_postalZone":
          doc.setFontSize(10);
          doc.text(formatted, c_xPos, c_yPos, 'right');
          c_yPos += 5;
          break;
        case "customer_country":
          doc.setFontSize(10);
          doc.text(formatted, c_xPos, c_yPos, 'right');
          c_yPos += 9;
          doc.line(20, c_yPos, 200, c_yPos);
          c_yPos += 9;
          yPos = c_yPos;
          break;
        case "reference":
          doc.setFont("Helvetica", "bold");
          doc.text(c_xPos, c_yPos, "INVOICE #", 'right');
          c_yPos += 5;
          doc.setFontSize(10);
          doc.setFont("Helvetica", "normal");
          doc.text(c_xPos, c_yPos, formatted, 'right');
          c_yPos += 5;
          break;
        case "date":
          doc.setFont("Helvetica", "bold");
          doc.text(c_xPos, c_yPos, "DATE", 'right');
          c_yPos += 5;
          doc.setFontSize(10);
          doc.setFont("Helvetica", "normal");
          doc.text(
            c_xPos,
            c_yPos,
            new Date("2022-02-07").toLocaleDateString(
              'en-US', 
              { month: 'long', day: '2-digit', year: 'numeric' }),
            'right');
          c_yPos += 5;
          break;
        case "supplier_name":
          doc.setFontSize(10);
          doc.setFont("Helvetica", "bold");
          doc.text(xPos, yPos, "BILL TO:");
          doc.setFont("Helvetica", "normal");
          yPos += 5;
          doc.setFontSize(11);
          formatted = value.toUpperCase();
          doc.text(xPos, yPos, formatted);
          yPos += 5;
          break;
        case "supplier_streetName":
          doc.setFontSize(10);
          doc.text(xPos, yPos, formatted);
          yPos += 5;
          break;
        case "supplier_addStreetName":
          doc.setFontSize(10);
          doc.text(xPos, yPos, formatted);
          yPos += 5;
          break;
        case "supplier_city":
          doc.setFontSize(10);
          doc.text(xPos, yPos, formatted);
          yPos += 5;
          break;
        case "supplier_postalZone":
          doc.setFontSize(10);
          doc.text(xPos, yPos, formatted);
          yPos += 5;
          break;
        case "supplier_country":
          doc.setFontSize(10);
          doc.text(xPos, yPos, formatted);
          yPos += 5;
          break;
        case "supplier_abn":
          doc.setFontSize(10);
          doc.text(xPos, yPos, "ABN:" + formatted);
          yPos += 9;
          doc.line(20, yPos, 200, yPos);
          yPos += 9;
          break;
        case "items":
          doc.setFont("Helvetica", "bold");
          doc.text(xPos, yPos, "Item");
          xPos += 50;
          doc.text(xPos, yPos, "Quantity");
          xPos += 40;
          doc.text(xPos, yPos, "Price");
          xPos += 40;
          doc.text(xPos, yPos, "Amount");
          xPos += 20;
          doc.text(xPos, yPos, "GST%");
          xPos = 20;
          doc.setFont("Helvetica", "normal");
          // for each item in the items array
          for (var i in myObject.items) {
            yPos += 10;
            // output the item info to the pdf
            for (var item_key in myObject.items[i]) {
              if (Object.prototype.hasOwnProperty.call(
                myObject.items[i],
                item_key
              )) {
                var item_value = myObject.items[i][item_key];
                var item_formatted = item_value;

                switch (item_key) {
                  case "quantity":
                    xPos = 70;
                    item_formatted = item_formatted.charAt(0).toUpperCase()
                                    + item_formatted.slice(1);
                    doc.text(xPos, yPos, item_formatted);
                    xPos += 80;
                    break;
                  case "amount":
                    doc.text(xPos, yPos, item_formatted);
                    xPos -= 130;
                    break;
                  case "name":
                    doc.text(xPos, yPos, item_formatted);
                    xPos += 150;
                    break;
                  case "taxPercent":
                    doc.text(xPos, yPos, item_formatted + "%");
                    xPos -= 60;
                    break;
                  case "price":
                    doc.text(xPos, yPos, "$" + item_formatted);
                    break;
                }
              }
            }
          }
          break;
        case "total":
          doc.setFontSize(15);
          yPos += 10;
          doc.line(20, yPos, 200, yPos);
          yPos += 10;
          doc.text(c_xPos, yPos, "TOTAL", 'right');
          doc.text(20, yPos, "Payable Amount");
          yPos += 7;
          doc.text(c_xPos, yPos, "$" + formatted, 'right');
          doc.text(20, yPos, "$" + formatted);
          break;
      }
    }
  }
  return doc
};

function addText(doc, size, x, y, text, next_y) {
  doc.setFontSize(size);
  doc.text(x, y, text);
  return y + next_y
}

module.exports = generate;