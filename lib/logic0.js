/**
 * Transaction of asset(Car) from showroom to owner
 * @param {org.manufacturer.network.Purchase} purchase
 * @transaction
*/

async function transferCarToOwner(purchase){
    if(purchase.showroom.car.includes(purchase.car.carID)){
        let participantRegistry = await getParticipantRegistry('org.manufacturer.network.Showroom');
        let assetRegistry = await getAssetRegistry('org.manufacturer.network.Car');
        const carIndex = purchase.showroom.car.indexOf(purchase.car.carID);
        purchase.showroom.car.splice(carIndex,1);
        purchase.car.owner = purchase.newOwner;
        await participantRegistry.update(purchase.showroom);
        await assetRegistry.update(purchase.car);
    } else {
        throw new Error('Car is not available in showroom');
    }
    
}