/* Magic Mirror
 * Module: MMM_Infomentor
 *
 * By Peter Möller
 * ISC Licensed.
 */

Module.register("MMM-Infomentor", {

	defaults: {
		allowHTML: false,
		debug: true,
		pupils: {},
		updateInterval: 3600,
		animationSpeed: 2.5 * 1000,
		tableClass: "small",
		weekdays: ['Mån', 'Tis', 'Ons', 'Tors', 'Fre']
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	/* start()
	 * Start module after all modules have been loaded
	 * by the MagicMirror framework
	 */
	start: function() {
		let self = this
		Log.info(this.name + ' is started!');
		// Schedule update timer.
		// var self = this;
		// setInterval(function() {
		// 	self.updateDom(self.config.fadeSpeed);
		// }, this.config.updateInterval);
		this.sendSocketNotification('START', {message: 'start connection'});

		this.sendSocketNotification("INIT", {
			config: this.config
		});
		this.sendSocketNotification("POLL");
		this.timer = setInterval(function () {
			// self.updateDom(self.config.animationSpeed);

			// Broadcast NewsFeed if needed
			if (true) {
				self.sendSocketNotification("POLL");
			}
		}, this.config.updateInterval*1000);

	},

	socketNotificationReceived: function(notification, payload) {

		Log.info(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		Log.info(payload);
		// this.config.pupils = payload;
		let doUpdate = false;
		payload.forEach(element => {
			const id = element.pupil.id;
			if (this.config.pupils[id] === undefined) {
				this.config.pupils[id] = element;
				doUpdate = true;
			}
			else if (this.config.pupils[id] !== element) {
				this.config.pupils[id] = element;
				doUpdate = true;
			}
				
		});
		this.loaded = true;		
		if (doUpdate) {
			this.updateDom(this.config.animationSpeed);
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
		// var date = this.getDisplayDate(); 
		var wrapper = document.createElement("div");

		if (this.config.pupils === {}) {
			wrapper.innerHTML = "Unable to log in to Infomentor. Are correct credentials set in config.js? " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		var table = document.createElement("table");
		table.className = this.config.tableClass;

		var dayRow = document.createElement("tr");
		dayRow.appendChild(document.createElement("td"));
		this.config.weekdays.forEach(day => {
			var dayCell = document.createElement("td");
			dayCell.innerHTML = day;
			dayRow.appendChild(dayCell);
		})
		table.appendChild(dayRow);


		Object.values(this.config.pupils).forEach(pupil => {
			Log.log(pupil)
			var row = document.createElement("tr");
			// if (this.config.colored) {
			// 	row.className = "colored";
			// }
			table.appendChild(row);

			var nameCell = document.createElement("td");
			// nameCell.className = "day";
			nameCell.innerHTML = pupil.pupil.initials;
			row.appendChild(nameCell);
			this.config.weekdays.forEach(day => {
				var dayCell = document.createElement("td");
				dayCell.className = "day";
				pupil.homework.forEach(assignment => {
					if (assignment.date.search(day) > -1) {
						assignment.items.forEach(item => {
							dayCell.innerHTML = dayCell.innerHTML + item.subject + ": " + item.homeworkText
						})
					}
				})
				row.appendChild(dayCell);
			})

		})


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
		return table;
	},

	// getDisplayDate: function() {
	// 	// check if config contains a threshold 'showNextDayAfter'
	// 	if(this.config.showNextDayAfter) {
	// 		var threshold = moment().startOf("day")
	// 						.add(moment.duration(this.config.showNextDayAfter));
	// 	} else {
	// 		var threshold = moment().endOf("day");
	// 	}
		
	// 	// get the current time and increment by one day if threshold time has passed
	// 	var now  = moment();
	// 	if(now.isAfter(threshold)) {
	// 		now = now.add(1, "day");
	// 	}

	// 	return now;
	// },

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
		return [];
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			this.config.customCssFile
		];
	}

});
