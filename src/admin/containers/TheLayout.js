import React from 'react'
import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheContent from './TheContent'
import TheFooter from './TheFooter'

const TheLayout = () => {

  return (
    <div className="c-app c-default-layout admin-page">
      <TheSidebar />
      <div className="c-wrapper">
        <div className="c-body">
          <TheHeader />
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  )
}

export default TheLayout
