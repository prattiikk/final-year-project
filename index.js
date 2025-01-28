// const express = require('express');
// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const server = http.createServer(app);
// const io = require('socket.io')(server);

// // Create a folder to store the images (if it doesn't already exist)
// const imagesDir = './frames';
// if (!fs.existsSync(imagesDir)){
//     fs.mkdirSync(imagesDir);
// }

// app.use(express.static('public'));

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('streamVideo', (frameData, frameType) => {
//     // Generate a unique filename for each frame
//     const filename = `frame-${Date.now()}.jpg`;
//     const filePath = path.join(imagesDir, filename);

//     if (frameType === 'image') {
//       // Decode base64 image data and save to a file
//       const buffer = Buffer.from(frameData, 'base64');
//       fs.writeFile(filePath, buffer, (err) => {
//         if (err) {
//           console.error('Error saving the image:', err);
//         } else {
//           console.log('Frame saved as:', filename);
//         }
//       });
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000');
// });



const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  // Import UUID library for unique ID generation
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// Create a folder to store the images and location data (if they don't already exist)
const imagesDir = './frames';
const locationDir = './locations';
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}
if (!fs.existsSync(locationDir)) {
  fs.mkdirSync(locationDir);
}

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('streamVideo', (data) => {
    // Generate a unique identifier for each frame
    const uniqueId = uuidv4();  // Using UUID for unique ID

    // Filenames for the image and location data based on the unique ID
    const imageFilename = `frame-${uniqueId}.jpg`;
    const locationFilename = `frame-${uniqueId}.json`;

    const imageFilePath = path.join(imagesDir, imageFilename);
    const locationFilePath = path.join(locationDir, locationFilename);

    // Save the image
    if (data.imageData) {
      const buffer = Buffer.from(data.imageData, 'base64');
      fs.writeFile(imageFilePath, buffer, (err) => {
        if (err) {
          console.error('Error saving the image:', err);
        } else {
          console.log('Frame saved as:', imageFilename);
        }
      });
    }

    // Save the location data with the same unique identifier
    if (data.location) {
      const locationData = {
        id: uniqueId,  // Add the unique ID to the location data
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        timestamp: data.location.timestamp,
      };

      fs.writeFile(locationFilePath, JSON.stringify(locationData, null, 2), (err) => {
        if (err) {
          console.error('Error saving location data:', err);
        } else {
          console.log('Location data saved as:', locationFilename);
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
