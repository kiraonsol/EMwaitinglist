class WaitlistApp {
    constructor() {
        this.initWebGL();
        this.initForm();
    }

    initWebGL() {
        const params = {
            enableWebGL: true, // Enable WebGL on all devices
            particleCount: window.innerWidth > 1200 ? 120 : window.innerWidth > 768 ? 80 : 40, // Reduce particles on mobile
            animationSpeed: 0.0015
        };

        if (!params.enableWebGL) {
            console.log("WebGL is disabled.");
            return;
        }

        // Check if WebGL is supported
        const canvas = document.querySelector('#webgl-background');
        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error("WebGL is not supported on this device.");
            return;
        }

        console.log("Initializing WebGL animation...");

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.PlaneGeometry(30, 30, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xE25747,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI * 0.5;
        scene.add(mesh);

        camera.position.set(0, 5, 7);

        let lastTime = 0;
        const animate = (currentTime = 0) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            if (deltaTime < 32) {
                const positions = geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 2] = Math.sin((currentTime * params.animationSpeed) + positions[i]) * 0.5;
                }
                geometry.attributes.position.needsUpdate = true;
                renderer.render(scene, camera);
            }
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = (event.clientY / window.innerHeight) * 2 - 1;
            mesh.rotation.x = -Math.PI * 0.5 + mouseY * 0.1;
            mesh.rotation.y = mouseX * 0.1;
        });

        // Add touch support for mobile devices
        document.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
            mouseY = (touch.clientY / window.innerHeight) * 2 - 1;
            mesh.rotation.x = -Math.PI * 0.5 + mouseY * 0.1;
            mesh.rotation.y = mouseX * 0.1;
        });

        console.log("Starting WebGL animation...");
        animate();
    }

    initForm() {
        const form = document.querySelector('.waitlist-form');
        const button = form.querySelector('.submit-btn');
        const input = document.querySelector('.input-field');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = input.value.trim();

            if (!email || !email.includes('@')) {
                input.classList.add('error');
                input.focus();
                setTimeout(() => input.classList.remove('error'), 1000);
                return;
            }

            try {
                button.disabled = true;
                button.style.opacity = '0.7';
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                button.innerHTML = 'Added ✓';
                button.style.background = '#4CAF50';
                input.value = '';

                setTimeout(() => {
                    button.innerHTML = 'Join Waitlist';
                    button.style.background = '';
                    button.style.opacity = '1';
                    button.disabled = false;
                }, 2000);
            } catch (error) {
                button.innerHTML = 'Error!';
                button.style.background = '#FF4444';
                setTimeout(() => {
                    button.innerHTML = 'Join Waitlist';
                    button.style.background = '';
                    button.style.opacity = '1';
                    button.disabled = false;
                }, 2000);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new WaitlistApp());
