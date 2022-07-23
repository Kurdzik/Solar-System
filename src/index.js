import * as BABYLON from 'babylonjs';
import {
    Stars
} from './SkyObjects.js';
import {
    XREnviromnent
} from './XREnviromnent.js';


//SIZES
const earthSize = 10 //change only this parameter in order to change relative planet sizes and distances between planets




const sunSize = 10 * earthSize 
const mercurySize = 0.38 * earthSize
const venusSize = 0.95 * earthSize
const moonSize = 0.27 * earthSize
const marsSize = 0.53 * earthSize
const phobosSize = marsSize * 0.1
const deimosSize = marsSize * .15
const jupiterSize = 8 * earthSize //10,97
const saturnSize = 7 * earthSize //9,14

//distance from Sun
const earthDist = earthSize / 0.04 //1175.4
const mercuryDist = 0.39 * earthDist //455.01
const venusDist = 0.72 * earthDist //850.14
const marsDist = 1.52 * earthDist //1790.64
const jupiterDist = 2.7 * earthDist //6116.79 
const saturnDist = 3.5 * earthDist //10500 

class Scene {

    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine)

        this.rotationSpeed = 0.0002
        this.orbitalSpeed = 0.000007

        this.alphaMercury = 2
        this.alphaVenus = 4
        this.alphaEarth = 0
        this.alphaMoon = 0
        this.alphaMars = -2
        this.alphaPhobos = .3
        this.alphaDeimos = 0
        this.alphaJupiter = 0.9
        this.alphaSaturn = -0.5

    }

    sceneBackgrund() {
        
        // Section responsible for rendering milky way
        let stars = new Stars(this.scene, 50e2, .38, -1.62, 1000, false, true, true) //scene, starLimnit, starScale 0.71, radius, twinkleStars, showMilkyWay
        stars.loadAssets();
        
        
        
        
        this.scene.clearColor = new BABYLON.Color3.Black()

        
        
        // Section responsible for rendering alternative stars background (sky box) you can also which paths to ./textures/skybox_neb/... for an alterinative green look
        
        /*const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
            size: 10000.0
        }, this.scene);

        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        const files = [
            "./skybox/right.png",
            "./skybox/top.png",
            "./skybox/front.png",
            "./skybox/left.png",
            "./skybox/bottom.png",
            "./skybox/back.png",
        ];
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture.CreateFromImages(files, this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.infiniteDistance = true
        skybox.material = skyboxMaterial

*/
        let ground = BABYLON.Mesh.CreateGround("ground", 3200, 3200, 2, this.scene);
        let groundMat = new BABYLON.StandardMaterial("groundMaterial");
        groundMat.alpha = 0;
        ground.material = groundMat;
        ground.isPickable = false;



        // Uncomment following section if you want to see the scene in VR:
        /*
                let xrEnviromnent = new XREnviromnent(
                    this.scene, ground
                );
                let createXRInstance = xrEnviromnent.createXREnviromnent();
            */
    }

  
    
    flyCamera() {
        const camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), this.scene)
        camera.rollCorrect = 10
        camera.bankedTurn = true
        camera.bankedTurnLimit = Math.PI / 2
        camera.attachControl(this.canvas, true)
    }

    createSun() {
        this.sun = BABYLON.Mesh.CreateSphere("sun", 32, sunSize, this.scene, false)
        this.sun.material = new BABYLON.StandardMaterial("sunmat", this.scene)
        this.sun.material.emissiveTexture = new BABYLON.Texture("./textures/sun.jpg")
        this.sun.position = new BABYLON.Vector3(0, 0, 0)
    }

    createMercury() {
        this.mercury = BABYLON.Mesh.CreateSphere("mercury", 32, mercurySize, this.scene, false)
        this.mercury.material = new BABYLON.StandardMaterial("mercmat", this.scene)
        this.mercury.material.ambientTexture = new BABYLON.Texture("./textures/mercury.jpg")

    }

    createVenus() {
        this.venus = BABYLON.Mesh.CreateSphere("venus", 32, venusSize, this.scene, false)
        this.venus.material = new BABYLON.StandardMaterial("venusmat", this.scene)
        this.venus.material.ambientTexture = new BABYLON.Texture("./textures/venus.jpg")

    }

    createEarth() {
        this.earth = BABYLON.Mesh.CreateSphere("earth", 32, earthSize, this.scene, false)
        this.earth.material = new BABYLON.StandardMaterial("earthmat", this.scene)
        this.earth.material.ambientTexture = new BABYLON.Texture("./textures/earth.jpg")

    }

    createMoon() {
        this.moon = BABYLON.Mesh.CreateSphere("moon", 32, moonSize, this.scene, false)
        this.moon.material = new BABYLON.StandardMaterial("moonmat", this.scene)
        this.moon.material.ambientTexture = new BABYLON.Texture("./textures/moon.jpg")

    }

    createMars() {
        this.mars = BABYLON.Mesh.CreateSphere("mars", 32, marsSize, this.scene, false)
        this.mars.material = new BABYLON.StandardMaterial("marsmat", this.scene)
        this.mars.material.ambientTexture = new BABYLON.Texture("./textures/mars.jpg")

    }


    createPhobos() {
        this.phobos = BABYLON.Mesh.CreateSphere("phobos", 32, phobosSize, this.scene, false)
        this.phobos.material = new BABYLON.StandardMaterial("phobosmat", this.scene)
        this.phobos.material.ambientTexture = new BABYLON.Texture("./textures/phobos.jpg")

    }

    createDeimos() {
        this.deimos = BABYLON.Mesh.CreateSphere("deimos", 32, deimosSize, this.scene, false)
        this.deimos.material = new BABYLON.StandardMaterial("deimosmat", this.scene)
        this.deimos.material.ambientTexture = new BABYLON.Texture("./textures/deimos.jpg")

    }

    createJupiter() {
        this.jupiter = BABYLON.Mesh.CreateSphere("jupiter", 32, jupiterSize, this.scene, false)
        this.jupiter.material = new BABYLON.StandardMaterial("jupitermat", this.scene)
        this.jupiter.material.ambientTexture = new BABYLON.Texture("./textures/jupiter.jpg")

    }

    createSaturn() {
        this.saturn = BABYLON.Mesh.CreateSphere("saturn", 32, saturnSize, this.scene, false)
        this.saturnRings = BABYLON.Mesh.CreateCylinder("cylinder", 1, saturnSize * 2.5, saturnSize * 2.5, 24, 1, this.scene)
        this.saturn.material = new BABYLON.StandardMaterial("saturnmat", this.scene)
        this.saturn.material.ambientTexture = new BABYLON.Texture("./textures/saturn.jpg")
        this.saturnRings.material = new BABYLON.StandardMaterial("saturnRingmat", this.scene)
        this.saturnRings.material.ambientTexture = new BABYLON.Texture("./textures/saturnrings1.png")
        this.saturnRings.material.alpha = .8
    }


    pointLight() {
        this.light = new BABYLON.PointLight('PointLisht', this.sun.position, this.scene)
        this.light.diffuse = new BABYLON.Color3(1, 1, 1)
    }

    planetMovement() { 
        this.mercury.position = new BABYLON.Vector3(mercuryDist * Math.sin(this.alphaMercury), this.sun.position.y - 10, mercuryDist * Math.cos(this.alphaMercury));
        this.venus.position = new BABYLON.Vector3((venusDist * Math.sin(this.alphaVenus)), this.sun.position.y + 70, (venusDist * Math.cos(this.alphaVenus)))
        this.earth.position = new BABYLON.Vector3((earthDist * Math.sin(this.alphaEarth)), this.sun.position.y, (earthDist * Math.cos(this.alphaEarth)));
        this.moon.position = new BABYLON.Vector3((this.earth.position.x + Math.sin(this.alphaMoon) * earthSize * 1.5), this.sun.position.y + 10, (this.earth.position.z + Math.cos(this.alphaMoon) * earthSize * 1.5));
        this.mars.position = new BABYLON.Vector3((marsDist * Math.sin(this.alphaMars)), this.sun.position.y - 50, (marsDist * Math.cos(this.alphaMars)));
        this.phobos.position = new BABYLON.Vector3((this.mars.position.x + Math.sin(this.alphaPhobos) * marsSize * 2), this.sun.position.y - 55, (this.mars.position.z + Math.cos(this.alphaPhobos) * marsSize * 2));
        this.deimos.position = new BABYLON.Vector3((this.mars.position.x + Math.sin(this.alphaDeimos) * marsSize * 5), this.sun.position.y - 47, (this.mars.position.z + Math.cos(this.alphaDeimos) * marsSize * 5));
        this.jupiter.position = new BABYLON.Vector3((jupiterDist * Math.sin(this.alphaJupiter)), this.sun.position.y + 150, (jupiterDist * Math.cos(this.alphaJupiter)));
        this.saturn.position = new BABYLON.Vector3((saturnDist * Math.sin(this.alphaSaturn)), this.sun.position.y - 150, (saturnDist * Math.cos(this.alphaSaturn)));
        this.saturnRings.position = new BABYLON.Vector3((saturnDist * Math.sin(this.alphaSaturn)), this.sun.position.y - 150, (saturnDist * Math.cos(this.alphaSaturn)));

        this.alphaEarth += this.orbitalSpeed
        this.alphaMoon += this.orbitalSpeed * 2
        this.alphaMercury += this.orbitalSpeed * (365 / 88)
        this.alphaVenus += this.orbitalSpeed * (365 / 225)
        this.alphaMars += this.orbitalSpeed * (365 / 687)
        this.alphaPhobos += this.orbitalSpeed * 5
        this.alphaDeimos += this.orbitalSpeed * 3
        this.alphaJupiter += this.orbitalSpeed / 12
        this.alphaSaturn += this.orbitalSpeed / 29
    }

    planetRotation() {
        this.mercury.rotate(BABYLON.Axis.Y, this.rotationSpeed / 2.42, BABYLON.Space.LOCAL);
        this.venus.rotate(BABYLON.Axis.Y, -this.rotationSpeed / 243, BABYLON.Space.LOCAL);
        this.earth.rotate(BABYLON.Axis.Y, this.rotationSpeed, BABYLON.Space.LOCAL);
        this.mars.rotate(BABYLON.Axis.Y, this.rotationSpeed, BABYLON.Space.LOCAL);
        this.jupiter.rotate(BABYLON.Axis.Y, this.rotationSpeed / 0.21, BABYLON.Space.LOCAL);
        this.saturn.rotate(BABYLON.Axis.Y, this.rotationSpeed / 0.43, BABYLON.Space.LOCAL);
        this.moon.rotate(BABYLON.Axis.Y, -this.rotationSpeed, BABYLON.Space.LOCAL)
    }

    doRender() {
        this.engine.runRenderLoop(() => {
            this.scene.render();;
            this.planetMovement()
            this.planetRotation()
        });
        window.addEventListener('resize', () => {
            this.engine.resize();
        })
    }
}






window.onload = function () {
    const scene = new Scene('renderCanvas');
    scene.sceneBackgrund()
    scene.flyCamera()
    scene.createEarth()
    scene.createSun()
    scene.createMoon()
    scene.createMercury()
    scene.createVenus()
    scene.createMars()
    scene.createPhobos()
    scene.createDeimos()
    scene.createJupiter()
    scene.createSaturn()
    scene.pointLight()
    scene.doRender();
};
