import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
} from '@coreui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import moment from 'moment';

const availbleOperators = {
    'string': ['Contains', 'StartsWith', 'EndsWith'],
    'number': ['==', '!=', '>=', '>', '<=', '<'],
    'date': ['>=', '>', '<=', '<'],
    'bool': ['==', '!='],

    getDefault: (type) => availbleOperators[type][0]
}

const defaultInputs = {
    'string': (value, onValueChange) => (
        <input
            type="search"
            className={`form-control mr-2`}
            name='string-filter'
            value={value}
            autoComplete='off'
            onChange={(e) => onValueChange(e.target.value)}
        />
    ),
    'number': (value, onValueChange) => (
        <input
            type="number"
            className={`form-control mr-2`}
            name=''
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
        />
    ),
    'date': (value, onValueChange) => {

        let input = value ? moment(value, 'yyyy-MM-DD HH:mm:ss').toDate() : null
        const onChange = (v) => {
            let output = v == null ? null : moment(v).format('yyyy-MM-DD HH:mm:ss');
            onValueChange(output);
        };

        return (
            <DateTimePicker
                className='mx-2 form-control'
                onChange={onChange}
                value={input}
                format='y-MM-dd HH:mm:ss'
            />
        )
    },
    'bool': (value, onValueChange) => (
        <select className="custom-select mr-2" value={value} onChange={(e) => onValueChange(e.target.value)}>
            <option value=''>All</option>
            <option value='true'>Yes</option>
            <option value='false'>No</option>
        </select>
    ),
}

const FilterComponent = ({ onFilter, filterConfigs }) => {

    let [filterItems, setFilterItems] = useState([{ field: filterConfigs[0].dataField, value: '', operator: availbleOperators.getDefault(filterConfigs[0].type) }])

    const onFilterClick = () => {
        onFilter(filterItems.filter(r => r.value != '' && r.value != null))
    }

    const onFilterItemChange = (item, index) => {
        filterItems[index] = item
        setFilterItems([...filterItems])
    }

    const addFilterItem = () => {
        let filterItem = { field: filterConfigs[0].dataField, value: '', operator: availbleOperators.getDefault(filterConfigs[0].type) }
        filterItems.push(filterItem);
        setFilterItems([...filterItems])
    }

    const removeFilterItem = (index) => {
        setFilterItems(filterItems.filter((item, i) => index != i))
    }

    return (
        <CCard>
            <CCardHeader>
                <span className='h4'><i className="fas fa-filter text-dark" /> Bộ lọc</span>
            </CCardHeader>
            <CCardBody className=''>
                <form action='#' autoComplete='off' className='filter-form' onSubmit={(e) => e.preventDefault()}>
                    {filterItems.map((item, index) => (
                        <CRow className='mt-2' key={index}>
                            <FilterItem filterConfigs={filterConfigs} filterItem={item} onChange={(item) => onFilterItemChange(item, index)} />
                            {filterItems.length > 1 &&
                                <div className='btn btn-light text-danger mr-2' onClick={() => removeFilterItem(index)}><FontAwesomeIcon icon={allIcon.faMinusCircle} /></div>
                            }

                            {index == filterItems.length - 1 &&
                                <div className='btn btn-light text-success' onClick={addFilterItem}><FontAwesomeIcon icon={allIcon.faPlusCircle} /></div>
                            }
                        </CRow>
                    ))}
                </form>
                <CRow className='mt-3'>
                    <div className='col-12 pl-0'>
                        <CButton className={'mr-2'}
                            color="info"
                            onClick={onFilterClick}
                            size={''}>
                            <FontAwesomeIcon icon={allIcon.faFilter} /> Lọc </CButton>
                    </div>
                </CRow>
            </CCardBody>
        </CCard>
    )
}

const FilterItem = ({ filterConfigs, filterItem, onChange }) => {

    let filterConfig = filterConfigs.find(r => r.dataField == filterItem.field)
    const operators = filterConfig.operators && filterConfig.operators.length > 0 ? filterConfig.operators : availbleOperators[filterConfig.type]

    const onFieldChange = (e) => {
        let filterConfig = filterConfigs.find(r => r.dataField == filterItem.field)
        filterItem.field = e.target.value
        filterItem.operator = filterConfig.operators && filterConfig.operators.length > 0 ? filterConfig.operators : availbleOperators.getDefault(filterConfigs.find(r => r.dataField == filterItem.field).type)
        filterItem.value = ''
        onChange(filterItem)
    }

    const onValueChange = (value) => {
        filterItem.value = value
        onChange(filterItem)
    }

    const onOperatorChange = (e) => {
        filterItem.operator = e.target.value
        onChange(filterItem)
    }

    return (
        <div className='form-inline'>
            <select className="custom-select mr-2" value={filterItem.field} onChange={onFieldChange}>
                {filterConfigs.map(item => (
                    <option value={item.dataField} key={item.dataField}>{item.text}</option>
                ))}
            </select>

            {operators.length > 1 &&
                <select className="custom-select mr-2" value={filterItem.operator} onChange={onOperatorChange}>
                    {operators.map(item => (
                        <option value={item} key={item}>{item}</option>
                    ))}
                </select>
            }
            {filterConfig.customInput ? filterConfig.customInput(filterItem.value, onValueChange) : defaultInputs[filterConfig.type](filterItem.value, onValueChange)}
        </div>
    )
}

export { FilterComponent }