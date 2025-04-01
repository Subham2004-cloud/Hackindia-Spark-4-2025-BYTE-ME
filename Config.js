require('dotenv').config();

module.exports = {
    NETWORK_URL: process.env.NETWORK_URL || 'http://localhost:8545',
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PORT: process.env.PORT || 3000,
    // Add other configuration variables as needed
};
