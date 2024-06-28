class TargetSpawner {
    #isDisplay = false;
    #targetList = new Array();
    #targetSize;
    #targetNumber;

    constructor(scene_, spawnerConfig_) {
        this.scene = scene_;
        this.#targetNumber = spawnerConfig_.target_number;
        this.#targetSize = spawnerConfig_.target_size;
        this.size = spawnerConfig_.size;
        this.position = spawnerConfig_.position;

        this.mesh();
        this.initTargets();
    }
    initTargets() {
        for (let i = 0; i < this.#targetNumber; i++) {
            this.spawnTarget();
        }
    }
    mesh() {
        const [sizex, sizey] = this.size;

        const geometry = new THREE.PlaneGeometry(sizex, sizey);

        const color = new THREE.Color("rgb(255, 0, 0)");
        const material = new THREE.MeshBasicMaterial( {color: color} );

        const mesh = new THREE.Mesh(geometry, material);
        this.mesh = mesh;

        const [positionx, positiony, positionz] = this.position;
        this.mesh.position.set(positionx, positiony, positionz);
    }
    toggleDisplay() {
        if (!this.#isDisplay) {
            this.#isDisplay = true;
            this.scene.add(this.mesh);
        } else {
            this.scene.remove(this.mesh);
            this.#isDisplay = false;
        }
    }
    spawnTarget() {
        let position = [random(this.mesh.position.x - this.size[0] / 2 + this.#targetSize / 2, this.mesh.position.x + this.size[0] / 2 - this.#targetSize / 2),
                        random(this.mesh.position.y - this.size[1] / 2 + this.#targetSize / 2, this.mesh.position.y + this.size[1] / 2 - this.#targetSize / 2),
                        this.mesh.position.z + this.#targetSize / 2];
        let target = this.createCube(position);
        this.scene.add(target);
        this.#targetList.push(target);
    }
    removeTarget(target_) {
        const index = this.#targetList.indexOf(target_);

        if (index < 0) return;
        this.scene.remove(target_);
        this.#targetList[index].remove();

        const POP_SOUND = new Audio("./public/audio/pop.mp3");
        POP_SOUND.play();
        
        this.spawnTarget();
    }
    createCube(position_) {
        const [positionx, positiony, positionz] = position_;
        
        let geometry = new THREE.BoxGeometry(this.#targetSize, this.#targetSize, this.#targetSize);

        let color = new THREE.Color("rgb(0, 0, 255)");
        let material = new THREE.MeshStandardMaterial( {color: color} );

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(positionx, positiony, positionz);
        return mesh;
    };
}