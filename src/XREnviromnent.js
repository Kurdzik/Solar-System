export class XREnviromnent {
    constructor(scene, ground) {
        this.scene = scene;
        this.ground = ground;
    }

    async createXREnviromnent() {
        this.xr = await this.scene.createDefaultXRExperienceAsync();

        if (this.xr.baseExperience) {
            let featuresManager = this.xr.baseExperience.featuresManager;
            let teleportation = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "latest", {
                xrInput: this.xr.input,
                floorMeshes: [this.ground],
                defaultTargetMeshOptions: {
                    disableAnimation: true,
                    disableLighting: true,
                },
            });

            let XRCamera = this.scene.cameras.filter(element => element.id == '')[0];
            XRCamera.id = 'XRCamera'
            XRCamera.name = 'XRCamera'

            return 'WebXR support'
        } else {
            return null
        }
    }

    grabbingWithPointer() {
        let observers = {};
        let meshesUnderPointer = {};
        let tmpRay = new BABYLON.Ray();
        tmpRay.origin = new BABYLON.Vector3();
        tmpRay.direction = new BABYLON.Vector3();

        let scalar;

        let originalPadPosition = new BABYLON.Vector3();
        let originalPadRotation = new BABYLON.Vector3();
        let originalObjectPosition = new BABYLON.Vector3();
        let originalMeshRotation = new BABYLON.Vector3();

        this.xr.input.onControllerAddedObservable.add((inputSource) => {
            inputSource.onMotionControllerInitObservable.add((motionController) => {

                const squeezeComponent = motionController.getComponent("xr-standard-squeeze");
                const triggerComponent = motionController.getComponent("xr-standard-trigger");
                if (squeezeComponent) {
                    squeezeComponent.onButtonStateChangedObservable.add((component) => {
                        if (squeezeComponent.changes.pressed) {
                            if (squeezeComponent.pressed) {
                                inputSource.getWorldPointerRayToRef(tmpRay, false);

                                //let mesh = this.scene.meshUnderPointer;
                                let mesh;
                                if (this.xr.pointerSelection.getMeshUnderPointer) {
                                    mesh = this.xr.pointerSelection.getMeshUnderPointer(inputSource.uniqueId);
                                    mesh ? originalObjectPosition.copyFrom(mesh.position) : null;
                                }

                                let dontPickTag = null;
                                try {
                                    if (Object.keys(mesh._tags).includes('dontPick')) {
                                        dontPickTag = true;
                                    }
                                } catch {};

                                if (mesh && mesh.isPickable && !dontPickTag) {

                                    meshesUnderPointer[inputSource.uniqueId] = mesh;
                                    scalar = BABYLON.Vector3.Distance(tmpRay.origin, mesh.position);

                                    let taggedMeshes;
                                    if (BABYLON.Tags.HasTags(mesh)) {
                                        taggedMeshes = this.scene.getMeshesByTags(Object.keys(mesh._tags)[0]) //works when mesh has only one tag
                                        taggedMeshes = taggedMeshes.filter(function (item) {
                                            return item.id != mesh.id;
                                        });
                                        //taggedMeshes = taggedMeshes.filter(function(item) { return item.name != mesh.name; }); 

                                        for (let i_mesh of taggedMeshes) {
                                            i_mesh.relativeDistance = i_mesh.position.subtract(mesh.position);
                                        };
                                    }

                                    if (JSON.stringify(originalPadPosition) == JSON.stringify(new BABYLON.Vector3())) {
                                        originalPadPosition.copyFrom(tmpRay.origin);
                                        originalPadRotation.copyFrom(tmpRay.direction);
                                        originalMeshRotation.copyFrom(mesh.position.subtract(originalPadPosition).normalize())
                                    }

                                    observers[inputSource.uniqueId] = this.xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
                                        inputSource.getWorldPointerRayToRef(tmpRay, false);
                                        mesh.position.copyFrom(tmpRay.origin);
                                        mesh.translate(originalMeshRotation.add(tmpRay.direction.subtract(originalPadRotation)), scalar, BABYLON.Space.WORLD);

                                        if (taggedMeshes) {
                                            let matrix = mesh.computeWorldMatrix(true);
                                            for (let i_mesh of taggedMeshes) {
                                                const local_position = i_mesh.relativeDistance;
                                                let global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix)
                                                i_mesh.position = global_position;
                                            };
                                        }

                                    });

                                }
                            } else {
                                if (observers[inputSource.uniqueId] && meshesUnderPointer[inputSource.uniqueId]) {
                                    this.xr.baseExperience.sessionManager.onXRFrameObservable.remove(observers[inputSource.uniqueId]);
                                    observers[inputSource.uniqueId] = null;
                                    originalPadPosition = new BABYLON.Vector3();
                                }
                            }
                        }
                    });
                }


            });
        });

    }
}