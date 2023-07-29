import CIcon from '@coreui/icons-react';
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CDataTable,
    CForm,
    CFormGroup,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CInvalidFeedback,
    CLabel,
    CRow,
    CValidFeedback
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { courseService, categoryService, userService, studentService } from "../services";
import { ArrayHelpers, history, string_to_slug, useForm, useFormField } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as allIcon from "@fortawesome/free-solid-svg-icons";
import { CheckboxInput, SelectInput, TextInput } from '../shared';
import { alertActions, modalActions } from '../../actions';
import { Link } from "react-router-dom";
import { useRef } from 'react';
import { Fragment } from 'react';

const Step = {
    CHOSE_FILE: 1,
    REVIEW_DATA: 2,
    IMPORT_DATA: 3
}

const ImportLearner = (props) => {
    let inputFile = useRef();
    let [courses, setCourses] = useState([]);
    let [users, setUsers] = useState([])
    let [delimeter, setDelimeter] = useState(',')

    const getCourses = () => {
        courseService.getList()
            .then((res) => {
                if (res.isSuccess) {
                    setCourses(res.data);
                }
            });
    };

    useEffect(() => {
        getCourses()
    }, [])

    const onLoadFileClick = () => {
        var files = inputFile.current.files
        if (files.length > 0) {
            let file = files[0]
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                let dataString = event.target.result
                const dataStringLines = dataString.split(/\r\n|\n/);
                const headers = delimeter == ',' ? dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/) : dataStringLines[0].split(/;(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
                const list = [];
                for (let i = 1; i < dataStringLines.length; i++) {
                    const row = delimeter == ',' ? dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/) : dataStringLines[i].split(/;(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
                    if (headers && row.length == headers.length) {
                        const obj = {};
                        obj.courses = [];
                        for (let j = 0; j < headers.length; j++) {
                            let colName = headers[j]
                            let d = row[j];
                            if (d.length > 0) {
                                if (d[0] == '"')
                                    d = d.substring(1, d.length - 1);
                                if (d[d.length - 1] == '"')
                                    d = d.substring(d.length - 2, 1);
                            }
                            if (colName) {
                                if (colName.startsWith("cohort")) {
                                    if (d) {
                                        obj.courses.push({ code: d })
                                    }
                                } else {
                                    obj[colName] = d;
                                }
                            }
                        }

                        obj.courses = obj.courses.filter((value, index, self) => self.findIndex(r => r.code == value.code) === index)
                        // remove the blank rows
                        if (Object.values(obj).filter(x => x).length > 0) {
                            list.push(obj);
                        }
                    }
                }

                prepareData(list)
            });
            reader.readAsText(file);
        }
    }

    const prepareData = (importData) => {
        let userNames = importData.map(r => r.username).filter((value, index, self) => { return self.indexOf(value) === index; });
        let userChunks = ArrayHelpers.arrayToChunks(userNames, 1000);

        let prepareForChunk;

        prepareForChunk = (i) => {
            if (i == userChunks.length) {
                setUsers(importData)
                return;
            }

            let chunks = userChunks[i];
            userService.findByUserNamesPOST(chunks)
                .then((res) => {
                    if (res.isSuccess) {
                        let users = res.data
                        importData.forEach(item => {
                            let uIndex = users.findIndex(r => r.userName.toUpperCase() == item.username.toUpperCase())
                            if (uIndex != -1)
                                item.userId = users[uIndex].id
                        });
                        prepareForChunk(i + 1);
                    }
                });
        }

        prepareForChunk(0);
    }

    const importClick = () => {
        if (users.length == 0) return;
        let index = 0
        importNextUser(index)
    }

    const importNextUser = (index, onComplete) => {
        if (index == users.length) {
            onComplete?.call()
            return
        }

        let user = users[index]
        importUser(user, () => { importNextUser(index + 1, onComplete) })
    }

    const importUser = async (user, onFinish) => {
        if (!user.userId) {
            let userModel = {
                id: 0,
                displayName: user.firstname + ' ' + user.lastname,
                userName: user.username,
                email: user.email,
                emailConfirmed: true,
                avatar: '',
                active: true,
                password: user.password
            };

            var userResult = await userService.create(userModel);
            if (!userResult.isSuccess) {
                user.message = userResult.message
                user.success = false
                onFinish()
                return
            }

            let userInfo = userResult.data

            users.filter(r => r.username == user.username).forEach(element => {
                element.userId = userInfo.id
                element.message = 'success create'
            });

            // user.userId = userInfo.id
            // user.message = 'success create'
        }

        user.success = true
        for (let i = 0; i < user.courses.length; i++) {
            const course = user.courses[i];
            let courseItem = courses.find(r => r.code == course.code)
            if (courseItem != null) {
                let registerResult = await studentService.create(courseItem.id, user.userId)
                if (!registerResult.isSuccess) {
                    course.message = registerResult.message
                    course.success = false
                    continue
                } else {
                    course.success = true
                }
            } else {
                course.success = false
                course.message = 'course not found'
            }
        }
        setUsers([...users])
        onFinish()
    }

    const resetClick = () => {
        inputFile.current.value = ''
        setUsers([])
    }

    const delimeterClicked = (e) => {
        setDelimeter(e.target.value)
    }

    return (
        <CRow>
            <CCol xs='12' lg='12'>
                <CCard>
                    <CCardHeader>
                        <span className='h5'>Chọn file import</span>
                        <div className="float-right">
                            <CButton type='link' onClick={resetClick} color='danger'>Reset</CButton>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <input type='file' id='file' ref={inputFile}
                            accept=".csv"
                            style={{}} />

                        <label className='ml-3 h5'>Dấu ngăn cách</label>
                        <input type='radio'
                            name='delimeter'
                            value=','
                            checked={delimeter == ','}
                            onChange={() => { }}
                            onClick={delimeterClicked}
                            className='ml-2' />
                        <label className='ml-2 h2'>,</label>
                        <input type='radio'
                            name='delimeter'
                            value=';'
                            checked={delimeter == ';'}
                            onChange={() => { }}
                            onClick={delimeterClicked}
                            className='ml-3' />
                        <label className='ml-2 h2 mr-5'>;</label>
                        <CButton type='button'
                            color='primary'
                            onClick={onLoadFileClick} >Tải nội dung file</CButton>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol>
                {users.length > 0 &&
                    <CCard>
                        <CCardHeader>
                            <span className='h5'>Kiểm tra dữ liệu</span>
                        </CCardHeader>
                        <CCardBody>
                            <table className="table table-light table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>username</th>
                                        <th>userId</th>
                                        <th>displayname</th>
                                        <th>email</th>
                                        <th>password</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((item, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <tr className="font-weight-bold">
                                                    <td>{index}</td>
                                                    <td>{item.username}</td>
                                                    <td>{item.userId ?? '0'}</td>
                                                    <td>{item.firstname + ' ' + item.lastname}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.password}</td>
                                                    <td>{item.success == false && <span className='text-danger'>{item.message}</span>} {item.success == true && <span className='text-success'>success</span>}</td>
                                                </tr>
                                                {item.courses.map(course => (
                                                    <tr key={index + course.code} className={courses.find(r => r.code == course.code) ? '' : 'text-danger'}>
                                                        <td></td>
                                                        <td>{course.code}</td>
                                                        <td colSpan='4'>{courses.find(r => r.code == course.code)?.name ?? 'Mã khóa học không tồn tại'}</td>
                                                        <td>{course.success == false && <span className='text-danger'>{item.message}</span>} {course.success == true && <span className='text-success'>success</span>}</td>
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        )
                                    })

                                    }
                                </tbody>
                            </table>
                        </CCardBody>

                        <CCardFooter>
                            <CButton type='button'
                                color='primary'
                                onClick={importClick} >Nhập dữ liệu</CButton>
                        </CCardFooter>
                    </CCard>
                }
            </CCol>
        </CRow>
    )
}

export { ImportLearner }