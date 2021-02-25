/* Magic Mirror
 * Node Helper: Newsfeed
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");

const { exec } = require('child_process');
const USERNAME = 'petmo338';
const PASSWORD = '1loTus123';

function execute(self) {
    exec('pyfomentor --username ' + USERNAME + ' --password ' + PASSWORD, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        else {
            var input = JSON.parse(stdout);
            console.log(input);
            self.sendSocketNotification("NEWS_ITEMS", input);
        }
        // console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);
      });
      
}
 
module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting module: (node_helper....)" + this.name);
        setInterval(execute, 3600*1000*2, this);
	},
	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		this.sendSocketNotification("STARTING", {})
        execute(this);
	}
});