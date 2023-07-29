import { useState, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator';
const validator = new SimpleReactValidator();
export function newFormField(defaultValue, errors = [], rules = [], customRule = null) {
    let field = {
        value: defaultValue,
        valid: errors == null || errors.length == 0,
        errors: errors,
        rules: rules,
        customRule: customRule
    }

    field.checkValid = () => {
        var { rules, customRule } = field;
        var errors = [];
        if (rules) {
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (!validator.check(field.value, rule.rule)) {
                    errors.push(rule.message);
                }
            }
        }

        if (customRule) {
            errors = errors.concat(customRule());
        }

        field.errors = errors;
        field.valid = errors.length == 0;
        field.onChecked?.call();
        return field.valid;
    }

    return field;
}


export function useFormField(options) {
    let { value, errors, rules, customRule } = options;
    const [field] = useState(newFormField(value, errors ?? [], rules ?? [], customRule));


    return [field];
}

export function useForm(formFields) {
    let form = {
        fields: formFields
    }
    form.valid = () => {
        formFields.forEach(element => {
            element.checkValid();
        });
        return formFields.every(item => item.valid);
    }

    return [form];
}


export function newValidationDescription(validations, message) {
    return {
        validations, message
    };
}