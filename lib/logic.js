/**
 * Transaction of asset(Car) from manufacturer to showroom
 * @param {org.manufacturer.network.Allocate} allocate
 * @transaction
 */

async function allocateVechicleToShowroom(allocate) {
  
    if (allocate.showroom.vehicles.includes(allocate.vehicle.vin)) {
        throw new Error('Vechicle was aready allocated to the given showroom');
    } else {
        let participantRegistry =  await getParticipantRegistry('org.manufacturer.network.Showroom');
        let assetRegistry = await getAssetRegistry('org.manufacturer.network.Vehicle');
        
        allocate.showroom.vehicles.push(allocate.vehicle.vin);
        allocate.vehicle.showroom = allocate.showroom;
        
        await participantRegistry.update(allocate.showroom);
        await assetRegistry.update(allocate.vehicle);
    }
    
}
  
/**
 * Transaction of asset(Car) from ahowroom to owner
 * @param {org.manufacturer.network.OrderPlaced} order
 * @transaction
 */
  
async function placeOrder(order) {
    
    const namespace = 'org.manufacturer.network';
    const factory = getFactory();
    
    let vehicleRegistry =  await getAssetRegistry('org.manufacturer.network.Vehicle');
    let orderRegistry = await getAssetRegistry('org.manufacturer.network.Order');
    
    order.vehicle.owner = order.owner;
    await vehicleRegistry.update(order.vehicle);
    
    const newOrder =  factory.newResource(namespace, 'Order', order.orderId);
    newOrder.vehicle = order.vehicle;
    await orderRegistry.add(newOrder);
    
    const placedOrderEvent = factory.newEvent(namespace, 'OrderPlacedEvent');
    placedOrderEvent.vehicle = newOrder.vehicle;
    placedOrderEvent.orderId = order.orderId;
    placedOrderEvent.owner = newOrder.vehicle.owner;
    emit(placedOrderEvent);
}
  