import { CFormGroup, CFormText, CInput, CLabel, CInvalidFeedback, CTextarea } from '@coreui/react';
import React, { Component, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import DateTimePicker from 'react-datetime-picker';
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

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        setRender(render + 1);
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
            <CLabel htmlFor={name}>{label} {required && <span>*</span>}</CLabel>
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
    let [value, setValue] = useState(field.value ?? '');

    const checkValid = () => {
        field.checkValid();
        return field.valid;
    }

    field.onChecked = () => {
        reRender();
    }

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        setRender(render + 1);
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
        <CFormGroup>
            <CLabel htmlFor={name}>{label} {required && <span>*</span>}</CLabel>
            <input
                type="text"
                className={`form-control ${field.valid ? '' : 'is-invalid'}`}
                id={name}
                name={name}
                {...rawProps}
                value={value}
                onBlur={() => { checkValid(); onBlur?.call() }}
                onChange={onValueChange}
            />
            {!field.valid &&
                <CInvalidFeedback >{field.errors[0]}</CInvalidFeedback>
            }
        </CFormGroup>
    )
}

const NumberInput = (props) => {
    let { field, rawProps, name, label, onBlur, onChange, required } = props;
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value ?? '');

    const checkValid = () => {
        field.checkValid();
        return field.valid;
    }

    field.onChecked = () => {
        reRender();
    }

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        setRender(render + 1);
    }

    const onValueChange = (e) => {
        var number = Number(e.target.value) ?? 0;
        field.value = number;
        setValue('' + number);
        onChange?.call();
    }

    const reRender = () => {
        setRender(render + 1);
    }

    return (
        <CFormGroup>
            <CLabel htmlFor={name}>{label} {required && <span>*</span>}</CLabel>
            <input
                type="number"
                className={`form-control ${field.valid ? '' : 'is-invalid'}`}
                id={name}
                name={name}
                {...rawProps}
                value={value}
                onBlur={() => { checkValid(); onBlur?.call() }}
                onChange={onValueChange}
            />
            {!field.valid &&
                <CInvalidFeedback >{field.errors[0]}</CInvalidFeedback>
            }
        </CFormGroup>
    )
}

const TextAreaInput = (props) => {
    let { field, rawProps, name, label, onBlur, onChange, required } = props;
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value ?? '');

    const checkValid = () => {
        field.checkValid();
        return field.valid;
    }

    field.onChecked = () => {
        reRender();
    }

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        setRender(render + 1);
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
        <CFormGroup>
            <CLabel htmlFor={name}>{label} {required && <span>*</span>}</CLabel>
            <textarea
                type="text"
                className={`form-control ${field.valid ? '' : 'is-invalid'}`}
                id={name}
                name={name}
                {...rawProps}
                value={value}
                onBlur={() => { checkValid(); onBlur?.call() }}
                onChange={onValueChange}
            />
            {!field.valid &&
                <CInvalidFeedback >{field.errors[0]}</CInvalidFeedback>
            }
        </CFormGroup>
    )
}

const CheckboxInput = (props) => {
    let { field, rawProps, name, label, onBlur, onChange, required } = props;
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value);

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        reRender();
    }

    field.onChecked = () => {
        reRender();
    }

    const onValueChange = (e) => {
        field.value = e.target.checked;
        setValue(e.target.checked);
        onChange?.call();
    }

    const reRender = () => {
        setRender(render + 1);
    }

    return (
        <CFormGroup>
            <div className="custom-control custom-checkbox">
                <input type="checkbox"
                    className="custom-control-input"
                    id={name} name={name}
                    checked={value}
                    {...rawProps}
                    onChange={onValueChange} />
                <label className="custom-control-label" htmlFor={name}>{label}</label>
            </div>
        </CFormGroup>
    )
}

const SelectInput = ({ field, rawProps, name, label, onBlur, onChange, required, dataSource }) => {
    // let  = props;
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value);

    const checkValid = () => {
        field.checkValid();
        return field.valid;
    }

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        reRender();
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
        <CFormGroup>
            <CLabel htmlFor={name}>{label} {required && <span>*</span>}</CLabel>
            <select className={`custom-select ${field.valid ? '' : 'is-invalid'}`}
                value={value}
                onChange={onValueChange}
                onBlur={checkValid}
                {...rawProps}
            >
                {!dataSource.some(r => r.id == 0) &&
                    <option value={0} disabled={required}>Chọn</option>
                }
                {dataSource.filter(item => item.isGroup).length > 0 &&
                    dataSource.filter(item => item.isGroup).map(group => {
                        return (
                            <optgroup label={group.name} key={`group${group.id}`}>
                                {dataSource.filter(item => item.parent == group.id)
                                    .map(item => {
                                        return (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                    })}
                            </optgroup>
                        )
                    })
                }
                {dataSource.filter(item => item.isGroup).length == 0 && dataSource.map(item =>
                    <option key={item.id} value={item.id}>{item.name}</option>
                )}
            </select>
            {!field.valid &&
                <CInvalidFeedback >{field.errors[0]}</CInvalidFeedback>
            }
        </CFormGroup>
    )
}

const ImageInput = (props) => {
    let { field, rawProps, name, label, onBlur, onChange, required, dataSource } = props;
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value);

    const checkValid = () => {
        field.checkValid();
        return field.valid;
    }

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        reRender();
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
        <CFormGroup>
            <CLabel htmlFor={name}>{label} {required && <span>*</span>}</CLabel>
            <img className={`${field.valid ? '' : 'is-invalid'}`}
                src={value}
                {...rawProps}
            />
            {!field.valid &&
                <CInvalidFeedback >{field.errors[0]}</CInvalidFeedback>
            }
        </CFormGroup>
    )
}

const DateTimeInput = (props) => {
    let { field, rawProps, name, label, onBlur, onChange, required, format } = props;
    let [render, setRender] = useState(0);
    let [value, setValue] = useState(field.value ?? '');

    const checkValid = () => {
        field.checkValid();
        return field.valid;
    }

    field.onChecked = () => {
        reRender();
    }

    field.refresh = () => {
        field.errors = [];
        field.valid = true;
        setValue(field.value);
        setRender(render + 1);
    }

    const onValueChange = (e) => {
        field.value = e;
        setValue(e);
        onChange?.call();
    }

    const reRender = () => {
        setRender(render + 1);
    }

    return (
        <CFormGroup>
            <CLabel htmlFor={name}>{label} {required && <span>*</span>}</CLabel>
            <DateTimePicker
                id={name}
                name={name}
                className={`form-control ${field.valid ? '' : 'is-invalid'}`}
                onChange={onValueChange}
                onBlur={() => { checkValid(); onBlur?.call() }}
                value={value}
                {...rawProps}
            />
            {!field.valid &&
                <CInvalidFeedback >{field.errors[0]}</CInvalidFeedback>
            }
        </CFormGroup>
    )
}

export {
    PasswordInput,
    TextInput,
    TextAreaInput,
    CheckboxInput,
    SelectInput,
    ImageInput,
    NumberInput,
    DateTimeInput,
}