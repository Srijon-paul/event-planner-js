# 📅 Event Planner - JavaScript Calendar App

This is a **simple event planner web app** built with **vanilla JavaScript, HTML, and CSS**. It allows users to view a calendar by month and year, and add or remove events for specific dates. This project was developed as a **learning experience**, focusing on manipulating dates using JavaScript's native `Date` object — without relying on any external calendar APIs.

## Live Preview

### [**Open Project**](https://event-planner-js.netlify.app/) 

## Features

- Dynamically generated monthly calendar view
- Add events to specific dates
- Display events on selected dates
- Delete events
- Store and retrieve events using `localStorage`
- Navigation between months and years

## Tech Stack

- **HTML** - Structure of the app
- **CSS** - Basic styling and layout
- **JavaScript** - Core logic and event handling
  - Custom use of `Date` object
  - DOM manipulation
  - `localStorage` for saving events

## Goals

- Build a calendar UI from scratch
- Avoid using third-party calendar APIs/libraries
- Understand and practice dynamic DOM manipulation
- Learn to handle date objects and browser-based storage

## Known Issues / Challenges Faced

- **Handling multiple interactions on same date cells**:  
  Capturing different types of events (like selection, adding, or removing) on the same date cell sometimes led to conflicts due to overlapping event listeners.

- **Event display logic**:  
  Selecting and deselecting a date with events sometimes still displayed stale data due to timing issues or event delegation bugs.

- **No calendar API used**:  
  As a deliberate design choice, no external API (like FullCalendar or Google Calendar) was used. Instead, JavaScript’s `Date` object was manually manipulated.  
  ➤ This provides better learning but also introduces **edge cases** and **bugs**, especially related to:
  - Month boundaries
  - Leap year calculations
  - Day-of-week alignment

- **Styling is minimal**:  
  The main focus was on **functionality**, **not UI/UX design**. As a result, the interface may look plain or lack responsiveness on different screen sizes.

## Project Structure

```plaintext
event-planner-js/
│
├── index.html       // Main HTML file for the calendar
├── style.css        // Basic styling for layout and elements
├── script.js        // Core JavaScript logic for calendar, events, and storage
└── README.md        // Project description
```

## Future Improvements

- Improve UI/UX with modern styles (Tailwind, Bootstrap, or custom responsive design)
- Fix bugs related to multi-click event capturing
- Highlight dates with saved events
- Add filtering/search for events
- Export events as .ics or JSON file

## Developed by

**Srijon Paul**  
[GitHub Profile](https://github.com/Srijon-paul)

---

> 🔍 _Note: This project is still under development and serves as a personal learning project. Contributions, suggestions, and feedback are welcome!_