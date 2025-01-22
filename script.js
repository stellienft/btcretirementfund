// Initialize participants and DCA data
let participants = JSON.parse(localStorage.getItem('participants')) || ['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5', 'Person 6', 'Person 7', 'Person 8'];
let dcaData = JSON.parse(localStorage.getItem('dcaData')) || {};

// DOM Elements
const participantList = document.getElementById('participant-list');
const addParticipantButton = document.getElementById('addParticipant');
const dcaTableBody = document.getElementById('dcaTableBody');
const connectWalletButton = document.getElementById('connectWallet');
const walletAddressElement = document.getElementById('walletAddress');
const walletBalanceElement = document.getElementById('walletBalance');

// Render DCA table
function renderDcaTable() {
    const months = generateMonths('January 2025', 'January 2035');
    dcaTableBody.innerHTML = months.map(month => `
        <tr class="border-b">
            <td class="p-3">${month}</td>
            ${participants.map((_, participantIndex) => `
                <td class="p-3">
                    <input
                        type="checkbox"
                        data-month="${month}"
                        data-participant="${participantIndex}"
                        ${dcaData[month]?.[participantIndex] ? 'checked' : ''}
                        onchange="saveCheckboxState(event)"
                        class="form-checkbox h-5 w-5 text-blue-600"
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
        renderDcaTable();
    }
});

// Save checkbox state
function saveCheckboxState(event) {
    const checkbox = event.target;
    const month = checkbox.getAttribute('data-month');
    const participantIndex = checkbox.getAttribute('data-participant');

    if (!dcaData[month]) dcaData[month] = {};
    dcaData[month][participantIndex] = checkbox.checked;

    localStorage.setItem('dcaData', JSON.stringify(dcaData));
    updateChart();
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

// Wallet Integration
connectWalletButton.addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            walletAddressElement.textContent = `Connected: ${accounts[0]}`;
            fetchWalletBalance(accounts[0]);
        } catch (err) {
            console.error(err);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

// Fetch wallet balance
async function fetchWalletBalance(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    walletBalanceElement.textContent = `${ethers.utils.formatEther(balance)} ETH`;
}

// Analytics Chart
const contributionsChart = new Chart(document.getElementById('contributionsChart'), {
    type: 'bar',
    data: {
        labels: generateMonths('January 2025', 'January 2035'),
        datasets: [{
            label: 'Contributions',
            data: [],
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart() {
    const months = generateMonths('January 2025', 'January 2035');
    const data = months.map(month => {
        return participants.reduce((sum, _, participantIndex) => {
            return sum + (dcaData[month]?.[participantIndex] ? 100 : 0);
        }, 0);
    });
    contributionsChart.data.datasets[0].data = data;
    contributionsChart.update();
}

// Initial render
renderDcaTable();
updateChart();
