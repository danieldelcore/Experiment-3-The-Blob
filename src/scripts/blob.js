const THREE = require('three');

export default class Blob {
    constructor(gui) {
        this.config = {
            size: 80,
            speed: 500,
            radius: 400,
            widthSeg: 50,
            heightSeg: 50,
        };

        const geometry = new THREE.SphereGeometry(
            this.config.radius,
            this.config.widthSeg,
            this.config.heightSeg);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 30,
            shading: THREE.FlatShading,
            // wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);
        this.warpVector = new THREE.Vector3(0, 200, 0);
        this.initGui(gui);
    }

    initGui(gui) {
        const folder = gui.addFolder('Sphere');
        folder.add(this.config, 'size', 80, 200)
            .onChange(c => this.config.size = Number(c));
        folder.add(this.config, 'speed', 1, 1000);
    }

    getArcLength(fromVec, toVec) {
        const angle = Math.atan2(toVec.y - fromVec.y, toVec.x - fromVec.x);
        return this.config.radius * angle;
    }

    update(timeStamp) {
        const { vertices } = this.mesh.geometry;
        const { size, speed, radius } = this.config;

        for (let i = 0; i < vertices.length; i++) {
            const v = vertices[i];
            const dist = v.distanceTo(this.warpVector);
            const radian = (0.8 + 0.2 * Math.sin(dist / -size + (timeStamp / speed))) * radius;
            v.normalize().multiplyScalar(radian);
        }

        const warpSine = (Math.sin(timeStamp / (speed * 8))) * (radius * 2);
        this.warpVector.y = warpSine;
        this.warpVector.x = warpSine;
        this.warpVector.z = warpSine;

        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeFaceNormals();
        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.geometry.elementsNeedUpdate = true;
        this.mesh.geometry.normalsNeedUpdate = true;
    }
}
