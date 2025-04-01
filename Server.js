// ... existing code ...

// Mark attendance
const markAttendance = async () => {
    if (!contract || !userAccount || !isFaceDetected) return;

    try {
        // Update button state
        markAttendanceBtn.disabled = true;
        markAttendanceBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        markAttendanceBtn.classList.add('processing');

        showNotification('Processing attendance...', 'info');

        // Capture current frame
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to base64
        const imageData = canvas.toDataURL('image/jpeg');

        // Call the smart contract method with face detection proof
        await contract.methods.markAttendance(imageData).send({ from: userAccount });
        
        // Success state
        markAttendanceBtn.innerHTML = '<i class="bi bi-check-circle"></i> Attendance Marked!';
        markAttendanceBtn.classList.remove('processing');
        markAttendanceBtn.classList.add('success');
        
        showNotification('Attendance marked successfully!', 'success');
        await loadAttendanceHistory(); // Refresh attendance history

        // Reset button after 3 seconds
        setTimeout(() => {
            markAttendanceBtn.innerHTML = '<i class="bi bi-camera"></i> Mark Attendance';
            markAttendanceBtn.classList.remove('success');
        }, 3000);
    } catch (error) {
        // Error state
        markAttendanceBtn.innerHTML = '<i class="bi bi-exclamation-circle"></i> Failed';
        markAttendanceBtn.classList.remove('processing');
        markAttendanceBtn.classList.add('error');
        
        showNotification('Failed to mark attendance: ' + error.message, 'error');

        // Reset button after 3 seconds
        setTimeout(() => {
            markAttendanceBtn.innerHTML = '<i class="bi bi-camera"></i> Mark Attendance';
            markAttendanceBtn.classList.remove('error');
        }, 3000);
    }
};

// Face detection loop
const startFaceDetection = () => {
    faceDetectionInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length > 0) {
            isFaceDetected = true;
            faceDetectionStatus.textContent = 'Face detected';
            faceDetectionStatus.className = 'badge bg-success';
            markAttendanceBtn.disabled = false;
            markAttendanceBtn.classList.add('active');
            markAttendanceBtn.innerHTML = '<i class="bi bi-camera"></i> Mark Attendance';
        } else {
            isFaceDetected = false;
            faceDetectionStatus.textContent = 'No face detected';
            faceDetectionStatus.className = 'badge bg-warning';
            markAttendanceBtn.disabled = true;
            markAttendanceBtn.classList.remove('active');
            markAttendanceBtn.innerHTML = '<i class="bi bi-camera"></i> Position your face';
        }
    }, 1000);
};

// ... rest of the existing code ...
