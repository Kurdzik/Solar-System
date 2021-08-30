export class Stars {
    constructor(scene, starLimit = 5e2, starScale = .71, starSizeVariance = .8, radius = 300, twinkleStars = true, starNoise = true, showMilkyWay = false) {
        this.scene = scene

        this.starLimit = starLimit;
        this.starScale = starScale;
        this.starSizeVariance = starSizeVariance;
        this.radius = radius;
        this.ShowAsterisms = false;
        this.asterismColor = BABYLON.Color3(0, 0, .7); // d
        this.twinkleStars = twinkleStars;
        this.starNoise = starNoise;
        this.showMilkyWay = showMilkyWay;
    }


    loadAssets() {
        function runCreateSky(this_) {
            if (starData && milkyWay) {
                this_.createSky(starData, milkyWay);
            }
        }

        let assetsManager = new BABYLON.AssetsManager(this.scene);
        let StarData = assetsManager.addTextFileTask("starData", '../assets/stars/starsData.json');
        let MilkyWay = assetsManager.addImageTask("milkyWay", '../assets/stars/eso0932a.png');

        let starData = null,
            milkyWay = null;

        StarData.onSuccess = (task) => {
            starData = JSON.parse(task.text);
            runCreateSky(this);
        }

        MilkyWay.onSuccess = (task) => {
            milkyWay = task;
            runCreateSky(this);
        }

        assetsManager.load();
    }

    _starColor(i, starData) {
        let t = BABYLON.Scalar.Normalize(starData.colorIndexBV[i], -.4, 2);
        let a = starData.color.length - 1
        let r = Math.round(a * t);
        r = BABYLON.Scalar.Clamp(r, 0, a);
        let n = starData.color[r];

        return new BABYLON.Color4(n[0], n[1], n[2], n[3]);
    }

    createSky(starData, milkyWay) {

        let starMesh = new BABYLON.Mesh('starMesh', this.scene);
        starMesh.alphaIndex = 20;

        let starsCoordinates = []; //c
        let starsIndices = [];
        let starsColor = []; //x
        let starsUV_1 = [];
        let starsUV_2 = [];
        let L = 0;

        for (let starLimitLoop = Math.min(starData.rightAscension.length, this.starLimit), i = 0; i < starLimitLoop; i++) {

            let rightAscension = starData.rightAscension[i];
            let declination = starData.declination[i];
            //let scaleFactor = ( 2.44 + starData.apparentMagnitude[i]) * this.starScale; //93 line, as function
            //let scaleFactor = ( 8.8 - starData.apparentMagnitude[i]); //93 line, as function

            //if (i == 0) {
            //console.log(i, starData.apparentMagnitude[i], scaleFactor );
            //}


            let scaleFactor = ((8.8 - starData.apparentMagnitude[i]) - this.starSizeVariance) * this.starScale; //93 line, as function


            let _ = new BABYLON.Vector3(0 * scaleFactor, .7 * scaleFactor, this.radius);
            let C = new BABYLON.Vector3(-.5 * scaleFactor, -.3 * scaleFactor, this.radius);
            let f = new BABYLON.Vector3(.5 * scaleFactor, -.3 * scaleFactor, this.radius);

            let coorTransformer = BABYLON.Matrix.RotationYawPitchRoll(-rightAscension, -declination, 0);

            _ = BABYLON.Vector3.TransformCoordinates(_, coorTransformer);
            C = BABYLON.Vector3.TransformCoordinates(C, coorTransformer);
            f = BABYLON.Vector3.TransformCoordinates(f, coorTransformer);
            starsCoordinates.push(_.x, _.y, _.z, C.x, C.y, C.z, f.x, f.y, f.z);

            let starColor = this._starColor(i, starData);
            starsColor.push(starColor.r, starColor.g, starColor.b, starColor.a, starColor.r, starColor.g, starColor.b, starColor.a, starColor.r, starColor.g, starColor.b, starColor.a);
            starsUV_1.push(.5, 1, 0, 0, 1, 0);
            let b = Math.random(),
                S = Math.random();
            starsUV_2.push(b, S, b, S, b, S);
            starsIndices.push(L, L + 1, L + 2);
            L += 3;
        }

        let vertexData = new BABYLON.VertexData;
        vertexData.positions = starsCoordinates;
        vertexData.indices = starsIndices;
        vertexData.colors = starsColor;
        vertexData.uvs = starsUV_1;
        vertexData.uvs2 = starsUV_2;
        vertexData.applyToMesh(starMesh);

        let starMaterial = new BABYLON.StandardMaterial('starMaterial', this.scene); // I
        let starTexture = new BABYLON.Texture('../assets/stars/star.png', this.scene);

        starMaterial.opacityTexture = starTexture;
        starMaterial.disableLighing = true;
        starMesh.material = starMaterial;

        if (this.twinkleStars) {
            let noiseTexture = new BABYLON.Texture("../assets/stars/noise.png", this.scene);
            M
            starMaterial.emissiveTexture = noiseTexture;
            noiseTexture.coordinatesIndex = 1;
            console.log(noiseTexture);
            this.scene.registerBeforeRender(() => {
                noiseTexture.uOffset += .008;
            })
        } else {
            starMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        }

        if (this.starNoise) {
            let backgroundStarNoise = BABYLON.MeshBuilder.CreateSphere("backgroundStarNoise", {
                segments: 12,
                diameter: 2000,
                sideOrientation: BABYLON.Mesh.BACKSIDE
            });
            let backgroundStarNoise_nMat = new BABYLON.NodeMaterial("nodeMaterial_backgroundStarNoise", this.scene, {
                emitComments: true
            });
            backgroundStarNoise_nMat.loadAsync("../assets/nodeMaterials/noise01.json").then(() => {
                backgroundStarNoise_nMat.build(false);
                backgroundStarNoise.material = backgroundStarNoise_nMat;
                // earth.material.enableSpecularAntiAliasing = true;
                // earth.material.wireframe = true;
                // backgroundStarNoise_nMat.backFaceCulling = false;
            });

        }

        if (this.showMilkyWay) {
            let P = 2 * Math.PI * this.radius / 4 / 2;
            let E = [new BABYLON.Vector3(0, 0, P / 2), new BABYLON.Vector3(0, 0, -P / 2)];
            let galacticMesh = BABYLON.MeshBuilder.CreateTube("tube", {
                path: E,
                tessellation: 12,
                radius: this.radius,
                sideOrientation: BABYLON.Mesh.BACKSIDE,
                updatable: false
            }, this.scene);
            galacticMesh.alphaIndex = 0;

            galacticMesh.rotate(new BABYLON.Vector3(0, 0, -1), .57);
            galacticMesh.rotate(new BABYLON.Vector3(1, 0, 0), .48);
            galacticMesh.rotate(new BABYLON.Vector3(0, -1, 0), .22);

            var galacticTexture = new BABYLON.Texture("../assets/stars/milkyway.png", this.scene, true, false);
            var galacticMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
            galacticMaterial.cullBackFaces = true;
            galacticMaterial.backFaceCulling = true;
            galacticMaterial.disableLighting = true;
            galacticMaterial.emissiveTexture = galacticTexture;
            galacticMaterial.alpha = 0.3;
            galacticMesh.material = galacticMaterial;
            // j.material.alpha = .5; // ? 
        }
    }
}