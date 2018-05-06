import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import AutolinkedText from 'components/common/AutolinkedText'
import { getMaintenanceColor } from 'utils/status'
import { getFormattedDateTime } from 'utils/datetime'
import classes from './MaintenanceItem.scss'

export default class MaintenanceItem extends React.Component {
  static propTypes = {
    maintenanceID: PropTypes.string.isRequired,
    maintenance: PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string,
      updatedAt: PropTypes.string.isRequired,
      startAt: PropTypes.string.isRequired,
      endAt: PropTypes.string.isRequired,
      maintenanceUpdates: PropTypes.arrayOf(PropTypes.shape({
        maintenanceUpdateID: PropTypes.string.isRequired,
        maintenanceStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }).isRequired,
    autoloadDetail: PropTypes.bool,
    fetchMaintenance: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (this.props.autoloadDetail) {
      this.props.fetchMaintenance(this.props.maintenance.maintenanceID)
    }
  }

  handleClickDetailButton = () => {
    this.props.fetchMaintenance(this.props.maintenance.maintenanceID)
  }

  renderMaintenanceUpdateItem = (maintUpdate) => {
    return (
      <div className={classes['update-item']} key={maintUpdate.maintenanceUpdateID}>
        <div>
          {maintUpdate.maintenanceStatus}
          <span className={classes['update-item-message']}> - <AutolinkedText text={maintUpdate.message} />
          </span>
        </div>
        <div className={classes['update-item-updatedat']}>
          {getFormattedDateTime(maintUpdate.createdAt)}
        </div>
      </div>
    )
  }

  render () {
    const { maintenance } = this.props
    const statusColor = getMaintenanceColor(maintenance.status)
    let maintenanceUpdateItems, detailButton
    if (maintenance.hasOwnProperty('maintenanceUpdates')) {
      maintenanceUpdateItems = maintenance.maintenanceUpdates.map(this.renderMaintenanceUpdateItem)
    } else if (this.props.autoloadDetail) {
      // now loading...
    } else {
      detailButton = (
        <i className={classnames(classes['details-icon'], 'material-icons')}
          onClick={this.handleClickDetailButton}>details</i>
      )
    }
    const startAt = getFormattedDateTime(maintenance.startAt, 'MMM DD, HH:mm ')
    const endAt = getFormattedDateTime(maintenance.endAt, 'MMM DD, HH:mm (z)')

    return (
      <li className={classnames('mdl-shadow--2dp', classes.item)}>
        <div className={classes['item-headline']}>
          <span className={classes['item-primary']}>
            <Link to={`/maintenances/${this.props.maintenanceID}`} className={classes['item-primary-link']}
              style={{color: statusColor}}>
              {maintenance.status} - {maintenance.name}
            </Link>
          </span>
          <span className={classes['item-secondary']}>
            Scheduled for {startAt} - {endAt}
          </span>
          {detailButton}
        </div>
        {maintenanceUpdateItems}
      </li>
    )
  }
}
