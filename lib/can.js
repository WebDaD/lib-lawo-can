/**
 * @overview  Basic Can-Lib, will emit Data, can send Data
 * @module lib-lawo-can
 * @author Dominik Sigmund
 * @version 1.0
 * @description Creates an Object. send to send, read to get data. specify on a vcan
 * @memberof lib-lawo-can
 * @requires module:util
 * @requires module:events
 * @requires module:child_process
 * @requires bin:cansend
 * @requires bin:candump
 */
var util = require('util')
var EventEmitter = require('events').EventEmitter
var spawn = require('child_process').spawn
var exec = require('child_process').exec
/** Creates a instance of class LawoCan and starts emitting can-messages on given vcan
 * @class LawoCan
 * @param {string} vcan - A valid and open vcan-interface
 * @fires LawoCan#read
 * @returns Nothing
 * */
function LawoCan (vcan) {
  this.vcan = vcan
  var self = this
  self.candump = spawn('candump', [vcan])
  self.candump.stdout.on('data', function (data) {
    var dataArray = data.toString().split('\n')
    for (var i = 0; i < dataArray.length; i++) {
      var canMessage = {}
      var tmp = dataArray[i].toString().replace('\n', '').split('  ')
      canMessage.vcan = tmp[1]
      canMessage.id = tmp[2]
      if (tmp.length > 4) {
        canMessage.data = tmp[4].split(' ')
      } else {
        canMessage.data = ''
      }
      if (canMessage.vcan === self.vcan) {
          /**
         * LawoCan Read event.
         *
         * @event LawoCan#read
         * @type {object}
         * @property {object} canMessage - A Can-Message
         * @property {string} canMessage.vcan - The VCAN
         * @property {string} canMessage.id - The Message ID
         * @property {array} canMessage.data - The Data of the Can Message
         */
        self.emit('read', canMessage)
      }
    }
  })
}
util.inherits(LawoCan, EventEmitter)
/** Sends a Can-Message
 * @param {string} id - ID of the can-device to send data to
 * @param {string} data - Data to send
 * @param {LawoCan~sendCallback} callback - A Callback with an error or nothing
 * @returns Nothing
 * */
LawoCan.prototype.send = function (id, data, callback) {
  exec('cansend ' + this.vcan + ' ' + id + '#' + data, function (error, stdout, stderr) {
    if (error) {
      callback(error)
    } else {
      callback(null)
    }
  })
}
/** Destroys the object (kills candump child)
 * @param {LawoCan~exitCallback} callback - A Callback after its done
 * @returns Nothing
 * */
LawoCan.prototype.destroy = function (callback) {
  this.candump.kill()
  callback()
}
module.exports = LawoCan

/**
 * This callback is displayed as part of the LawoCan class.
 * @callback LawoCan~sendCallback
 * @param {object} Error or null
 */
 /**
  * This callback is displayed as part of the LawoCan class.
  * @callback LawoCan~exitCallback
  */
