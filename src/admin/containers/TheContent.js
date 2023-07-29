import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'
import Page404 from '../views/pages/page404/Page404'
import { useSelector } from 'react-redux'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = () => {
  let authentication = useSelector(state => state.authentication)
  let roles = authentication.userInfomation?.roles ?? []
  let availableRoutes = roles.length == 0 ? [] : routes.filter(r => r.roles.length > 0 && r.roles.includes(roles[0]))
  return (
    <main className="c-main">
      <CContainer fluid className='h-100'>
        <Suspense fallback={loading}>
          <Switch>
            {availableRoutes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade className='h-100'>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            <Page404 />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
