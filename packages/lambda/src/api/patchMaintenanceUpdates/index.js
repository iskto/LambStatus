// Code generated by generate-maintenance-handler. DO NOT EDIT.
/* eslint-disable */
import EventsHandler from 'api/eventsHandler'
import { messageType } from 'aws/sns'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { MaintenanceUpdate } from 'model/maintenances'
import { ValidationError } from 'utils/errors'

export async function handle (event, context, callback) {
  try {
    const maintenanceID = event.params.maintenanceid
    const maintenanceUpdate = new MaintenanceUpdate({
      maintenanceID,
      maintenanceUpdateID: event.params.maintenanceupdateid,
      ...event.body
    })
    const handler = new EventsHandler(new MaintenancesStore(), new MaintenanceUpdatesStore())
    await handler.updateEventUpdate(maintenanceUpdate, messageType.maintenancePatched)

    callback(null, maintenanceUpdate.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case ValidationError.name:
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to update the maintenance update')
    }
  }
}
