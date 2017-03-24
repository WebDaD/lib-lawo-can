# Lib-Lawo-Can
A small library to use the lawo-canbus.

It uses a patched Version of the canutils to make this work.

## Installation

Add "lib-lawo-can" to your dependencies.
(For Details, what happens next, see install.sh)

## Usage

```js
var LawoCan = require('lib-lawo-can') // Import class
var myCan = new LawoCan('vcan0') // create a new object on the CAN-Interface vcan0
myCan.on('read', function(data) {
  // do something if a canMessage arrives
  // data:
  // data.vcan = The CAN-Interface
  // data.id = The ID of the Message
  // data.data = The Data as Array of Hex-Codes
})
var id = 'C0C3000' // An Id for a Message
var data = ['00', '01'] // DataArray to send
myCan.send(id, data, function(error) { // Send the Message on the CAN-Interface
  // Will return an Error or null
})

myCan.destroy(function () { // destroys this object and closes the candump

})

```

## Tests
For Testing purposes, the lib sends itself a message and creates a temporary CAN-Interface vcan99

The do `npm run test`

# Acknowledgements
The patched canutils are made by Helmut Scholz, BR
