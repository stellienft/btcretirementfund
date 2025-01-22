# Nexus Capital Retirement Fund

A web application for managing a Bitcoin retirement fund with a group of friends. The project allows participants to track their monthly contributions using a Dollar Cost Averaging (DCA) strategy over a 10-year period. It includes a modern dashboard, wallet integration, and analytics.

---

## Features

1. **DCA Table**:
   - Track monthly contributions for each participant.
   - Checkboxes to mark deposits, with data saved in `localStorage`.

2. **Dashboard**:
   - Visualize total contributions over time using a bar chart.
   - Display connected wallet balance.

3. **Wallet Integration**:
   - Connect MetaMask to view wallet address and balance.
   - Easily extensible for Bitcoin wallet integration.

4. **Modern Design**:
   - Built with **Tailwind CSS** for a sleek, responsive interface.

5. **Interactive**:
   - Add or remove participants dynamically.
   - Real-time updates to the analytics chart.

---

## Technologies Used

- **HTML5**: Structure of the application.
- **Tailwind CSS**: Styling and responsive design.
- **JavaScript**: Interactive functionality.
- **Chart.js**: Analytics and data visualization.
- **Ethers.js**: Wallet integration (MetaMask).

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nexus-capital-retirement-fund.git
cd nexus-capital-retirement-fund

2. Host the Application
You can host this project on any static hosting service. Here are a few options:

Netlify:

Drag and drop the project folder into the Netlify dashboard.

Your site will be live instantly!

Vercel:

Install the Vercel CLI: npm install -g vercel.

Run vercel in the project directory and follow the prompts.

GitHub Pages:

Push the project to a GitHub repository.

Go to Settings > Pages and enable GitHub Pages for the main branch.

3. Access the Application
Once hosted, open the provided URL in your browser to access the application.

How to Use
Add Participants:

Click the "Add Participant" button to add new members to the group.

Mark Contributions:

Use the checkboxes in the DCA table to mark monthly contributions.

Connect Wallet:

Click "Connect Wallet" to link your MetaMask wallet and view your balance.

View Analytics:

The dashboard displays a bar chart of total contributions over time.

Customization
Bitcoin Wallet Integration:
Replace the MetaMask integration with a Bitcoin wallet library like Blockstream Green or BitcoinJS.

Extend DCA Period:
Modify the generateMonths function in script.js to adjust the start and end dates.

Styling:
Customize the design by editing the Tailwind CSS classes in index.html.

Screenshots
Dashboard
Dashboard with contributions chart and wallet balance.

DCA Table
Interactive DCA table for tracking monthly contributions.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

Acknowledgments
Tailwind CSS: For making styling easy and efficient.

Chart.js: For beautiful and interactive charts.

Ethers.js: For seamless wallet integration.
