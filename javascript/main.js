const MENU_CONTAINER = document.getElementById("menu-container");
const MENU = document.getElementById("menu");
const SETTINGS = document.getElementById("settings");

const PLAY_BUTTON = document.getElementById("play-button");
const SETTINGS_BUTTON = document.getElementById("settings-button");

const FOV_INPUT = document.getElementById("fov-input");
const TARGET_NUMBER_INPUT = document.getElementById("target-number-input");
const TARGET_SIZE_INPUT = document.getElementById("target-size-input");
const SPAWNER_WIDTH_INPUT = document.getElementById("spawner-width-input");
const SPAWNER_HEIGHT_INPUT = document.getElementById("spawner-height-input");

const CROSSHAIR = document.getElementById("crosshair");

let isSettingsDisplayed = false;

PLAY_BUTTON.addEventListener("click", () => {
    MENU_CONTAINER.style.display = "none";
    CROSSHAIR.style.display = "block";

    initConfig();
    initScene();
});

function initConfig() {
    playerConfig.camera.fov = FOV_INPUT.value;
    spawnerConfig.target_number = TARGET_NUMBER_INPUT.value;
    spawnerConfig.target_size = TARGET_SIZE_INPUT.value;
    spawnerConfig.size[0] = SPAWNER_WIDTH_INPUT.value;
    spawnerConfig.size[1] = SPAWNER_HEIGHT_INPUT.value;
}

function enforceMinMax(element_) {
    if (element_.value != "") {
        if (parseInt(element_.value) < parseInt(element_.min)) {
            element_.value = element_.min;
        }
        if (parseInt(element_.value) > parseInt(element_.max)) {
            element_.value = element_.max;
        }
    }
}

SETTINGS_BUTTON.addEventListener("click", () => {
    if (isSettingsDisplayed == false) {
        isSettingsDisplayed = true;
        SETTINGS.style.display = "";
    } else {
        isSettingsDisplayed = false;
        SETTINGS.style.display = "none";
    }
});

let scene, camera, renderer;
let loaded = false;

let playerConfig = {
    camera: {
        fov: 70,
        positionZ: 15,
    }
}
let controllerConfig = {
    camera: {
        sensitivity: {
            x: 0.6,
            y: 0.6,
        }
    }
}
let spawnerConfig = {
    target_size: 2,
    target_number: 3,
    position: [0, 0, 0],
    size: [15, 15],
    
}
let spawnerList = new Array();

function initSkybox(scene_) {
    let skybox = new THREE.CubeTextureLoader().load([
        "./public/img/skybox/right.bmp",
        "./public/img/skybox/left.bmp",
        "./public/img/skybox/top.bmp",
        "./public/img/skybox/bottom.bmp",
        "./public/img/skybox/front.bmp",
        "./public/img/skybox/back.bmp",
    ]);

    scene_.background = skybox;
}

function initScene() {
    loaded = true;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(playerConfig.camera.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    
    camera.rotation.order = "YXZ";
    camera.position.z = playerConfig.camera.positionZ;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    
    document.body.appendChild(renderer.domElement);
    initSkybox(scene);

    createSpawner(scene);
    initController(scene, camera, controllerConfig);
}

function initController(scene_, camera_, controllerConfig_) {
    const controller = new Controller(scene_, camera_, controllerConfig_);
    controller.initCameraControl();
    controller.initShootControl(spawnerList[0]);
}

function createSpawner(scene_) {
    const position = [0, 0, 0];
    const size = [15, 15];

    const spawner = new TargetSpawner(scene_, spawnerConfig);
    spawner.toggleDisplay();
    spawnerList.push(spawner);
    
    return spawner;
}

function animate() {
    renderer.render(scene, camera);
}

function random(min_, max_) {
    let number = Math.random() * (max_ - min_) + min_;
    return number;
}

window.addEventListener("resize", () => {
    if (loaded) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
});

