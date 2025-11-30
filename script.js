// Open modal window
function openWindow(id) {
    document.getElementById(id).style.display = "block";
}

// Close modal window
function closeWindow(id) {
    document.getElementById(id).style.display = "none";
}

function rectanglesOverlap(r1, r2) {
    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}

function placeFolderWithoutOverlap(folder, placed) {
    const folderWidth = 120;
    const folderHeight = 110;

    let tries = 0;

    while (tries < 2000) {
        const x = Math.random() * (window.innerWidth - folderWidth - 40);
        const y = Math.random() * (window.innerHeight - folderHeight - 40);

        const newRect = {
            left: x,
            top: y,
            right: x + folderWidth,
            bottom: y + folderHeight
        };

        let overlaps = false;

        for (let p of placed) {
            if (rectanglesOverlap(newRect, p)) {
                overlaps = true;
                break;
            }
        }

        if (!overlaps) {
            folder.style.left = `${x}px`;
            folder.style.top = `${y}px`;
            placed.push(newRect);
            return;
        }

        tries++;
    }

    console.warn("Could not place folder without overlap");
}

document.addEventListener("DOMContentLoaded", () => {
    const folders = document.querySelectorAll(".folder");

    let placed = [];

    folders.forEach(folder => {
        placeFolderWithoutOverlap(folder, placed);

        folder.addEventListener("click", () => {
            const modalId = folder.getAttribute("data-modal");
            if (modalId) openWindow(modalId);
        });
    });
});

// ==== CLOCK ====
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString();
    document.getElementById("taskbar-clock").textContent = `${time} | ${date}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==== SETTINGS: BACKGROUND CHANGE ====
function changeBackground() {
    const color = document.getElementById("bgColorPicker").value;
    document.body.style.backgroundColor = color;
    document.getElementById("desktop").style.backgroundColor = color;
}

// ==== TERMINAL ====
function terminalEnter(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("terminalInput");
        const screen = document.getElementById("terminalScreen");

        screen.innerHTML += `<div>> ${input.value}</div>`;
        screen.scrollTop = screen.scrollHeight;

        input.value = "";
    }
}

// ===== BOOT SCREEN =====
document.addEventListener("DOMContentLoaded", () => {
    runBootSequence();
});

function runBootSequence() {
    const bootLines = [
        "Initializing Portfolio OS v1.0...",
        "Loading system modules...",
        "Starting UI renderer...",
        "Checking memory...",
        "Boot sequence OK.",
        "Launching desktop..."
    ];

    const bootText = document.getElementById("bootText");
    let i = 0;

    function typeNextLine() {
        if (i < bootLines.length) {
            bootText.innerHTML += bootLines[i] + "\n";
            i++;
            setTimeout(typeNextLine, 300); // typing speed
        }
    }

    typeNextLine();

    // Hide boot screen after 2 seconds + typing time
    setTimeout(() => {
        const boot = document.getElementById("bootScreen");
        boot.classList.add("boot-hide");
        setTimeout(() => boot.remove(), 1000); // fully remove after fade
    }, 2500)/* --------------------------------------------------------------------------
    WINDOW MANAGEMENT (Open & Close Windows)
-------------------------------------------------------------------------- */

/**
 * Opens a modal window by ID.
 * @param {string} id - The ID of the modal to open.
 */
function openWindow(id) {
    document.getElementById(id).style.display = "block";
}

/**
 * Closes a modal window by ID.
 * @param {string} id - The ID of the modal to close.
 */
function closeWindow(id) {
    document.getElementById(id).style.display = "none";
}

/* --------------------------------------------------------------------------
    FOLDER PLACEMENT SYSTEM (Avoid Overlapping Desktop Icons)
-------------------------------------------------------------------------- */

/**
 * Checks if two rectangles overlap.
 * Used to prevent desktop folder icons from overlapping.
 *
 * @param {Object} r1 - First rectangle (left, right, top, bottom)
 * @param {Object} r2 - Second rectangle
 * @returns {boolean} True if rectangles overlap
 */
function rectanglesOverlap(r1, r2) {
    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}

/**
 * Randomly positions folder icons while preventing overlap.
 *
 * @param {HTMLElement} folder - The folder element to position.
 * @param {Array} placed - List of previously placed folder rectangles.
 */
function placeFolderWithoutOverlap(folder, placed) {
    const folderWidth = 120;
    const folderHeight = 110;

    // Mini terminal area
    const mini = document.getElementById("miniTerminal");
    const miniRect = mini.getBoundingClientRect();

    let tries = 0;

    while (tries < 2000) {
        const x = Math.random() * (window.innerWidth - folderWidth - 20); // leave some right margin
        const y = Math.random() * (window.innerHeight - folderHeight - 20); // leave some bottom margin

        const newRect = {
            left: x,
            top: y,
            right: x + folderWidth,
            bottom: y + folderHeight
        };

        let overlaps = false;

        // Check overlap with other folders
        for (let p of placed) {
            if (rectanglesOverlap(newRect, p)) {
                overlaps = true;
                break;
            }
        }

        // Check overlap with mini terminal
        if (!overlaps &&
            !(newRect.right < miniRect.left ||
              newRect.left > miniRect.right ||
              newRect.bottom < miniRect.top ||
              newRect.top > miniRect.bottom)) {
            overlaps = true;
        }

        if (!overlaps) {
            folder.style.left = `${x}px`;
            folder.style.top = `${y}px`;
            placed.push(newRect);
            return;
        }

        tries++;
    }

    console.warn("Could not place folder without overlap");
}


/**
 * Places all desktop folder icons once the page loads.
 */
document.addEventListener("DOMContentLoaded", () => {
    const folders = document.querySelectorAll(".folder");
    let placed = [];

    folders.forEach(folder => {
        placeFolderWithoutOverlap(folder, placed);

        // Click to open modal
        folder.addEventListener("click", () => {
            const modalId = folder.getAttribute("data-modal");
            if (modalId) openWindow(modalId);
        });
    });
});

/* --------------------------------------------------------------------------
    TASKBAR CLOCK (Live Date + Time)
-------------------------------------------------------------------------- */

/**
 * Updates the digital clock in the taskbar every second.
 */
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString();

    document.getElementById("taskbar-clock").textContent = `${time} | ${date}`;
}

setInterval(updateClock, 1000);
updateClock();

/* --------------------------------------------------------------------------
    SETTINGS PANEL — BACKGROUND COLOR SELECTOR
-------------------------------------------------------------------------- */

/**
 * Changes the desktop background color based on color picker selection.
 */
function changeBackground() {
    const color = document.getElementById("bgColorPicker").value;
    document.body.style.backgroundColor = color;
    document.getElementById("desktop").style.backgroundColor = color;
}

/* --------------------------------------------------------------------------
    TERMINAL WINDOW (Fake Command Input)
-------------------------------------------------------------------------- */

/**
 * Handles Enter key inside terminal input:
 * - Prints the command on the screen
 * - Scrolls to bottom
 * - Clears input
 *
 * @param {KeyboardEvent} event - Key press event
 */
function terminalEnter(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("terminalInput");
        const screen = document.getElementById("terminalScreen");

        screen.innerHTML += `<div>> ${input.value}</div>`;
        screen.scrollTop = screen.scrollHeight;

        input.value = "";
    }
}

/* --------------------------------------------------------------------------
    BOOT SCREEN SIMULATION
-------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    runBootSequence();
});

/**
 * Displays a fake OS boot-up animation:
 * - Types loading lines progressively
 * - Fades out after animation
 */
function runBootSequence() {
    const bootLines = [
        "Initializing Portfolio OS v1.0...",
        "Loading system modules...",
        "Starting UI renderer...",
        "Checking memory...",
        "Boot sequence OK.",
        "Launching desktop..."
    ];

    const bootText = document.getElementById("bootText");
    let i = 0;

    /** Types next line with animation */
    function typeNextLine() {
        if (i < bootLines.length) {
            bootText.innerHTML += bootLines[i] + "\n";
            i++;
            setTimeout(typeNextLine, 300);
        }
    }

    typeNextLine();

    // Hide boot screen after typing
    setTimeout(() => {
        const boot = document.getElementById("bootScreen");
        boot.classList.add("boot-hide");

        // Remove from DOM after fade-out
        setTimeout(() => boot.remove(), 1000);
    }, 2500);
}

/* --------------------------------------------------------------------------
    MINI TERMINAL INFO (Static System Widget)
-------------------------------------------------------------------------- */

/**
 * Loads system info widget:
 * - Shows name, system name, running status
 * - Auto-updates copyright year
 */
function loadMiniTerminal() {
    const mini = document.getElementById("miniTerminalText");
    const year = new Date().getFullYear();

    mini.innerText =
        "System: Portfolio OS\n" +
        "Status: Running...\n" +
        `© ${year} Nirajan Shrestha`;
}

loadMiniTerminal();

}

// ===== MINI TERMINAL INFO =====
function loadMiniTerminal() {
    const mini = document.getElementById("miniTerminalText");
    const year = new Date().getFullYear();

    mini.innerText =
        "User: Nirajan Shrestha\n" +
        "System: Portfolio OS\n" +
        "Status: Running...\n" +
        `© ${year} Nirajan Shrestha`;
}

loadMiniTerminal();

