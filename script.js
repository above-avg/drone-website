// Dashboard State
const dashboardState = {
    threatLevel: 0,
    batteryLevel: 85,
    powerMode: "HIGH",
    peopleCount: 0,
    vehiclesCount: 0,
    trackingTarget: null,
    fps: 0,
    detectionCount: 0,
    sessionStart: Date.now(),
    gpsPosition: [12.9716, 77.5946],
    altitude: 50.0,
    communicationStatus: "CONNECTED",
    events: [
        { time: "10:30:15", type: "info", message: "Drone AI system initialized" },
        { time: "10:30:20", type: "success", message: "YOLO model loaded successfully" }
    ]
};

// Update time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('current-time').textContent = timeString;
}

// Update battery display
function updateBattery() {
    const batteryLevel = document.querySelector('.battery-level');
    const batteryPercent = document.getElementById('battery-percent');

    batteryLevel.style.width = `${dashboardState.batteryLevel}%`;
    batteryPercent.textContent = `${dashboardState.batteryLevel}%`;

    // Update battery color based on level
    if (dashboardState.batteryLevel > 70) {
        batteryLevel.style.background = 'linear-gradient(90deg, #00ff00, #00ffaa)';
    } else if (dashboardState.batteryLevel > 30) {
        batteryLevel.style.background = 'linear-gradient(90deg, #ffff00, #ffaa00)';
    } else {
        batteryLevel.style.background = 'linear-gradient(90deg, #ff0000, #ff5555)';
    }
}

// Update threat level
function updateThreatLevel() {
    const threatIndicator = document.getElementById('threat-indicator');
    const threatText = document.getElementById('threat-text');
    const threatDots = document.querySelectorAll('.threat-dot');

    // Remove all active classes
    threatDots.forEach(dot => dot.classList.remove('active'));

    // Activate dots up to current threat level
    for (let i = 0; i <= dashboardState.threatLevel; i++) {
        threatDots[i].classList.add('active');
    }

    // Update threat text and colors
    const threatLevels = ["NO THREAT", "LOW THREAT", "MEDIUM THREAT", "HIGH THREAT"];
    const threatColors = ["#00ff00", "#ffff00", "#ffa500", "#ff0000"];

    threatText.textContent = threatLevels[dashboardState.threatLevel];
    threatIndicator.style.background = `rgba(${hexToRgb(threatColors[dashboardState.threatLevel])}, 0.1)`;
    threatIndicator.style.borderColor = threatColors[dashboardState.threatLevel];
}

// Convert hex color → rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
}

// Update power mode
function updatePowerMode() {
    const powerModeElement = document.getElementById('power-mode');
    powerModeElement.textContent = dashboardState.powerMode;

    const powerColors = {
        "HIGH": "#00ff00",
        "MEDIUM": "#ffff00",
        "LOW": "#ff0000"
    };

    powerModeElement.style.color = powerColors[dashboardState.powerMode];
    powerModeElement.style.borderColor = powerColors[dashboardState.powerMode];
}

// Update session time
function updateSessionTime() {
    const sessionTimeElement = document.getElementById('session-time');
    const elapsed = Math.floor((Date.now() - dashboardState.sessionStart) / 1000);
    sessionTimeElement.textContent = `${elapsed}s`;
}

// Update detection statistics
function updateDetectionStats() {
    document.getElementById('people-count').textContent = dashboardState.peopleCount;
    document.getElementById('vehicles-count').textContent = dashboardState.vehiclesCount;
    document.getElementById('total-detections').textContent = dashboardState.detectionCount;
    document.getElementById('tracking-target').textContent = dashboardState.trackingTarget || "None";
    document.getElementById('fps-counter').textContent = dashboardState.fps;
    document.getElementById('detection-count').textContent = dashboardState.detectionCount;
}

// Update GPS
function updateGPS() {
    document.getElementById('gps-lat').textContent = dashboardState.gpsPosition[0].toFixed(6);
    document.getElementById('gps-lon').textContent = dashboardState.gpsPosition[1].toFixed(6);
    document.getElementById('gps-alt').textContent = `${dashboardState.altitude.toFixed(1)}m`;
}

// Update event log
function updateEventsLog() {
    const eventsLog = document.getElementById('events-log');
    eventsLog.innerHTML = '';

    dashboardState.events.slice(-5).forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';

        eventElement.innerHTML = `
            <span class="event-time">${event.time}</span>
            <span class="event-type ${event.type}">${getEventTypeText(event.type)}</span>
            <span class="event-message">${event.message}</span>
        `;

        eventsLog.appendChild(eventElement);
    });
}

function getEventTypeText(type) {
    const typeMap = {
        "info": "INFO",
        "success": "SUCCESS",
        "warning": "WARNING",
        "error": "ERROR"
    };
    return typeMap[type] || "INFO";
}

// Add a new event
function addEvent(type, message) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    dashboardState.events.push({
        time: timeString,
        type: type,
        message: message
    });

    // Keep last 10 events only
    if (dashboardState.events.length > 10) {
        dashboardState.events.shift();
    }

    updateEventsLog();
}

// Simulation logic
function simulateSystemUpdates() {
    // Threat level random update
    if (Math.random() < 0.02) {
        dashboardState.threatLevel = Math.floor(Math.random() * 4);
        updateThreatLevel();

        const threatMessages = [
            "No threats detected",
            "Single person detected",
            "Multiple people detected",
            "Vehicle detected - elevated threat"
        ];

        addEvent("warning", threatMessages[dashboardState.threatLevel]);
    }

    // Battery drain
    if (Math.random() < 0.1) {
        dashboardState.batteryLevel = Math.max(5, dashboardState.batteryLevel - 0.1);
        updateBattery();

        if (dashboardState.batteryLevel > 70) dashboardState.powerMode = "HIGH";
        else if (dashboardState.batteryLevel > 30) dashboardState.powerMode = "MEDIUM";
        else dashboardState.powerMode = "LOW";

        updatePowerMode();
    }

    // Detection stats
    if (Math.random() < 0.3) {
        dashboardState.peopleCount = Math.floor(Math.random() * 5);
        dashboardState.vehiclesCount = Math.floor(Math.random() * 3);
        dashboardState.detectionCount += 1;
        dashboardState.fps = 20 + Math.floor(Math.random() * 10);

        const targets = [null, "person", "vehicle", "multiple objects"];
        dashboardState.trackingTarget = targets[Math.floor(Math.random() * targets.length)];

        updateDetectionStats();
    }

    // GPS movement
    if (Math.random() < 0.2) {
        dashboardState.gpsPosition[0] += (Math.random() - 0.5) * 0.0001;
        dashboardState.gpsPosition[1] += (Math.random() - 0.5) * 0.0001;
        dashboardState.altitude += (Math.random() - 0.5) * 0.5;

        updateGPS();
    }

    // Communication status
    if (Math.random() < 0.01) {
        dashboardState.communicationStatus =
            Math.random() < 0.7 ? "CONNECTED" : "RECONNECTING";

        document.getElementById('comms-status').textContent =
            dashboardState.communicationStatus;

        if (dashboardState.communicationStatus === "RECONNECTING") {
            addEvent("warning", "Communication link unstable");
        } else {
            addEvent("success", "Communication restored");
        }
    }
}

// Initialize
function initializeDashboard() {
    setInterval(updateTime, 1000);
    setInterval(updateSessionTime, 1000);
    setInterval(simulateSystemUpdates, 1000);

    updateTime();
    updateBattery();
    updateThreatLevel();
    updatePowerMode();
    updateSessionTime();
    updateDetectionStats();
    updateGPS();
    updateEventsLog();

    setTimeout(() => addEvent("success", "AI model initialized successfully"), 2000);
    setTimeout(() => addEvent("info", "Tracking system activated"), 4000);
    setTimeout(() => addEvent("success", "All systems operational"), 6000);
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
