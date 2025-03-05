class WaitlistApp {
    constructor() {
        this.initWebGL();
        this.initForm();
    }

    initWebGL() {
        const params = {
            enableWebGL: true,
            particleCount: window.innerWidth > 1200 ? 120 : window.innerWidth > 768 ? 80 : 40,
            animationSpeed: 0.0015
        };

        if (!params.enableWebGL) {
            console.log("WebGL is disabled.");
            return;
        }

        const canvas = document.querySelector('#webgl-background');
        const heroContent = document.querySelector('.hero-content');
        const webglFallback = document.querySelector('#webgl-fallback');

        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }

        if (!heroContent) {
            console.error("Hero content element not found!");
            return;
        }

        if (!webglFallback) {
            console.error("WebGL fallback element not found!");
        }

        console.log("Window innerWidth:", window.innerWidth);
        console.log("Moving canvas for mobile check...");

        // Move the canvas inside .hero-content on mobile (<= 1024px)
        if (window.innerWidth <= 1024) {
            heroContent.appendChild(canvas);
            console.log("Moved canvas to .hero-content for mobile.");
            console.log("Canvas parent after move:", canvas.parentNode);
        } else {
            console.log("Canvas remains at top level for desktop.");
        }

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error("WebGL is not supported on this device. Please ensure your browser supports WebGL and it is enabled.");
            if (webglFallback) {
                webglFallback.style.display = 'flex'; // Show the fallback message
                console.log("Showing WebGL fallback message.");
            }
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
            } else {
                console.log("Frame skipped due to large deltaTime:", deltaTime);
            }
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            console.log("Window resized, new innerWidth:", window.innerWidth);
            if (window.innerWidth <= 1024) {
                if (canvas.parentNode !== heroContent) {
                    heroContent.appendChild(canvas);
                    console.log("Moved canvas to .hero-content on resize (mobile).");
                    console.log("Canvas parent after resize move:", canvas.parentNode);
                }
            } else {
                if (canvas.parentNode !== document.body) {
                    document.body.insertBefore(canvas, document.body.firstChild);
                    console.log("Moved canvas to body on resize (desktop).");
                    console.log("Canvas parent after resize move:", canvas.parentNode);
                }
            }
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
