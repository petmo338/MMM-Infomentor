/* Magic Mirror
 * Module: MMM_Infomentor
 *
 * By Peter Möller
 * ISC Licensed.
 */

Module.register("MMM-Infomentor", {

	defaults: {
		customCssFile: "MMM-Infomentor.css",
		fadeSpeed: 4000,
		allowHTML: false,
		debug: true,
		pupils: {}
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	/* start()
	 * Start module after all modules have been loaded
	 * by the MagicMirror framework
	 */
	start: function() {
		Log.error(this.name + ' is started!');
		// Schedule update timer.
		// var self = this;
		// setInterval(function() {
		// 	self.updateDom(self.config.fadeSpeed);
		// }, this.config.updateInterval);
		this.sendSocketNotification("INIT", {
			config: this.config
		});
		this.loaded = true;		
	},

	socketNotificationReceived: function(notification, payload) {

		Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		
		var id = payload.pupil.id;
		var doUpdate = false;
		if (this.config.pupils[id] === undefined) {
			this.config.pupils[id] = payload.pupil;
			doUpdate = true;
		}
		else if (this.config.pupils[id] !== payload.pupil) {
			this.config.pupils[id] = payload.pupil;
			doUpdate = true;
		}
		if (doUpdate) {
			this.updateDom(this.config.fadeSpeed);
		}
	},

	/* getHeader()
	 * Create the module header. Regards configuration showWeekdayinHeader 
	 */
	getHeader: function() {
		var header = this.data.header;
		// if(this.config.showWeekdayinHeader) {
		// 	header += " " + this.translate("ON_DAY") + " " + this.getDisplayDate().format("dddd"); 
		// }
		return header;
	},

	/* getDom()
	 * Create the DOM to show content
	 */
	getDom: function() {
		var date = this.getDisplayDate(); 

		// get day of week and access respective element in lessons array
		// var dow = date.locale('en').format("ddd").toLowerCase();
		// var lessons = this.config.schedule.lessons[dow];

		// // no lessons today, we return default text
		// if(lessons == undefined)
		// {
		// 	return this.createTextOnlyDom(
		// 		this.translate("NO_LESSONS")
		// 	);
		// }

		// // get timeslots
		// var timeslots = this.config.schedule.timeslots;

		// build table with timeslot definitions and lessons
		wrapper = document.createElement("table");
		// for (let index = 0; index < lessons.length; index++) {
		// 	const lesson = lessons[index];
		// 	const time = timeslots[index];

		// 	// only create a row if the timeslot's lesson is defined and not an empty string
		// 	if(lesson)
		// 	{
		// 		var row = this.createTimetableRow(time, lesson); 
		// 		wrapper.appendChild(row);
		// 	}
		// }
		for (const pupil in this.config.pupils) {
			wrapper.appendChild(this.createTimetableRow(pupil.id, pupil))
		}
		return wrapper;
	},

	getDisplayDate: function() {
		// check if config contains a threshold 'showNextDayAfter'
		if(this.config.showNextDayAfter) {
			var threshold = moment().startOf("day")
							.add(moment.duration(this.config.showNextDayAfter));
		} else {
			var threshold = moment().endOf("day");
		}
		
		// get the current time and increment by one day if threshold time has passed
		var now  = moment();
		if(now.isAfter(threshold)) {
			now = now.add(1, "day");
		}

		return now;
	},

	createTextOnlyDom: function(text) {
		var wrapper = document.createElement("table");
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		var text = document.createTextNode(text); 
		td.className = "xsmall bright lesson";

		wrapper.appendChild(tr);
		tr.appendChild(td);
		td.appendChild(text);

		return wrapper;
	},

	createTimetableRow: function(time, lesson) {
		var row = document.createElement("tr");

		var tdtime = document.createElement("td");
		tdtime.className = "xsmall dimmed lessontime";
		if (this.config.allowHTML) {
			tdtime.innerHTML  = time;
		} else {
			tdtime.appendChild(
				document.createTextNode(time)
			);
		}
		row.appendChild(tdtime);

		var tdlesson = document.createElement("td");
		tdlesson.className = "xsmall bright lesson";
		if (this.config.allowHTML) {
			tdlesson.innerHTML  = lesson;
		} else {
			tdlesson.appendChild(
				document.createTextNode(lesson)
			);
		}
		row.appendChild(tdlesson);

		return row;
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			this.config.customCssFile
		];
	},

	getTranslations: function() {
		return {
				en: "translations/en.json",
				de: "translations/de.json",
				sv: "translations/sv.json",
				nb: "translations/nb.json",
				nn: "translations/nn.json",
				he: "translations/he.json",
				hu: "translations/hu.json",
				da: "translations/da.json",
				pl: "translations/pl.json"
		}
	}

});