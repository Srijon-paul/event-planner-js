document.addEventListener("DOMContentLoaded", () => {

	// variable declaration
	const formInput = document.getElementById("eventText");
	const formButton = document.getElementById("formButton");
	const removeButton = document.getElementById("removeButton");
	const monthsDropdown = document.getElementById("monthsDropdown");
	const yearDropdown = document.getElementById("yearDropdown");
	const week1Grid = document.getElementById("week1");
	const todayEvents = document.querySelectorAll(".todayEve");
	const yourEvents = document.querySelectorAll(".yourEve");
	const displayEventSelect = document.querySelector(".displayEvent");

	// variables for current dates
	let date = new Date;
	let currentMonthNum = date.getMonth();
	let currentMonth = date.toString().substring(4, 7);
	let currentDate = date.getDate();
	let currentYear = date.getFullYear();

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const years = [2025, 2026, 2027, 2028, 2029, 2030];
	const currentEventsObject = JSON.parse(localStorage.getItem("currentEvents")) || {};
	const todayEventsObject = JSON.parse(localStorage.getItem("todayEvents")) || {};

	// removing today events on changing current date
	const mm = String(currentMonthNum + 1).padStart(2, "0");
	const dd = String(currentDate).padStart(2, "0");
	const actualTodayString = `${currentYear}-${mm}-${dd}`;
	for (let date in todayEventsObject) {
		if (date !== actualTodayString) {
			delete todayEventsObject[date];
			localStorage.setItem("todayEvents", JSON.stringify(todayEventsObject));
		}
	}

	// moving current event to today event
	if (currentEventsObject[actualTodayString]) {
		todayEventsObject[actualTodayString] = currentEventsObject[actualTodayString];
		delete currentEventsObject[actualTodayString];
		localStorage.setItem("todayEvents", JSON.stringify(todayEventsObject));
		localStorage.setItem("currentEvents", JSON.stringify(currentEventsObject));
	}

	calendarRender();
	monthYearRender();
	clickCapture();
	renderEvents();

	// function for rendering dropdown month and year menu
	function monthYearRender() {
		months.forEach((month) => {
			const monthOptionCreate = document.createElement("option");
			monthOptionCreate.setAttribute("value", month.substring(0, 3));
			monthOptionCreate.innerText = month;
			monthsDropdown.appendChild(monthOptionCreate);
			if (monthOptionCreate.getAttribute("value") === currentMonth) {
				monthOptionCreate.setAttribute("selected", "");
			}
		})
		years.forEach((year) => {
			const yearOptionCreate = document.createElement("option");
			yearOptionCreate.setAttribute("value", year);
			yearOptionCreate.innerText = year;
			yearDropdown.appendChild(yearOptionCreate);
			if (yearOptionCreate.getAttribute("value") === currentYear) {
				yearOptionCreate.setAttribute("selected", "");
			}
		});
	}

	//storing selection of the current month and year of dropdown for rendering
	let selectedYear = parseInt(yearDropdown.selectedOptions[0].innerText);
	let selectedMonth = monthsDropdown.selectedIndex;

	//function of capturing months and year on selecting from menu
	function clickCapture() {
		monthsDropdown.addEventListener("change", (e) => {
			const selectedOption = monthsDropdown.querySelectorAll("option");
			selectedOption.forEach((o) => o.removeAttribute("selected"));
			selectedMonth = e.target.selectedIndex;
			selectedOption[selectedMonth].setAttribute("selected", "");
			dateRender();
		})
		yearDropdown.addEventListener("change", (e) => {
			const selectedOption = yearDropdown.querySelectorAll("option");
			selectedOption.forEach((o) => o.removeAttribute("selected"));
			e.target.selectedOptions[0].setAttribute("selected", "");
			selectedYear = parseInt(e.target.selectedOptions[0].innerText);
			dateRender();
		})
	}

	// function for rendering calendar box grid
	function calendarRender() {
		week1Grid.innerHTML = "";
		for (let i = 0; i < 42; i++) {
			const gridCreate = document.createElement("th");
			gridCreate.setAttribute("id", i);
			week1Grid.appendChild(gridCreate);
		}
	}

	// function for rendering date in grid
	dateRender();
	function dateRender() {
		const startDay = new Date(selectedYear, selectedMonth, 1).getDay();
		const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
		let thWeek = document.querySelectorAll("#week1 th");
		thWeek.forEach(cell => {
			cell.innerText = "";
			cell.classList.remove("currDate")
		});
		for (let i = 0; i < daysInMonth; i++) {
			const cellIndex = startDay + i;
			if (cellIndex < thWeek.length) {
				thWeek[cellIndex].innerText = i + 1;
				if (currentDate === parseInt(thWeek[cellIndex].innerText) && (currentYear === selectedYear && currentMonthNum === selectedMonth)) {
					week1Grid.children[cellIndex].classList.add("currDate")
				}
			}
			eventStyleAddRemove(week1Grid.children[cellIndex]);
		}
		thWeek.forEach((cell) => {
			if (cell.innerText === "" && Number(cell.id) > 28) {
				cell.classList.add("hidden")
			} else {
				cell.classList.remove("hidden")
			}
		})
		renderEventStyle();
	}

	// function of selecting each dates from the grid
	selectGrid();
	function selectGrid() {
		week1Grid.addEventListener("click", (e) => {
			const isSelected = e.target.classList.contains("select");
			if (e.target.innerText !== "" && e.target.tagName === "TH") {
				remButton(e);
				Array.from(week1Grid.children).forEach(cell => {
					cell.classList.remove("select");
				});
				if (!isSelected) {
					e.target.classList.add("select");
				}
			}
			dateRender();
		});
	}

	// function for returning added event id
	function addedEventId(cell) {
		const cellDate = parseInt(cell.innerText.trim()).toString().padStart(2, "0");
		const cellMonth = (selectedMonth + 1).toString().padStart(2, "0")
		let creDate = `${selectedYear}-${cellMonth}-${cellDate}`;
		return creDate;
	}

	// function for rendering event styling on page reload
	function renderEventStyle() {
		for (arr in currentEventsObject) {
			Array.from(week1Grid.children).forEach((cell) => {
				if ((Number(arr.substring(0, 4)) === selectedYear) && (Number(arr.substring(5, 7)) === selectedMonth + 1)) {
					if (arr.substring(8, 10) === cell.innerText.padStart(2, "0")) {
						cell.classList.add("eventStyle");
					}
					if (cell.innerText === "") {
						cell.classList.remove("eventStyle")
					}
				}
			})
		}
	}

	// function for rendering events on page reload
	function renderEvents() {
		yourEvents[0].querySelectorAll("p:not(.noEvent)").forEach(p => p.remove());
		yourEvents[0].querySelector(".noEvent").classList.remove("hidden");
		todayEvents[0].querySelectorAll(`.d${actualTodayString.replace(/-/g, "")}`).forEach(p => p.remove());
		todayEvents[0].querySelector(".noEvent").classList.remove("hidden");

		for (arr in currentEventsObject) {
			currentEventsObject[arr].forEach(item => {
				let creDateString = `d${Object.values(arr).join("").replace(/-/g, "")}`
				const elementCreate = document.createElement("p");
				elementCreate.classList.add(creDateString);
				yourEvents[0].children[0].classList.add("hidden")
				elementCreate.innerText = `${arr}: ${item}`;
				yourEvents[0].appendChild(elementCreate);
			})
		}
		for (arr in todayEventsObject) {
			todayEventsObject[arr].forEach(item => {
				const elementCreate = document.createElement("p");
				elementCreate.classList.add(`d${actualTodayString.replace(/-/g, "")}`);
				todayEvents[0].children[0].classList.add("hidden");
				elementCreate.innerText = `${item}`;
				todayEvents[0].appendChild(elementCreate);
			})
		}
		formInput.value = "";
	}

	// function for appending event childs
	function eventChild(cell, e) {
		let creDateString = addedEventId(cell);
		const cellDate = parseInt(cell.innerText.trim()).toString().padStart(2, "0");
		const cellMonth = (selectedMonth + 1).toString().padStart(2, "0")
		let eventValue = e.target.parentNode.children[0].value;
		yourEvents[0].children[0].classList.add("hidden");
		let elementCreate = document.createElement("p");
		elementCreate.classList.add(`d${creDateString.replace(/-/g, "")}`);
		elementCreate.innerText = `${selectedYear}-${cellMonth}-${cellDate}: ${eventValue}`;
		yourEvents[0].appendChild(elementCreate);
		if (!currentEventsObject[creDateString]) {
			currentEventsObject[creDateString] = [];
		}
		currentEventsObject[creDateString].push(eventValue);
		localStorage.setItem("currentEvents", JSON.stringify(currentEventsObject));
		formInput.value = "";
	}

	// function for adding and removing eventStyle
	function eventStyleAddRemove(cell) {
		const creDateString = addedEventId(cell)
		if ((cell.classList.contains(creDateString) && cell.classList.contains("select")) || cell.classList.contains(creDateString) || (cell.classList.contains("currDate") && cell.classList.contains(creDateString))) {
			cell.classList.add("eventStyle");
		} else {
			cell.classList.remove("eventStyle");
		}
	}

	// function for adding events
	addEvents();
	function addEvents() {
		let eventValue, elementCreate;
		formButton.addEventListener("click", (e) => {
			e.preventDefault();
			if (formInput.value !== "") {
				Array.from(week1Grid.children).forEach(cell => {

					// adding events to "upcoming events"
					if (!cell.classList.contains(`currDate`) && cell.classList.contains("select")) {
						if (selectedMonth > currentMonthNum) {
							eventChild(cell, e);
							formInput.value = "";
						}
						else if (selectedMonth === currentMonthNum) {
							if (Number(cell.innerText) >= currentDate) {
								eventChild(cell, e);
								formInput.value = "";
							}
						}
					}
					// adding events to "today's events"
					else if (cell.classList.contains(`currDate`) && cell.classList.contains("select")) {
						eventValue = e.target.parentNode.children[0].value;
						todayEvents[0].children[0].classList.add("hidden");
						elementCreate = document.createElement("p");
						elementCreate.classList.add(`d${actualTodayString.replace(/-/g, "")}`);
						elementCreate.innerText = `${eventValue}`;
						todayEvents[0].appendChild(elementCreate);
						if (!todayEventsObject[actualTodayString]) {
							todayEventsObject[actualTodayString] = [];
						}
						todayEventsObject[actualTodayString].push(eventValue);
						localStorage.setItem("todayEvents", JSON.stringify(todayEventsObject));
						cell.classList.remove("select");
						formInput.value = "";
					}
				});
			}
		})
	}

	// function for removing button
	function remButton(e) {
		let target = e.target.classList;
		if ((!target.contains("select") && target.contains("eventStyle"))) {
			removeButton.classList.remove("hidden");
		} else if ((!target.contains("select") && target.contains("currDate"))) {
			removeButton.classList.remove("hidden");
		} else {
			removeButton.classList.add("hidden")
		}
	}

	// function for removing elements
	removeEvents();
	function removeEvents() {
		removeButton.addEventListener("click", (e) => {
			e.preventDefault();
			Array.from(week1Grid.children).forEach((cell) => {
				if (cell.classList.contains("select")) {
					const creDateString = addedEventId(cell)
					if (currentEventsObject[creDateString]) {
						delete currentEventsObject[creDateString];
						localStorage.setItem("currentEvents", JSON.stringify(currentEventsObject));
						renderEvents();
					}
					else if (todayEventsObject[actualTodayString]) {
						delete todayEventsObject[actualTodayString];
						localStorage.setItem("todayEvents", JSON.stringify(todayEventsObject));
						renderEvents();
					}
					cell.classList.remove("eventStyle")
					cell.classList.remove("select")
					cell.classList.remove(creDateString);
				}
			})
		})
	}

	// function for displaying events while selecting dates
	displayEvent();
	function displayEvent() {
		week1Grid.addEventListener("click", (e) => {
			if (e.target.tagName !== "TH" || e.target.innerText === "") return;
			displayEventSelect.querySelectorAll("p").forEach(p => p.remove())
			let creDateString = `d${addedEventId(e.target).replace(/-/g, "")}`
			const isSelected = e.target.classList.contains("select");
			if (isSelected) {
				yourEvents[0].querySelectorAll(`.${creDateString}`).forEach(p => {
					const createElement = document.createElement("p");
					createElement.innerText = p.innerText.substring(12)
					displayEventSelect.appendChild(createElement)
				})
			}
			if(e.target.classList.contains("currDate") && isSelected){
				todayEvents[0].querySelectorAll(`.d${actualTodayString.replace(/-/g, "")}`).forEach(p => {
					const createElement = document.createElement("p");
					createElement.innerText = p.innerText
					displayEventSelect.appendChild(createElement)
				})
			}
		})
	}
	renderEventStyle();
})