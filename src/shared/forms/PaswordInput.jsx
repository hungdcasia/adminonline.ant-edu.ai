import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { checkResetPassword, resetPassword } from "../../services";
import SimpleReactValidator from 'simple-react-validator';
import { newFormField, newValidationDescription, history } from "../../helpers";
import { ReactComponent as IconInputWarning } from "../../assets/images/ic_input_warning.svg";
import queryString from 'query-string';
import { ReactComponent as Show_password_icon } from "../../assets/images/show_password.svg";
import { ReactComponent as Hide_password_icon } from "../../assets/images/hide_password.svg";

const validator = new SimpleReactValidator();
const PasswordInput = (props) => {
    let { field, rawProps, name, label, onBlur, onChange, required } = props;
    let [isShow, setIsShow] = useState(false);
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value);

    const checkValidPassword = () => {
        field.checkValid();
        return field.valid;
    }

    field.onChecked = () => {
        reRender();
    }

    const onValueChange = (e) => {
        field.value = e.target.value;
        setValue(e.target.value);
        onChange?.call();
    }

    const reRender = () => {
        setRender(render + 1);
    }

    return (
        <div className="TextInput_container" render={render}>
            <label className="Label_label">{label} {required && <span>*</span>}</label>
            <div className="Input_inputWrap">
                <input placeholder=""
                    name={name}
                    type={isShow ? 'text' : 'password'}
                    maxLength="50"
                    className={`Input_input Input_m ${!field.valid && 'Input_invalid'}`}
                    {...rawProps}
                    onChange={onValueChange}
                    onBlur={() => { checkValidPassword(); onBlur?.call() }}
                    value={value} />
                <span className="Input_initIcon Input_iconContainer">
                    <button className="ranks_text base_button sizes_m tooltip_tooltip base_noPadding" type="button">
                        <div className="base_inner sizes_inner">
                            <span className="base_text"
                                onClick={() => setIsShow(!isShow)}>
                                {isShow ?
                                    <Show_password_icon className='PasswordField_iconButton' /> :
                                    <Hide_password_icon className='PasswordField_iconButton' />
                                }
                            </span>
                        </div>
                    </button>
                </span>
            </div>
            {!field.valid &&
                <div className="FormField_errorMessage">{field.errors[0]}</div>
            }
        </div>
    )
}

const TextInput = (props) => {
    let { field, rawProps, name, label, onBlur, onChange, required } = props;
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value);

    const checkValidPassword = () => {
        field.checkValid();
        return field.valid;
    }

    field.onChecked = () => {
        reRender();
    }

    const onValueChange = (e) => {
        field.value = e.target.value;
        setValue(e.target.value);
        onChange?.call();
    }

    const reRender = () => {
        setRender(render + 1);
    }

    return (
        <div className="TextInput_container" render={render}>
            <label className="Label_label">{label} {required && <span>*</span>}</label>
            <div className="Input_inputWrap">
                <input placeholder=""
                    name={name}
                    type='text'
                    maxLength="50"
                    className={`Input_input Input_m ${!field.valid && 'Input_invalid'}`}
                    {...rawProps}
                    onChange={onValueChange}
                    onBlur={() => { checkValidPassword(); onBlur?.call() }}
                    value={value} />
                {!field.valid &&
                    <span className="Input_errorIcon Input_iconContainer">
                        <IconInputWarning className="Input_icon" />
                    </span>
                }
            </div>
            {!field.valid &&
                <div className="FormField_errorMessage">{field.errors[0]}</div>
            }
        </div>
    )
}

export { PasswordInput, TextInput }