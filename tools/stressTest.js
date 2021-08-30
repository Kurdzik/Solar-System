export function createDuplicates(assetLoader, x, y) {

    let seatOrg = assetLoader.avaiableMeshes.filter(element => element.name == 'seat')[0].loadedMeshes[0]
    let frameOrg = assetLoader.avaiableMeshes.filter(element => element.name == 'frame')[0].loadedMeshes[0]    

    let seatArray = []; 
    let frameArray = [];  
    let arrayDim = [x, y]; //= 51 objects

    for (let i = 0; i < arrayDim[0]; i++) {   
        for (let j = 0; j< arrayDim[1]; j++) {
            let seatNew = seatOrg.clone("newBoxx" + i + j);  
            let frameNew = frameOrg.clone("newBoxx" + i + j);

            seatArray.push(seatNew);
            frameArray.push(frameNew);   
            seatNew.position.x += i + 1; 
            seatNew.position.z += j + 1; 
            frameNew.position.x += i + 1;
            frameNew.position.z += j + 1;
        }  
    } 
}
