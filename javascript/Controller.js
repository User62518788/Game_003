class Controller {
    #isFullscreen = false;
    #pointerPosition = [0, 0];
    #sensitivity = {
        x: undefined,
        y: undefined
    };
    #raycaster;
    #pointer;
    #keyboard = {};
    #playerSpeed;

    constructor(scene_, camera_, controllerConfig_) {
        this.scene = scene_;
        this.camera = camera_;
        this.#sensitivity.x = controllerConfig_.camera.sensitivity.x;
        this.#sensitivity.y = controllerConfig_.camera.sensitivity.y;
        this.#playerSpeed = controllerConfig_.playerConfig.player_speed / 10;
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
    initMovementControl() {
        this.initMovementListeners();
        
    }
    move() {
        if (this.#keyboard[87]) {
            camera.position.x -= +Math.sin(this.camera.rotation.y) * this.#playerSpeed;
            camera.position.z += -Math.cos(this.camera.rotation.y) * this.#playerSpeed;
        }
        if (this.#keyboard[83]) {
            camera.position.x += Math.sin(this.camera.rotation.y) * this.#playerSpeed;
            camera.position.z -= -Math.cos(this.camera.rotation.y) * this.#playerSpeed;
        }
        if (this.#keyboard[65]) {
            camera.position.x += Math.sin(this.camera.rotation.y - Math.PI / 2) * this.#playerSpeed;
            camera.position.z += -Math.cos(this.camera.rotation.y + Math.PI / 2) * this.#playerSpeed;
        }
        if (this.#keyboard[68]) {
            camera.position.x -= +Math.sin(this.camera.rotation.y - Math.PI / 2) * this.#playerSpeed;
            camera.position.z -= -Math.cos(this.camera.rotation.y + Math.PI / 2) * this.#playerSpeed;
        }
    }
    initMovementListeners() {
        window.addEventListener("keydown", (event_) => {
            this.#keyboard[event_.keyCode] = true;
        });
        window.addEventListener("keyup", (event_) => {
            this.#keyboard[event_.keyCode] = false;
        });
    }
}