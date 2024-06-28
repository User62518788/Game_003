class Controller {
    #isFullscreen = false;
    #pointerPosition = [0, 0];
    #sensitivity = {
        x: undefined,
        y: undefined
    };
    #raycaster;
    #pointer;

    constructor(scene_, camera_, controllerConfig_) {
        this.scene = scene_;
        this.camera = camera_;
        this.#sensitivity.x = controllerConfig_.camera.sensitivity.x;
        this.#sensitivity.y = controllerConfig_.camera.sensitivity.y;
    }
    initShootControl = (spawner_) => {
        this.#raycaster = new THREE.Raycaster();
        this.#pointer = new THREE.Vector2();

        this.#pointer.x = 0;
        this.#pointer.y = 0;

        this.initShootListener(spawner_);
    }
    initShootListener(spawner_) {
        window.addEventListener("mousedown", () => {
            if (!this.#isFullscreen) return;

            this.#raycaster.setFromCamera(this.#pointer, this.camera);
            const intersects = this.#raycaster.intersectObjects(this.scene.children);

            let target;
            try {
                target = intersects[0].object;
                spawner_.removeTarget(target);
            } catch {
                return;
            }
        });
    }
    initCameraControl() {
        this.initRotateListener();
        window.addEventListener("click", this.fullscreen);
    }
    fullscreen() {
        document.body.requestPointerLock();
        document.body.requestFullscreen();
    }
    initRotateListener = () => {
        window.addEventListener("fullscreenchange", () => {
            console.log(this.#isFullscreen);
            if (this.#isFullscreen) {
                this.#isFullscreen = false;
            } else {
                this.#isFullscreen = true;
            }
        });
        window.addEventListener("mousemove", (event_) => {
            if (!this.#isFullscreen) return;
            const [x, y] = this.#pointerPosition;

            let newX = x + event_.movementX * this.#sensitivity.x * Math.PI / window.innerWidth;
            let newY = y + event_.movementY * this.#sensitivity.y * Math.PI / window.innerWidth;

            let deltaX = newX - x;
            let deltaY = newY - y;

            camera.rotation.y -= deltaX;
            camera.rotation.x -= deltaY;

            this.#pointerPosition[0] = newX;
            this.#pointerPosition[1] = newY;
        });
    }
}