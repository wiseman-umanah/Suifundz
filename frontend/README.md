# Decentralized Financial System (DFS)

This project is a **Decentralized Financial System (DFS)** that facilitates the seamless conversion of SUI tokens into USDT and subsequently into local fiat currencies (e.g., Nigerian Naira, USD, EUR, GBP). The system leverages blockchain technology to ensure secure transactions, allowing users to make transfers directly to OPay accounts.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Functional Breakdown](#functional-breakdown)
- [Dark Mode](#dark-mode)
- [Transaction Simulation](#transaction-simulation)
- [Exchange Rates](#exchange-rates)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features
- Connect to Sui blockchain wallets using `@suiet/wallet-kit`
- Convert SUI tokens to USDT at a fixed exchange rate
- Convert USDT to local currencies (USD, NGN, EUR, GBP)
- Transfer funds to OPay account numbers
- Automatic dark mode detection and toggle
- Success transaction modal with transaction summary

## Technologies Used
- React (with Hooks)
- TypeScript
- TailwindCSS
- Sui Blockchain
- `@suiet/wallet-kit`
- Axios

## Installation

### Prerequisites
- Node.js
- Yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/dfs.git
   cd dfs
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn dev
   ```
4. Access the application at `http://localhost:3000`

## Usage
1. Connect your Sui wallet using the **Connect Wallet** button.
2. Enter the amount of SUI tokens you wish to convert.
3. Select your preferred local currency.
4. Enter your OPay account number.
5. Click **Convert & Transfer** to initiate the transaction.
6. View transaction details in the modal popup.

## Folder Structure
```bash
src/
├─ App.jsx           # Main component
├─ styles/          # Global styles
└─ utils/           # Utility functions
```

## Functional Breakdown
### Wallet Connection
Wallet connection is facilitated using `@suiet/wallet-kit`. The component displays the connected wallet address and balance.

### Conversion Logic
- **SUI → USDT:** Fixed exchange rate of `1 SUI = 25 USDT`
- **USDT → Local Currency:** Based on pre-defined exchange rates

### Transfer Process
- Mock balance validation
- Randomly generated transaction ID
- Transfer success/failure notifications

## Dark Mode
Dark mode is automatically applied based on system preference or can be toggled manually using the button.

## Transaction Simulation
For the MVP version, transactions are simulated with a 2-second delay. No actual blockchain transfers occur.

## Exchange Rates
Exchange rates are predefined in the `currencies` array:
```js
[
  { code: "usd", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "naira", name: "Nigerian Naira", symbol: "₦", rate: 450 },
  { code: "eur", name: "Euro", symbol: "€", rate: 0.85 },
  { code: "gbp", name: "British Pound", symbol: "£", rate: 0.75 }
]
```

## Error Handling
- Missing wallet connection
- Insufficient balance
- Invalid input fields

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

