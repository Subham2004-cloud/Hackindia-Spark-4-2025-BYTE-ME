<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Attendance System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
    <link rel="stylesheet" href="web3-wallet.css">
    <!-- Face-API.js -->
    <script src="https://cdn.jsdelivr.net/npm/face-api.js"></script>
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h3 class="text-center mb-0">E-Attendance System</h3>
                    </div>
                    <div class="card-body">
                        <div class="text-center mb-4">
                            <h4>Welcome to E-Attendance</h4>
                            <p>Please connect your MetaMask wallet to mark your attendance</p>
                        </div>

                        <div class="wallet-connection mb-4">
                            <div class="d-flex gap-2 mb-3">
                                <button id="connectWallet" class="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                                    <i class="bi bi-wallet2"></i>
                                    Connect MetaMask
                                </button>
                                <select id="networkSelect" class="form-select" style="max-width: 200px;">
                                    <option value="1">Ethereum Mainnet</option>
                                    <option value="56">BSC Mainnet</option>
                                    <option value="137">Polygon Mainnet</option>
                                    <option value="80001">Mumbai Testnet</option>
                                </select>
                            </div>
                            <div id="walletInfo" class="mt-3 d-none">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <i class="bi bi-person-circle"></i>
                                    <p class="mb-1">Connected Account: <span id="accountAddress"></span></p>
                                </div>
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <i class="bi bi-hdd-network"></i>
                                    <p class="mb-1">Network: <span id="networkName"></span></p>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <i class="bi bi-currency-exchange"></i>
                                    <p class="mb-0">Balance: <span id="walletBalance"></span></p>
                                </div>
                            </div>
                        </div>

                        <div class="attendance-section">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Mark Attendance</h5>
                                    <p class="card-text">Please verify your identity using face detection before marking attendance.</p>
                                    
                                    <!-- Camera Interface -->
                                    <div class="camera-container mb-3">
                                        <video id="video" width="100%" height="300" autoplay muted></video>
                                        <canvas id="canvas" style="display: none;"></canvas>
                                        <div class="text-center mt-2">
                                            <span id="faceDetectionStatus" class="badge bg-secondary">Camera not started</span>
                                        </div>
                                    </div>

                                    <button id="markAttendance" class="btn btn-success w-100" disabled>
                                        <i class="bi bi-camera"></i> Mark Attendance
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="attendance-history mt-4">
                            <h5>Attendance History</h5>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Transaction Hash</th>
                                        </tr>
                                    </thead>
                                    <tbody id="attendanceHistory">
                                        <!-- Attendance history will be populated here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast for notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="notificationToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Notification</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body" id="toastMessage"></div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/web3@1.9.0/dist/web3.min.js"></script>
    <script src="web3-wallet.js"></script>
</body>
</html>
