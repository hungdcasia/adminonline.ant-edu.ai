import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { userService } from "../../../../services/";
import { userConstants } from '../../../../constants';
import { alertActions } from '../../../../actions';
import { useDispatch } from 'react-redux';

const Login = () => {
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const onSubmit = props => {
    if (email && password) {
      userService.login(email, password)
        .then(res => {
          if (res.isSuccess) {
            let data = res.data;
            localStorage.setItem('userToken', JSON.stringify(data));
            dispatch({ type: userConstants.LOGIN_SUCCESS, userToken: data });

            userService.getInfomarion()
              .then(userInfo => {
                if (userInfo.isSuccess) {
                  dispatch({ type: userConstants.INFOMATION_SUCCESS, user: userInfo.data });
                } else {
                  alertActions.error(userInfo.Errors[0].message);
                }
              }
              ).catch(error => {
                alertActions.error('Lấy thông tin người dùng lỗi.')
              });
          }
        })
    }
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text"
                        placeholder="Username"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={onSubmit}>Login</CButton>
                      </CCol>
                      {/* <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
