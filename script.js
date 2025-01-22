// Initialize participants and DCA data
let participants = JSON.parse(localStorage.getItem('participants')) || ['Person 1', 'Person 2', 'Person 3', 'Person 4'];
let dcaData = JSON.parse(localStorage.getItem('dcaData')) || {};

// DOM Elements
const participantList = document.getElementById('participant-list');
const addParticipantButton = document.getElementById('add-participant');
const dcaTableBody = document.getElementById('dca-table-body');

// Render participants
function renderParticipants() {
    participantList.innerHTML = participants.map((name, index) => `
        <li class="flex justify-between items-center">
            <span>${name}</span>
            <button onclick="removeParticipant(${index})" class="text-red-600 hover:text-red-800">
                Remove
            </button>
        </li>
    `).join('');
}

// Render DCA table
function renderDcaTable() {
    const months = generateMonths('January 2025', 'January 2035');
    dcaTableBody.innerHTML = months.map(month => `
        <tr class="border-b">
            <td class="p-3">${month}</td>
            ${participants.map((name, participantIndex) => `
                <td class="p-3">
                    <button
                        onclick="toggleContribution('${month}', ${participantIndex})"
                        class="w-full py-2 rounded ${dcaData[month]?.[participantIndex] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                    >
                        ${name}
                    </button>
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

// Toggle contribution
function toggleContribution(month, participantIndex) {
    if (!dcaData[month]) dcaData[month] = {};
    dcaData[month][participantIndex] = !dcaData[month][participantIndex];
    localStorage.setItem('dcaData', JSON.stringify(dcaData));
    renderDcaTable();
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
