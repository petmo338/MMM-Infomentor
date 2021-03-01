/* Magic Mirror
 * Node Helper: Newsfeed
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");

const { exec } = require('child_process');
// const { exit } = require("process");
const USERNAME = 'petmo338';
const PASSWORD = '1loTus123';

// function execute(self) {
//     exec('pyfomentor --username ' + USERNAME + ' --password ' + PASSWORD, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`exec error: ${error}`);
//           return;
//         }
//         else {
//             const input = JSON.parse(stdout);
//             // console.log(input);
//             self.sendSocketNotification("NEWS_ITEMS", input);
//             console.log('SOCKET NOTIFOCATION SENT');
//         }
//         // console.log(`stdout: ${stdout}`);
//         // console.error(`stderr: ${stderr}`);
//       });
      
// }
 
module.exports = NodeHelper.create({
  username: USERNAME,
  password: PASSWORD,
	// Subclass start method.
	start: function() {
		console.log("Starting module: (node_helper....)" + this.name);
	},
	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
    if (notification === 'POLL') {
      this.execute()
    }
    else if (notification === 'INIT') {
      console.log(payload)
      if (payload.config.username) {
        this.username = payload.config.username
      }
      if (payload.config.password) {
        this.password = payload.config.password
      }
    }
	},
  execute: function() {
    exec('pyfomentor --username ' + this.username + ' --password ' + this.password, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
      }
      else {
          // console.log(stdout);
          const input = JSON.parse(stdout);
          this.sendSocketNotification("INFOMENTOR_ITEMS", input);
          console.log('SOCKET NOTIFOCATION SENT');
      }
      // console.log(`stdout: ${stdout}`);
      // console.error(`stderr: ${stderr}`);
    });
  }
});
