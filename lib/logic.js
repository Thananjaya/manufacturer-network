/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Transaction of asset(Car) from manufacturer to showroom
 * @param {org.manufacturer.network.Allocate} allocate
 * @transaction
 */

async function allocateCarToShowroom(allocate) {
    let participantRegistry = await getParticipantRegistry('org.manufacturer.network.Showroom');
    let assetRegistry = await getAssetRegistry('org.manufacturer.network.Car');
    allocate.newShowroom.car.push(allocate.car.carID);
    allocate.car.showroom = allocate.newShowroom;
    await participantRegistry.update(allocate.newShowroom);
    await assetRegistry.update(allocate.car);
}

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
