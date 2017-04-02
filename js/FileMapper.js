try {
      var fs = require('fs');

/*    map the csv entries to an object struture:
    {
      "Kund id 1": [
        {
          "encoding": "Kodning",
          "firstName1": "Förnamn 1",
          "firstName2": "Förnamn 2",
          "lastName": "Efternamn",
          "extraInfo": "Extra info",
          "date": "Datum",
          "customerClass": "Kundklass",
          "address": "Adress",
          "zip": "Postnr",
          "city": "Postort",
          "sex": "Kön",
          "birthday": "Födelse",
          "customerId2": "Kund id 2",
          "picture": "Bild\r"
        }
      ],
      "31210889923": [
        {
          "encoding": "310422704703121088996=502212000000000000",
          "firstName1": "A",
          "firstName2": "",
          "lastName": "B",
          "extraInfo": "",
          "date": "2001-10-16",
          "customerClass": "R�d",
          "address": "Gatan 1",
          "zip": "12345",
          "city": "Stad",
          "sex": "K",
          "birthday": "2000",
          "customerId2": "XX5656",
          "picture": "/9j/4AAQSkZ
        }
    ]
  }
*/

      var output = fs.readFileSync('test.csv', 'utf8')
        .trim()
        .split('\r\n')
        .map(function(line){
          return line.split(';');
        })
        .reduce(function(elements, line){
          elements[line[0]] = elements[line[0]]  || []; //If multiple on same object use same object, else new
          elements[line[0]].push({
            encoding: line[1],
            firstName1: line[2],
            firstName2: line[3],
            lastName: line[4],
            extraInfo: line[5],
            date: line[6],
            customerClass: line[7],
            address: line[8],
            zip: line[9],
            city: line[10],
            sex: line[11],
            birthday: line[12],
            customerId2: line[13],
            picture: line[14]
          });
          return elements;
        }, {});
        console.log(JSON.stringify(output, null, 2));
        var csvEntries = Object.keys(output);
        console.log(csvEntries.shift());
        console.log(csvEntries);

        // Decoding base-64 image
        function decodeBase64Image(dataString) {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          var response = {};

          if (matches.length !== 3)
          {
            return new Error('Invalid input string');
          }

          response.type = matches[1];
          response.data = new Buffer(matches[2], 'base64');

          return response;
        }


        csvEntries.forEach(function(entry){
          console.log(output[entry][0].picture);
          // Regular expression for image type:
          // This regular image extracts the "jpeg" from "image/jpeg"
          var imageTypeRegularExpression      = /\/(.*?)$/;
          var base64Data = 'data:image/jpeg;base64,'+ output[entry][0].picture;
          console.log(base64Data);
          var imageBuffer                      = decodeBase64Image(base64Data);
          var userUploadedFeedMessagesLocation = __dirname+'\\';

          var uniqueRandomImageName            = '' + entry;
          // This variable is actually an array which has 5 values,
          // The [1] value is the real image extension
          var imageTypeDetected                = imageBuffer
                                                  .type
                                                   .match(imageTypeRegularExpression);

          var userUploadedImagePath            = userUploadedFeedMessagesLocation +
                                                 uniqueRandomImageName +
                                                 '.' +
                                                 imageTypeDetected[1];

          // Save decoded binary image to disk
          try {
            fs.writeFile(userUploadedImagePath, imageBuffer.data,
                                  function() {
                                    console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                                  });
          }
          catch(error){
              console.log('ERROR:', error);
          }
        });


    }
    catch(error){
        console.log('ERROR:', error);
    }
