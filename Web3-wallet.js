let web3;
let userAccount;
let contract;
let contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

// Contract ABI - Replace with your contract's ABI
const contractABI = [
    // Add your contract ABI here
    // Example:
    // {
    //     "inputs": [],
    //     "name": "markAttendance",
    //     "outputs": [],
    //     "stateMutability": "nonpayable",
    //     "type": "function"
    // }
];

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const markAttendanceBtn = document.getElementById('markAttendance');
const walletInfo = document.getElementById('walletInfo');
const accountAddress = document.getElementById('accountAddress');
const networkName = document.getElementById('networkName');
const attendanceHistory = document.getElementById('attendanceHistory');
const toast = new bootstrap.Toast(document.getElementById('notificationToast'));

// Check if MetaMask is installed
const checkMetaMask = () => {
    if (typeof window.ethereum !== 'undefined') {
        return true;
    }
    showNotification('Please install MetaMask to use this application', 'error');
    connectWalletBtn.disabled = true;
    connectWalletBtn.innerHTML = '<i class="bi bi-exclamation-circle"></i> MetaMask Not Installed';
    return false;
};

// Initialize Web3 and connect to MetaMask
const initWeb3 = async () => {
    if (!checkMetaMask()) return;

    try {
        // Update button state
        connectWalletBtn.disabled = true;
        connectWalletBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize Web3
        web3 = new Web3(window.ethereum);
        userAccount = accounts[0];
        
        // Check if we're on the correct network
        const chainId = await web3.eth.getChainId();
        if (chainId !== 1) { // Assuming we want Ethereum mainnet
            showNotification('Please switch to Ethereum mainnet', 'warning');
            return;
        }
        
        // Update UI
        await updateWalletInfo();
        markAttendanceBtn.disabled = false;
        
        // Initialize contract
        contract = new web3.eth.Contract(contractABI, contractAddress);
        
        // Update button state
        connectWalletBtn.innerHTML = '<i class="bi bi-check-circle"></i> Connected';
        connectWalletBtn.classList.remove('btn-primary');
        connectWalletBtn.classList.add('btn-success');
        
        showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
        console.error('Connection error:', error);
        connectWalletBtn.disabled = false;
        connectWalletBtn.innerHTML = 'Connect MetaMask';
        
        if (error.code === 4001) {
            showNotification('Please connect your MetaMask wallet to continue', 'error');
        } else {
            showNotification('Failed to connect wallet: ' + error.message, 'error');
        }
    }
};

// Update wallet information in UI
const updateWalletInfo = async () => {
    if (!web3) return;

    try {
        const networkId = await web3.eth.net.getId();
        const network = await web3.eth.net.getNetworkType();
        const balance = await web3.eth.getBalance(userAccount);
        const ethBalance = web3.utils.fromWei(balance, 'ether');
        
        accountAddress.textContent = `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
        networkName.textContent = network.charAt(0).toUpperCase() + network.slice(1);
        walletInfo.classList.remove('d-none');
        
        // Add balance information
        const balanceElement = document.createElement('p');
        balanceElement.className = 'mb-0';
        balanceElement.innerHTML = `Balance: <span class="badge bg-info">${parseFloat(ethBalance).toFixed(4)} ETH</span>`;
        walletInfo.appendChild(balanceElement);
        
        // Load attendance history
        await loadAttendanceHistory();
    } catch (error) {
        console.error('Error updating wallet info:', error);
        showNotification('Error updating wallet info: ' + error.message, 'error');
    }
};

// Mark attendance
const markAttendance = async () => {
    if (!contract || !userAccount) return;

    try {
        markAttendanceBtn.disabled = true;
        showNotification('Processing attendance...', 'info');

        // Call the smart contract method
        await contract.methods.markAttendance().send({ from: userAccount });
        
        showNotification('Attendance marked successfully!', 'success');
        await loadAttendanceHistory(); // Refresh attendance history
    } catch (error) {
        showNotification('Failed to mark attendance: ' + error.message, 'error');
    } finally {
        markAttendanceBtn.disabled = false;
    }
};

// Load attendance history
const loadAttendanceHistory = async () => {
    if (!contract) return;

    try {
        // Call your contract method to get attendance history
        // const history = await contract.methods.getAttendanceHistory().call();
        
        // Example of populating the table (replace with actual data from your contract)
        attendanceHistory.innerHTML = `
            <tr>
                <td>${new Date().toLocaleDateString()}</td>
                <td><span class="badge bg-success">Present</span></td>
                <td><small class="text-muted">0x1234...5678</small></td>
            </tr>
        `;
    } catch (error) {
        showNotification('Error loading attendance history: ' + error.message, 'error');
    }
};

// Show notification toast
const showNotification = (message, type = 'info') => {
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    
    // Set toast color based on type
    const toastElement = document.getElementById('notificationToast');
    toastElement.className = 'toast';
    toastElement.classList.add(`bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'}`);
    
    toast.show();
};

// Event Listeners
connectWalletBtn.addEventListener('click', initWeb3);
markAttendanceBtn.addEventListener('click', markAttendance);

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        userAccount = accounts[0];
        updateWalletInfo();
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}
