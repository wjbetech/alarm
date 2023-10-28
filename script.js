// doc grabbers and selectors
const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarm-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./alarm.mp3");

// vars
let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;

// fix <10 values
const appendZero = (value) => (value < 10 ? "0" + value : value);

// display time and trigger alarms
const displayTimer = () => {
  const date = new Date();
  const currentTime = date.toLocaleTimeString("en-US", {
    hour12: false,
  });
  timerRef.textContent = currentTime;

  // trigger alarm if needed
  alarmsArray.forEach((alarm) => {
    if (alarm.isActive && alarm.time === currentTime.slice(0, 5)) {
      alarmSound.play();
    }
  });
};

// alarm builder
const createAlarm = (hour, minute) => {
  alarmIndex += 1;

  // alarm object
  const alarmObject = {
    id: `${alarmIndex}_${hour}_${minute}`,
    time: `${appendZero(hour)}:${appendZero(minute)}`,
    isActive: false,
  };

  // add new alarm to alarms
  alarmsArray.push(alarmObject);
  const alarmDiv = document.createElement("div");
  alarmDiv.className = "alarm";
  alarmDiv.dataset.id = alarmObject.id;
  alarmDiv.innerHTML = `<span>${alarmObject.time}</span>`;

  // completion checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    toggleAlarm(alarmObject);
  });
  alarmDiv.appendChild(checkbox);

  // delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class='bx bx-trash'></i>`;
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", () => {
    deleteAlarm(alarmObject);
  });
  alarmDiv.appendChild(deleteButton);

  // add alarm to UI
  activeAlarms.appendChild(alarmDiv);
};

// toggle state of alarm
const toggleAlarm = (alarm) => {
  alarm.isActive = alarm.isActive;
  if (alarm.isActive) {
    const currentTime = new Date()
      .toLocaleTimeString("en-US", { hour12: false })
      .slice(0, 5);
    if (alarm.time === currentTime) {
      alarmSound.play();
    } else {
      alarmSound.pause();
    }
  }
};

// delete an alarm
const deleteAlarm = (alarm) => {
  const index = alarmsArray.indexOf(alarm);
  if (index > -1) {
    alarmsArray.splice(index, 1);
    document.querySelector(`[data-id="${alarm.id}"]`).remove();
  }
};

// clear all alarms listener
clearAllButton.addEventListener("click", () => {
  alarmsArray = [];
  activeAlarms.innerHTML = "";
});

// set a new alarm
setAlarm.addEventListener("click", () => {
  // parse values
  let hour = parseInt(hourInput.value) || 0;
  let minute = parseInt(minuteInput.value) || 0;

  // validate inputs
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    alert("Please enter a valid time!");
    return;
  }

  if (
    !alarmsArray.some(
      (alarm) => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`
    )
  ) {
    createAlarm(hour, minute);
  }

  // clear fields
  [hourInput.value, minuteInput.value] = ["", ""];
});

// initialize timer and inputs
window.onload = () => {
  setInterval(displayTimer, 1000);
  [hourInput.value, minuteInput.value] = ["", ""];
};
