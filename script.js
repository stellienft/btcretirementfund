// Initialize participants and DCA data
let participants = JSON.parse(localStorage.getItem('participants')) || ['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5', 'Person 6', 'Person 7', 'Person 8'];
let dcaData = JSON.parse(localStorage.getItem('dcaData')) || {};

// DOM Elements
const participantList = document.getElementById('participant-list');
const addParticipantButton = document.getElementById('add-participant');
const dcaTableBody = document.querySelector('#dca-table tbody');

// Render participants
function renderParticipants() {
    participantList.innerHTML = participants.map((name, index) => `
        <li>
            ${name}
            <button onclick="removeParticipant(${index})">Remove</button>
        </li>
    `).join('');
}

// Render DCA table
function renderDcaTable() {
    const months = generateMonths('January 2025', 'January 2035');
    dcaTableBody.innerHTML = months.map(month => `
        <tr>
            <td>${month}</td>
            ${participants.map((_, participantIndex) => `
                <td>
                    <input
                        type="checkbox"
                        data-month="${month}"
                        data-participant="${participantIndex}"
                        ${dcaData[month]?.[participantIndex] ? 'checked' : ''}
                        onchange="saveCheckboxState(event)"
                    >
                </td>
            `).join('')}
        </tr>
    `).join('');
}

// Add a new participant
addParticipantButton.addEventListener('click', () => {
    const name = prompt('Enter the name of the new participant:');
    if (name) {
        participants.push(name);
        localStorage.setItem('participants', JSON.stringify(participants));
        renderParticipants();
        renderDcaTable();
    }
});

// Remove a participant
function removeParticipant(index) {
    participants.splice(index, 1);
    localStorage.setItem('participants', JSON.stringify(participants));
    renderParticipants();
    renderDcaTable();
}

// Save checkbox state
function saveCheckboxState(event) {
    const checkbox = event.target;
    const month = checkbox.getAttribute('data-month');
    const participantIndex = checkbox.getAttribute('data-participant');

    if (!dcaData[month]) dcaData[month] = {};
    dcaData[month][participantIndex] = checkbox.checked;

    localStorage.setItem('dcaData', JSON.stringify(dcaData));
}

// Generate months between two dates
function generateMonths(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = [];

    while (startDate <= endDate) {
        months.push(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(startDate));
        startDate.setMonth(startDate.getMonth() + 1);
    }

    return months;
}

// Initial render
renderParticipants();
renderDcaTable();
