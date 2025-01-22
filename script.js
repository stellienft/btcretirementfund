// Initialize participants and DCA data
let participants = JSON.parse(localStorage.getItem('participants')) || ['Person 1', 'Jarryd Lang', 'Josh Wallace'];
let dcaData = JSON.parse(localStorage.getItem('dcaData')) || {};

// DOM Elements
const participantList = document.getElementById('participant-list');
const addParticipantButton = document.getElementById('add-participant');
const dcaTableBody = document.getElementById('dca-table-body');
const totalInvestedElement = document.getElementById('total-invested');
const bitcoinPriceElement = document.getElementById('bitcoin-price');
const numberOfMembersElement = document.getElementById('number-of-members');
const toggleParticipantsButton = document.getElementById('toggle-participants');
const participantsSection = document.getElementById('participants-section');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

// Toggle dark mode
toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Fetch Bitcoin price
async function fetchBitcoinPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud');
        const data = await response.json();
        bitcoinPriceElement.textContent = `$${data.bitcoin.aud} AUD`;
    } catch (error) {
        bitcoinPriceElement.textContent = 'Failed to fetch';
    }
}

// Update number of members
function updateNumberOfMembers() {
    numberOfMembersElement.textContent = participants.length;
}

// Toggle participants section
toggleParticipantsButton.addEventListener('click', () => {
    participantsSection.classList.toggle('hidden');
});

// Render participants
function renderParticipants() {
    participantList.innerHTML = participants.map((name, index) => `
        <li class="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            <span class="text-gray-800">${name}</span>
            <div class="space-x-2">
                <button onclick="editParticipant(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 hover-scale">
                    Edit
                </button>
                <button onclick="removeParticipant(${index})" class="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 hover-scale">
                    Remove
                </button>
            </div>
        </li>
    `).join('');
}

// Render DCA table
function renderDcaTable() {
    const months = generateMonths('January 2025', 'January 2035');
    dcaTableBody.innerHTML = months.map(month => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-2 text-gray-800">${month}</td>
            ${participants.map((name, participantIndex) => `
                <td class="p-2">
                    <button
                        onclick="toggleContribution('${month}', ${participantIndex})"
                        class="w-full py-1 rounded-lg ${dcaData[month]?.[participantIndex] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover-scale"
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
        updateNumberOfMembers();
    }
});

// Edit a participant's name
function editParticipant(index) {
    const newName = prompt('Enter the new name for this participant:');
    if (newName) {
        participants[index] = newName;
        localStorage.setItem('participants', JSON.stringify(participants));
        renderParticipants();
        renderDcaTable();
    }
}

// Remove a participant
function removeParticipant(index) {
    participants.splice(index, 1);
    localStorage.setItem('participants', JSON.stringify(participants));
    renderParticipants();
    renderDcaTable();
    updateNumberOfMembers();
}

// Toggle contribution
function toggleContribution(month, participantIndex) {
    if (!dcaData[month]) dcaData[month] = {};
    dcaData[month][participantIndex] = !dcaData[month][participantIndex];
    localStorage.setItem('dcaData', JSON.stringify(dcaData));
    renderDcaTable();
    updateTotalInvested();
}

// Update total invested
function updateTotalInvested() {
    const totalClicks = Object.values(dcaData).reduce((sum, month) => {
        return sum + Object.values(month).filter(Boolean).length;
    }, 0);
    totalInvestedElement.textContent = `$${totalClicks * 100} AUD`;
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
fetchBitcoinPrice();
renderParticipants();
renderDcaTable();
updateTotalInvested();
updateNumberOfMembers();
