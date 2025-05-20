const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const resultImage = document.getElementById('result');
const ctx = canvas.getContext('2d');

let streaming = false;
let lastSent = 0;
const FRAME_INTERVAL = 100; // ms between frames (10 fps)
let lastPlayedClasses = new Set();

// Get camera access
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        streaming = true;
        requestAnimationFrame(processFrame);
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Error accessing camera. Please make sure you have granted camera permissions.");
    }
}

async function processFrame() {
    if (!streaming) return;
    if (video.readyState < video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(processFrame);
        return;
    }
    const now = Date.now();
    if (now - lastSent < FRAME_INTERVAL) {
        requestAnimationFrame(processFrame);
        return;
    }
    lastSent = now;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
        if (!blob) {
            requestAnimationFrame(processFrame);
            return;
        }
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');
        try {
            const serverUrl = window.location.origin;
            const response = await fetch(`${serverUrl}/upload-image/`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                // Show detection result image
                resultImage.src = `data:image/jpeg;base64,${data.image}`;
                resultImage.style.display = 'block';
                // Play audio for detected classes (only if new)
                const detectedClasses = new Set(data.classes);
                detectedClasses.forEach(className => {
                    if (!lastPlayedClasses.has(className)) {
                        // Try .wav first, then .mp3 if .wav fails
                        const wavFile = `/class_audio/${className}.wav`;
                        const mp3File = `/class_audio/${className}.mp3`;
                        console.log('Trying to play:', wavFile, 'or', mp3File);
                        const audio = new Audio(wavFile);
                        let triedMp3 = false;
                        audio.onerror = function(e) {
                            if (!triedMp3) {
                                triedMp3 = true;
                                audio.src = mp3File;
                                audio.play().catch(err => {
                                    console.error('Audio play() error (mp3):', err);
                                });
                            } else {
                                console.error('Audio failed to load/play both wav and mp3:', wavFile, mp3File, e);
                            }
                        };
                        audio.play().catch(err => {
                            console.error('Audio play() error (wav):', err);
                        });
                    }
                });
                lastPlayedClasses = detectedClasses;
            }
        } catch (error) {
            // Ignore errors, just try again next frame
        }
        requestAnimationFrame(processFrame);
    }, 'image/jpeg');
}

// Start everything
setupCamera();