import React, { Component } from 'react';
import moment from 'moment';
import './App.css';

class Calendar extends React.Component {

	state = {
		dateContext: moment(),
		today: moment(),
		week: 0,
		addEventDate: [2019, 0, 1, 0, 0, 0, 0],
		editEvent: [],
		showMonthPopup: false,
		showYearPopup: false,
		showAddPopup: false,
		showCalendar: true,
		showEvents: true,
		showEventPanel: false,
		popupDown: true,
		popupUp: false,
		byMonth: true,
		byWeek: false,
		startFrom: 1,
		eventsDays: [],
		selectedEvent: [],
		editEvent: [],
		events: []
	}

	down = require('./img/down-arrow.svg');
	up = require('./img/up-arrow.svg');
	add = require('./img/add.svg');
	confirmAdd = require('./img/confirm.svg');
	cancelAdd = require('./img/cancel.svg');
	delete = require('./img/delete.svg');
	save = require('./img/save.svg');

	weekdays = moment.weekdays();
	weekdaysShort = moment.weekdaysShort();
	months = moment.months();
	monthsShort = moment.monthsShort();

	events = () => this.state.events;
	today = () => this.state.today;
	year = () => this.state.dateContext.format('Y');
	month = () => this.state.dateContext.format('MMMM');
	week = () => this.state.week;
	day = () => this.state.dateContext.format('DD');
	daysInMonth = () => this.state.dateContext.daysInMonth();
	dateContext = () => this.state.dateContext;
	currentYear = () => this.state.today.get('year');
	currentMonth = () => this.state.today.get('month');
	currentDate = () => this.state.today.get('date');
	currentDay = () => this.state.today.format('D');
	addEventDate = () => this.state.addEventDate;
	editEvent = () => this.state.editEvent;

	maxWeek = (e) => {
		let firstDay = Number(moment(this.state.dateContext).startOf('month').format('d'));
		let daysInMonth = Number(this.state.dateContext.daysInMonth());
		let maxWeek = Math.ceil((firstDay + daysInMonth) / 7);
		return maxWeek;
	}

	firstDayOfMonth = () => {
		let dateContext = this.state.dateContext;
		let firstDay = moment(dateContext).startOf('month').format('d');
		return firstDay;
	}

	todayMonth = (e) => {
		let dateContext = this.state.today;
		this.setState({
			dateContext: dateContext,
			byMonth: true,
			byWeek: false,
			week: 0,
			startFrom: 1
		})
		this.props.onNextMonth && this.props.onNextMonth();
	}

	continue = (e) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).add(1, "month").format('MMM');
		return dateContext;
	}

	previous = (e) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).subtract(1, "month").format('MMM');
		return dateContext;
	}

	nextMonth = (e) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).add(1, "month");
		this.setState({
			dateContext: dateContext,
			week: 0,
			startFrom: 1
		})
		this.props.onNextMonth && this.props.onNextMonth();
	}

	prevMonth = (e) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).subtract(1, "month");
		this.setState({
			dateContext: dateContext,
			startFrom: 1
		});
	}

	nextWeek = (e) => {
		let week = this.state.week;
		let maxWeek = this.maxWeek();
		if (week < maxWeek - 1) {
			week++;
		}
		else {
			this.nextMonth();
			week = 0;
		}
		this.setState({
			week: week
		});
	}

	prevWeek = (e) => {
		var week = this.state.week;
		if (week > 0) {
			week--;
			this.setState({
				week: week
			});
		}
		else {
			this.prevMonth();
		}
	}

	forBeginEnd = () => {
		let firstDay = Number(moment(this.state.dateContext).startOf('month').format('d'));
		let daysInMonth = Number(this.state.dateContext.daysInMonth());
		let len = firstDay + daysInMonth;
		var month = [];
		for (let i = 0; i < firstDay; i++) {
			month[i] = 0;
		}
		var j = 1;
		for (let i = month.length; i < len; i++) {
			month[i] = j;
			j++;
		}
		for (let i = len; i < len + 7; i++) {
			month[i] = 0;
		}
		var k = 0;
		var monthRows = [];
		for (var i = 0; i < this.maxWeek(); i++) {
			monthRows[i] = [];
			for (let j = 0; j < 7; j++) {
				monthRows[i][j] = month[k];
				k++;
			}
		}
		return monthRows;
	}

	begin = () => {
		let monthRows = this.forBeginEnd();
		let begin;
		let week = this.week();
		for (let l = 0; l < 7; l++) {
			if (monthRows[week][l] !== 0) {
				begin = monthRows[week][l];
				break;
			}
		}
		return begin;
	}

	end = () => {
		let monthRows = this.forBeginEnd();
		let end;
		let week = this.week();
		for (let l = 6; l > -1; l--) {
			if (monthRows[week][l] !== 0) {
				end = monthRows[week][l];
				break;
			}
		}
		return end;
	}

	onChangeModeByWeek = (e) => {
		this.setState({
			byMonth: false,
			byWeek: true
		});
	}

	onChangeModeByMonth = (e) => {
		this.setState({
			byMonth: true,
			byWeek: false,
			week: 0
		});
	}

	onMonthClick = (e) => {
		this.setState({
			showMonthPopup: !this.state.showMonthPopup,
			popupUp: !this.state.popupUp,
			popupDown: !this.state.popupDown
		})
	}

	onDayClick = (e, day, month, year) => {
		this.setState({
			startFrom: day
		})
	}

	onPlusClick = (e) => {
		this.setState({
			showAddPopup: true,
			showEvents: false,
			showCalendar: false
		});
	}

	onCancelClick = (e) => {
		this.setState({
			showAddPopup: false,
			showEvents: true,
			showCalendar: true
		});
	}

	onMonthSelect = (e, month) => {
		let event = this.state.addEventDate;
		event[1] = month;
		this.setState({
			addEventDate: event
		});
	}

	onDaySelect = (day) => {
		let event = this.state.addEventDate;
		event[2] = day;
		this.setState({
			addEventDate: event
		});
	}

	onHoursSelect = (hour) => {
		let event = this.state.addEventDate;
		event[3] = hour;
		this.setState({
			addEventDate: event
		});
	}

	onMinutesSelect = (minutes) => {
		let event = this.state.addEventDate;
		event[4] = minutes;
		this.setState({
			addEventDate: event
		});
	}

	onBodyEdit = (body) => {
		let event = this.state.addEventDate;
		this.setState({
			addEventDate: event
		});
	}

	onNameEdit = (name) => {
		let event = this.state.addEventDate;
		this.setState({
			addEventDate: event
		});
	}

	onEventClick = (e, m) => {
		this.setState({
			showAddPopup: false,
			showEvents: false,
			showCalendar: false,
			showEventPanel: true,
			selectedEvent: [...m],
			editEvent: [...m]
		});
	}

	onSaveEventClick = (event) => {
		let oldEvent = event;
		let events = this.events();
		this.onDeleteEventClick(oldEvent);

		let year = Number(this.year());
		let month = Number(document.getElementById('month').value);
		let day = Number(document.getElementById('day').value);
		let hours = Number(document.getElementById('hours').value);
		let minutes = Number(document.getElementById('minutes').value);
		let name = document.getElementById('name').value;
		let body = document.getElementById('body').value;

		if (name === '' || body === '') {
			alert('Заполните все поля!')
			return false;
		}

		var done = false;

		for (var i = 0; i < events.length; i++) {
			if (
				events[i].date[0] === year &&
				events[i].date[1] === month &&
				events[i].date[2] === day
			) {
				events[i].events[events[i].events.length] = {
					hour: hours,
					minutes: minutes,
					name: name,
					body: body
				};
				done = true;
			}
		}

		if (!done) {
			events[events.length] = {
				date: [year, month, day],
				events: [
					{
						hour: hours,
						minutes: minutes,
						name: name,
						body: body
					}
				]
			}
		}

		this.setState({
			events: [...events]
		})
	}

	onCancelEventClick = () => {
		this.setState({
			showAddPopup: false,
			showEvents: true,
			showCalendar: true,
			showEventPanel: false
		});
	}

	onDeleteEventClick = (deleteThis) => {
		let event = deleteThis;
		let events = this.events();
		for (let i = 0; i < events.length; i++) {
			if (events[i].date === event[0]) {
				for (let j = 0; j < events[i].events.length; j++) {
					if (events[i].events[j] === event[1]) {
						events[i].events.splice(j, 1);
					}
				}
				if (events[i].events.length === 0) {
					events.splice(i, 1);
				}
			}
		}
		this.setState({
			events: events,
			showAddPopup: false,
			showEvents: true,
			showCalendar: true,
			showEventPanel: false
		});
	}

	onAddClick = (e) => {
		let events = this.events();
		let year = Number(this.year());
		let month = Number(document.getElementById('month').value);
		let day = Number(document.getElementById('day').value);
		let hours = Number(document.getElementById('hours').value);
		let minutes = Number(document.getElementById('minutes').value);
		let name = document.getElementById('name').value;
		let body = document.getElementById('body').value;

		if (name === '' || body === '') {
			alert('Заполните все поля!')
			return false;
		}

		for (var i = 0; i < events.length; i++) {
			if (
				events[i].date[0] === year &&
				events[i].date[1] === month &&
				events[i].date[2] === day
			) {
				events[i].events[events[i].events.length] = {
					hour: hours,
					minutes: minutes,
					name: name,
					body: body
				};
				this.setState({
					showAddPopup: false,
					showEvents: true,
					showCalendar: true,
					events: [...events]
				})
				return
			}
		}
		events[events.length] = {
			date: [year, month, day],
			events: [
				{
					hour: hours,
					minutes: minutes,
					name: name,
					body: body
				}
			]
		}
		this.setState({
			showAddPopup: false,
			showEvents: true,
			showCalendar: true,
			events: [...events]
		})
		return
	}

	SelectMode = () => {
		return (
			<span>
				<ul className="month-popup">
					<li><a href="#" onClick={e => { this.onChangeModeByWeek(e) }} >By week</a></li>
					<li><a href="#" onClick={e => { this.onChangeModeByMonth(e) }} >By month</a></li>
				</ul>
			</span>
		);
	}

	MonthNav = () => {
		return (
			<div className="label-month" onClick={e => { this.onMonthClick(e) }}>
				{this.state.byMonth && this.month().toUpperCase()}
				{this.state.byWeek && this.month()}
				{' '}
				{this.state.byWeek && this.begin()}
				{this.state.byWeek && ' - '}
				{this.state.byWeek && this.end()}
				{this.state.popupDown &&
					<img className="arrow-img" src={this.down} alt="" />}
				{this.state.popupUp &&
					<img className="arrow-img" src={this.up} alt="" />}
				{this.state.showMonthPopup &&
					<this.SelectMode data={this.months} />}
			</div>
		);
	}

	SelectDate = (e) => {
		let months = this.months;
		let SelectMonth = months.map((item, index) => {
			return (<option key={item + index} value={index}>{item}</option>)
		});
		var dfltDay = this.currentDay();
		var dfltMonth = this.state.dateContext.get('month');
		var dfltHours = Number(this.today().format('HH'));

		return (
			<span>
				<input id="day" type="number" defaultValue={dfltDay} min="1" max="31" className="time-input" />
				<select id="month" defaultValue={dfltMonth} onSelect={(e) => { this.onMonthSelect(e) }}>
					{SelectMonth}
				</select>
				<span id="at">at</span>
				<input id="hours" type="number" defaultValue={dfltHours} min="0" max="23" className="time-input" onChange={(e) => { this.onHoursSelect(e) }} />
				<span id="dots">:</span>
				<input id="minutes" type="number" defaultValue={this.today().format('m')} min="0" max="59" className="time-input" onChange={(e) => { this.onMinutesSelect(e) }} />
			</span>
		);
	}

	AddPanel = (e) => {
		return (
			<div id="add-event">
				<div id="add-event-btn">
					<img src={this.cancelAdd} alt="" onClick={(e) => this.onCancelClick(e)} />
					<h3>New event</h3>
					<img src={this.confirmAdd} alt="" onClick={(e) => this.onAddClick(e)} />
				</div>
				<div className="event-add-form">
					<div id="event-name-form">
						<span className="event-form-place">EVENT NAME</span>
						<input id="name" type="text" placeholder="" />
					</div>
					<div id="event-time-form">
						<div id="time-form">
							<span className="event-form-place">STARTS</span>
							<span>
								<this.SelectDate />
							</span>
						</div>
					</div>
					<div id="event-body-form">
						<span className="event-form-place">ADDITIONAL DETAILS</span>
						<textarea id="body" type="text" placeholder="" />
					</div>
				</div>
			</div>
		);
	}

	EventPanel = () => {
		var event = this.state.selectedEvent;
		let months = this.months;
		let SelectMonth = months.map((item, index) => {
			return (<option key={item + index} value={index}>{item}</option>)
		});
		var dfltMonth = event[0][1];
		var dfltDay = event[0][2];
		var dfltHours = event[1].hour;
		var dfltMinutes = event[1].minutes;
		return (
			<div id="add-event">
				<div id="add-event-btn">
					<img src={this.cancelAdd} alt="" onClick={(e) => this.onCancelEventClick(e)} />
					<img src={this.delete} alt="" onClick={(e) => this.onDeleteEventClick(event)} />
					<img src={this.save} alt="" onClick={(e) => this.onSaveEventClick(event)} />
				</div>
				<div className="event-add-form">
					<div id="event-name-form">
						<span className="event-form-place">EVENT NAME</span>
						<input id="name" type="text" placeholder="" defaultValue={event[1].name} onInput={(e) => { this.onNameEdit(this) }} />
					</div>
					<div id="event-time-form">
						<div id="time-form">
							<span className="event-form-place">STARTS</span>
							<span>
								<input id="day" type="number" defaultValue={dfltDay} min="1" max="31" className="time-input" />
								<select id="month" defaultValue={dfltMonth} onSelect={(e) => { this.onMonthSelect(e) }}>
									{SelectMonth}
								</select>
								<span id="at">at</span>
								<input id="hours" type="number" defaultValue={dfltHours} min="0" max="23" className="time-input" onChange={(e) => { this.onHoursSelect(e) }} />
								<span id="dots">:</span>
								<input id="minutes" type="number" defaultValue={dfltMinutes} min="0" max="59" className="time-input" onChange={(e) => { this.onMinutesSelect(e) }} />
							</span>
						</div>
					</div>
					<div id="event-body-form">
						<span className="event-form-place">ADDITIONAL DETAILS</span>
						<textarea id="body" type="text" placeholder="" defaultValue={event[1].body} onInput={(e) => { this.onBodyEdit() }} />
					</div>
				</div>
			</div>
		);
	}

	Events = () => {
		let SortByMonth = (ev) => {
			var events = ev;
			if (events.length > 0) {
				let newEvents = [];
				var k = 0;
				let curYear = () => Number(this.state.dateContext.format('YYYY'));
				let curMonth = () => Number(this.state.dateContext.format('M') - 1);
				let startFrom = Number(this.state.startFrom);
				for (var i = 0; i < events.length; i++) {
					if (Number(events[i].date[0]) === Number(curYear()) &&
						Number(events[i].date[1]) === (curMonth() * 1) &&
						Number(events[i].date[2]) >= startFrom) {
						newEvents[k] = events[i];
						k++;
					}
				}
				if (!newEvents.length)
					return 'No events';
				else return newEvents;
			}
			return 'No events';
		}

		let SortByDate = (ev) => {
			var events = ev;
			if (events.length > 0) {
				for (let j = 0; j < events.length; j++)
					for (let i = 0; i < events.length - 1; i++)
						if (events[i].date[2] > events[i + 1].date[2]) {
							let d = events[i];
							events[i] = events[i + 1];
							events[i + 1] = d;
						}
				return events;
			}
			return events;
		}

		let SortByHour = (ev) => {
			var events = ev;
			if (events.length > 0) {
				for (let j = 0; j < events.length; j++)
					for (let i = 0; i < events[j].events.length; i++)
						for (let k = 0; k < events[j].events.length - 1; k++)
							if (events[j].events[k].hour > events[j].events[k + 1].hour) {
								let d = events[j].events[k];
								events[j].events[k] = events[j].events[k + 1];
								events[j].events[k + 1] = d;
							}
				return events;
			}
			return events;
		}

		let SortByMinutes = (ev) => {
			var events = ev;
			if (events.length > 0) {
				for (let j = 0; j < events.length; j++)
					for (let i = 0; i < events[j].events.length; i++)
						for (let k = 0; k < events[j].events.length - 1; k++)
							if (events[j].events[k].hour === events[j].events[k + 1].hour &&
								events[j].events[k].minutes > events[j].events[k + 1].minutes) {
								let d = events[j].events[k];
								events[j].events[k] = events[j].events[k + 1];
								events[j].events[k + 1] = d;
							}
				return events;
			}
			return events;
		}
		var events = this.events();
		let sortedByMonth = SortByMonth(events);
		if (sortedByMonth === 'No events')
			return 'No events'
		let sortedByDate = SortByDate(sortedByMonth);
		let sortedByHour = SortByHour(sortedByDate);
		var sortedByMinutes = SortByMinutes(sortedByHour);
		var ev = [];
		var currentYear = Number(this.currentYear());
		var currentMonth = Number(this.currentMonth());
		var currentDay = Number(this.currentDay());
		let printEvents = (index) => {
			var i = index;
			for (let n = 0; n < sortedByMinutes[i].events.length; n++) {
				let data = moment({
					'year': sortedByMinutes[i].date[0],
					'month': sortedByMinutes[i].date[1],
					'date': sortedByMinutes[i].date[2],
					'hour': sortedByMinutes[i].events[n].hour,
					'minute': sortedByMinutes[i].events[n].minutes,
					'second': 0,
					'millisecond': 0
				}).format('HH : mm');
				let m = [sortedByMinutes[i].date, sortedByMinutes[i].events[n]];
				ev.push(
					<span key={i + " " + n} onClick={(e) => { this.onEventClick(e, m) }}>
						<div className="event" >
							<div className="event-time">
								<span>{sortedByMinutes[i].events[n].name}</span>
								<span>{data}</span>
							</div>
							<div className="event-body">{sortedByMinutes[i].events[n].body}</div>
						</div>
					</span>
				);
			}
		}
		for (let i = 0; i < sortedByMinutes.length; i++) {
			let dateEvent = moment({
				'year': sortedByMinutes[i].date[0],
				'month': sortedByMinutes[i].date[1],
				'date': sortedByMinutes[i].date[2],
				'hour': 0,
				'minute': 0,
				'second': 0,
				'millisecond': 0
			}).format('dddd, D MMMM');
			if (sortedByMinutes[i].date[0] === currentYear &&
				sortedByMinutes[i].date[1] === currentMonth &&
				sortedByMinutes[i].date[2] === currentDay) {
				ev.push(
					<div key={i + 'r' + 24} className="events-today">
						{dateEvent}
					</div>
				);
			}
			else {
				ev.push(
					<div key={i + 'r' + 24} className="events-day">
						{dateEvent}
					</div>
				);
			}
			printEvents(i);
		}
		return ev;
	}

	render() {
		let weekdays = this.weekdaysShort.map(day => {
			let d = day[0];
			return (
				<td key={day} className="week-day">{d}</td>
			)
		});

		let blanks = [];
		for (let i = 0; i < this.firstDayOfMonth(); i++) {
			blanks.push(
				<td key={(i + 1) * 134} className="day">{""}</td>
			);
		}
		let blanks2 = [];
		for (let i = 0; i < 7; i++) {
			blanks2.push(
				<td key={(i + 1) * 135} className="day">{""}</td>
			);
		}

		let daysInMonth = [];
		for (let d = 1; d < this.daysInMonth() + 1; d++) {
			let day = d;
			var newClass = '';
			let events = this.events();

			for (let i = 0; i < events.length; i++) {
				if (Number(events[i].date[0]) === Number(this.year()) &&
					Number(events[i].date[1]) === Number(this.dateContext().get('month')) &&
					Number(events[i].date[2]) === Number(d)) {
					newClass += ' day-event';
				}
			}

			if (d === Number(this.currentDay()) &&
				this.currentMonth() === this.dateContext().get('month') &&
				this.currentYear() === this.dateContext().get('year')
			) { newClass += " current-day"; }
			daysInMonth.push(
				<td key={d} className="day" onClick={(e) => { this.onDayClick(e, day, this.month(), this.year()); }}>
					<div className={newClass}>{d}</div>
				</td>
			);
		}

		var totalSlots = [...blanks, ...daysInMonth, ...blanks2];
		let rows = [];
		let cells = [];
		totalSlots.forEach((row, i) => {
			if ((i % 7) !== 0) {
				cells.push(row);
			} else {
				let insertRow = cells.slice();
				rows.push(insertRow);
				cells = [];
				cells.push(row);
			}
			if (i === (totalSlots - 1)) {
				let insertRow = cells.slice();
				rows.push(insertRow);
			}
		});

		let trByMonth = rows.map((d, i, arr) => {
			return (
				<tr key={i * 121} className="getWeekTr">{d}</tr>
			);
		});

		let trByWeek = rows[this.week() + 1];

		return (
			<div className="calendar-container">

				{this.state.showAddPopup && <this.AddPanel />}

				{this.state.showEventPanel && <this.EventPanel />}

				{this.state.showCalendar &&
					<span>
						<table className="calendar-header-month">
							<tbody>

								<tr className="year-and-add">
									<td colSpan="2" className="year">
										<a onClick={e => { }}>{this.year()}</a>
									</td>
									<td className="today">
										<a onClick={e => { this.todayMonth() }}>Today</a>
									</td>
									<td colSpan="2" className="add">
										<a onClick={(e) => { this.onPlusClick(e); }}><img className="add-img" src={this.add} alt="" /></a>
									</td>
								</tr>

								<tr className="calendar-header">
									<td colSpan="1" className="prev">
										{this.state.byMonth && <a onClick={e => { this.prevMonth() }}>{this.previous().toUpperCase()}</a>}
										{this.state.byWeek && <a onClick={e => { this.prevWeek() }}>PREV</a>}
									</td>
									<td colSpan="3" className="now">
										<this.MonthNav />
									</td>
									<td colSpan="1" className="next">
										{this.state.byMonth && <a onClick={e => { this.nextMonth() }}>{this.continue().toUpperCase()}</a>}
										{this.state.byWeek && <a onClick={e => { this.nextWeek() }}>NEXT</a>}
									</td>
								</tr>

							</tbody>
						</table>
						<table className="calendar">
							<tbody>
								<tr className="calendar-weekdays">
									{weekdays}
								</tr>
								{this.state.byMonth && trByMonth}
								{this.state.byWeek && <tr className="getWeekTr">{trByWeek}</tr>}
							</tbody>
						</table>

						{this.state.showEvents &&
							<div className="events">
								<this.Events />
							</div>
						}
					</span>
				}
			</div>
		);
	}
}

class App extends Component {
	render() {
		return (
			<div className="App">
				<Calendar />
			</div>
		);
	}
}

export default App;