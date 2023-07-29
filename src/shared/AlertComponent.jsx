import React, { useEffect } from 'react';
import { Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { connect } from 'react-redux';

import { alertActions } from '../actions';
import { useAlert } from 'react-alert'

const AlertComponent = (props) => {
    const alertHook = useAlert();

    useEffect(() => {
        const { alert, clearAlert } = props;
        if (alert.type !== 'none') {
            const { type, message } = alert;
            alertHook.show(message, { type });
            clearAlert();
        }
    });

    return (
        <></>
    );
}

function mapStateToProps(state) {
    const { alert } = state;
    return { alert };
}

const actionCreators = {
    clearAlert: alertActions.clear
};

const connectedPage = connect(mapStateToProps, actionCreators)(AlertComponent);
export { connectedPage as AlertComponent }