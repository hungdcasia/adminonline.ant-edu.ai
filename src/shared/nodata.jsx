import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';

const NoData = ({ message }) => {
    return (
        <div className="no-data">
            <p className='no-data-icon'><FontAwesomeIcon icon={allIcon.faList} size='3x' /></p>
            <span className="no-data-label">{message}</span>
        </div>
    );
}

export { NoData }