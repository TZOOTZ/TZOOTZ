window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('synthCanvas');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = null;
    let gainNode = null;
    let filterNode = null; // Added filter node
    let isPlaying = false;

    const FIXED_GAIN = 0.3; // Fixed gain level when playing

    if (!audioContext) {
        alert("Web Audio API is not supported in this browser");
        return;
    }

    function mapValue(value, inMin, inMax, outMin, outMax) {
        // Ensure inMin and inMax are different to avoid division by zero
        if (inMin === inMax) return outMin;
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    function startSound(x, y) {
        if (isPlaying) return;
        if (audioContext.state === 'suspended') { // Resume AudioContext if it was suspended
            audioContext.resume();
        }

        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        filterNode = audioContext.createBiquadFilter(); // Create filter

        // Configure filter (lowpass is default, good for synth sweeps)
        filterNode.type = 'lowpass';
        
        // Connections: Oscillator -> Filter -> Gain -> Destination
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Set fixed gain
        gainNode.gain.setValueAtTime(FIXED_GAIN, audioContext.currentTime);
        
        // Y-axis for frequency (pitch)
        // Lower Y on screen = higher frequency. Range: 80Hz to 1200Hz
        const freq = mapValue(y, canvas.height, 0, 80, 1200);
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        // X-axis for filter cutoff frequency
        // Left on screen = lower cutoff, Right = higher cutoff. Range: 100Hz to 10000Hz (logarithmic feel)
        const filterFreq = mapValue(x, 0, canvas.width, 100, 10000);
        filterNode.frequency.setValueAtTime(filterFreq, audioContext.currentTime);
        // filterNode.Q.value = 1; // Resonance, can be experimented with

        oscillator.type = 'sawtooth';
        oscillator.start();
        isPlaying = true;
    }

    function updateSound(x, y) {
        if (!isPlaying || !oscillator || !gainNode || !filterNode) return;

        // Y-axis for frequency
        const freq = mapValue(y, canvas.height, 0, 80, 1200);
        oscillator.frequency.linearRampToValueAtTime(freq, audioContext.currentTime + 0.01);

        // X-axis for filter cutoff frequency
        const filterFreq = mapValue(x, 0, canvas.width, 100, 10000);
        filterNode.frequency.linearRampToValueAtTime(filterFreq, audioContext.currentTime + 0.01);
    }

    function stopSound() {
        if (!isPlaying || !gainNode) return;

        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2); // Ramp down

        setTimeout(() => {
            if (oscillator) {
                oscillator.stop();
                oscillator.disconnect();
            }
            if (filterNode) { // Disconnect filter
                filterNode.disconnect();
            }
            if (gainNode) {
                gainNode.disconnect();
            }
            oscillator = null;
            gainNode = null;
            filterNode = null;
            isPlaying = false;
        }, 200);
    }

    let pointerDown = false;

    function getEventCoordinates(event) {
        let x, y;
        const rect = canvas.getBoundingClientRect();
        if (event.touches && event.touches.length > 0) {
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        } else {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }
        x = Math.max(0, Math.min(x, canvas.width));
        y = Math.max(0, Math.min(y, canvas.height));
        return { x, y };
    }

    // Mouse events
    canvas.addEventListener('mousedown', (event) => {
        pointerDown = true;
        const { x, y } = getEventCoordinates(event);
        startSound(x, y);
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!pointerDown) return;
        const { x, y } = getEventCoordinates(event);
        updateSound(x, y);
    });

    canvas.addEventListener('mouseup', () => {
        if (!pointerDown) return;
        pointerDown = false;
        stopSound();
    });

    canvas.addEventListener('mouseleave', () => {
        if (!pointerDown) return;
        pointerDown = false;
        stopSound();
    });

    // Touch events
    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        pointerDown = true;
        const { x, y } = getEventCoordinates(event);
        startSound(x, y);
    }, { passive: false });

    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        if (!pointerDown) return;
        const { x, y } = getEventCoordinates(event);
        updateSound(x, y);
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        if (!pointerDown) return;
        pointerDown = false;
        stopSound();
    });

    canvas.addEventListener('touchcancel', () => {
        if (!pointerDown) return;
        pointerDown = false;
        stopSound();
    });
    
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        // No need to redraw audio stuff on resize, just update canvas dimensions
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Attempt to resume AudioContext on any user interaction if it's suspended
    // This is a common requirement for browsers that auto-suspend AudioContext
    function resumeAudioContext() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                // console.log('AudioContext resumed successfully');
            }).catch(e => console.error('Error resuming AudioContext:', e));
        }
        // Remove this listener after first interaction
        document.body.removeEventListener('touchstart', resumeAudioContext);
        document.body.removeEventListener('mousedown', resumeAudioContext);
    }
    document.body.addEventListener('touchstart', resumeAudioContext, { once: true });
    document.body.addEventListener('mousedown', resumeAudioContext, { once: true });
});
