// ----------------------- Packages -----------------------

// ----------------------- Local -----------------------

import 'bootstrap/dist/css/bootstrap.css'
import { buildClient } from '../api'
import { Header } from '../components'

// ------------------------------------------------------

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

// AppTree Component rotuer ctx:{...rest, req,res}
AppComponent.getInitialProps = async (appContext) => {
  const { data } = await buildClient(appContext.ctx).get(
    '/api/users/currentuser'
  )

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    // this call on each page if we want with ctx
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  // ...data == currentUser: data.currentUser
  return { pageProps, ...data }
}

export default App
