import React, { Component } from 'react';

const ToggleSwitch = ({ name, value, onValueChange }) => {
    return (
        <div className="toggle-switch">
            <input
                type="checkbox"
                className="toggle-switch-checkbox"
                name={name}
                checked={value}
                onChange={(e) => onValueChange(e.target.checked)}
            />
            <label className="toggle-switch-label" htmlFor={name}>
                <span className="toggle-switch-inner" data-yes="yes" data-no="no" />
                <span className="toggle-switch-switch" />
            </label>
        </div>
    );
}

export { ToggleSwitch };