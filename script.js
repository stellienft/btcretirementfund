// Initialize participants and DCA data
let participants = JSON.parse(localStorage.getItem('participants')) || ['Person 1', 'Jarryd Lang', 'Josh Wallace'];
let dcaData = JSON.parse(localStorage.getItem('dcaData')) || {};

// DOM Elements
const participantList = document.getElementById('participant-list');
const addParticipantButton = document.getElementById('add-participant');
const dcaTableBody = document.getElementById('dca-table-body');
const totalInvestedElement = document.getElementById('total-invested');
const numberOfMembersElement = document.getElementById('number-of-members');
const toggleParticipantsButton = document.getElementById('toggle-participants');
const participantsSection = document.getElementById('participants-section');
const yearTabsContainer = document.querySelector('.flex.space-x-2.mb-4');

// Debugging: Log initial data
console.log('Participants:', participants);
console.log('DCA Data:', dcaData);

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
            <span>${name}</span>
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

// Shorten name for mobile (first name + last initial)
function shortenName(name) {
    const isMobile = window.innerWidth <= 768; // Check if mobile
    if (!isMobile) return name; // Return full name for desktop

    const [firstName, lastName] = name.split(' ');
    return lastName ? `${firstName} ${lastName.charAt(0)}.` : firstName;
}

// Render year tabs
function renderYearTabs() {
    yearTabsContainer.innerHTML = Array.from({ length: 10 }, (_, i) => `
        <div class="year-tab ${i === 0 ? 'active' : ''}" data-year="${i + 1}">
            Year ${i + 1}
        </div>
    `).join('');

    // Add event listeners to year tabs
    document.querySelectorAll('.year-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderDcaTable(parseInt(tab.getAttribute('data-year')));
        });
    });
}

// Render DCA table for a specific year
function renderDcaTable(year) {
    const startDate = new Date(`January ${2024 + year}`);
    const endDate = new Date(`December ${2024 + year}`);
    const months = generateMonths(startDate, endDate);

    dcaTableBody.innerHTML = months.map(month => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-2">${month}</td>
            ${participants.map((name, participantIndex) => `
                <td class="p-2">
                    <button
                        onclick="toggleContribution('${month}', ${participantIndex})"
                        class="w-full py-1 rounded-lg ${dcaData[month]?.[participantIndex] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} hover-scale"
                    >
                        ${shortenName(name)}
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
        renderYearTabs();
        renderDcaTable(1); // Default to Year 1
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
        renderDcaTable(1); // Default to Year 1
    }
}

// Remove a participant
function removeParticipant(index) {
    participants.splice(index, 1);
    localStorage.setItem('participants', JSON.stringify(participants));
    renderParticipants();
    renderDcaTable(1); // Default to Year 1
    updateNumberOfMembers();
}

// Toggle contribution
function toggleContribution(month, participantIndex) {
    if (!dcaData[month]) dcaData[month] = {};
    dcaData[month][participantIndex] = !dcaData[month][participantIndex];
    localStorage.setItem('dcaData', JSON.stringify(dcaData));
    renderDcaTable(1); // Default to Year 1
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
    const months = [];
    while (start <= end) {
        months.push(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(start));
        start.setMonth(start.getMonth() + 1);
    }
    return months;
}

// Initial render
renderParticipants();
renderYearTabs();
renderDcaTable(1); // Default to Year 1
updateTotalInvested();
updateNumberOfMembers();

// Re-render table on window resize (for responsive name shortening)
window.addEventListener('resize', () => {
    const activeYear = document.querySelector('.year-tab.active').getAttribute('data-year');
    renderDcaTable(parseInt(activeYear));
});
