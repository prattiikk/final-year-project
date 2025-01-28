// document.getElementById('startStream').addEventListener('click', () => {
//   const liveVideo = document.getElementById('liveVideo');
//   const socket = io(); // Establish a connection to the server

//   // Access the webcam and display it in the video element
//   const constraints = { video: true };
//   navigator.mediaDevices.getUserMedia(constraints)
//     .then((stream) => {
//       console.log('Webcam stream started');
//       liveVideo.srcObject = stream; 


//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = 640; 
//       canvas.height = 360;


//       const captureFrame = () => {
//         console.log('Capturing frame');
//         ctx.drawImage(liveVideo, 0, 0, canvas.width, canvas.height); 
//         const dataUrl = canvas.toDataURL('image/jpeg'); 

//         // Emit the frame data to the server
//         console.log('Sending frame to server');
//         socket.emit('streamVideo', dataUrl.split(',')[1], 'image'); // Send only the image data (base64 part)
//       };


//       // frame interval per second
//       const frameInterval = setInterval(captureFrame, 1000);

//       // Stop capturing when the user disconnects
//       socket.on('disconnect', () => {
//         console.log('Disconnected from server');
//         clearInterval(frameInterval);
//       });

//     })
//     .catch((error) => {
//       console.error('Error accessing webcam:', error);
//     });
// });


document.getElementById('startStream').addEventListener('click', () => {
  const liveVideo = document.getElementById('liveVideo');
  const socket = io(); // Establish a connection to the server

  // Access the webcam and display it in the video element
  const constraints = { video: true };
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      console.log('Webcam stream started');
      liveVideo.srcObject = stream;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 640; 
      canvas.height = 360;

      // Function to capture the frame and send it with location data
      const captureFrame = () => {
        console.log('Capturing frame');
        ctx.drawImage(liveVideo, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg'); // Base64 image data

        // Get location details
        navigator.geolocation.getCurrentPosition((position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          };

          // Emit the frame data and location details to the server
          console.log('Sending frame and location to server');
          socket.emit('streamVideo', {
            imageData: dataUrl.split(',')[1], // Only send the base64 part of the image
            location: location
          });
        }, (error) => {
          console.error('Error getting location:', error);
        });
      };

      // Capture frames at a specified interval (e.g., 1 second)
      const frameInterval = setInterval(captureFrame, 1000);

      // Stop capturing when the user disconnects
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        clearInterval(frameInterval);
      });

    })
    .catch((error) => {
      console.error('Error accessing webcam:', error);
    });
});