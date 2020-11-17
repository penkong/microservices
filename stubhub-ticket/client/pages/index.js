// ----------------------- Packages -----------------------

// ----------------------- Local -----------------------

import { buildClient } from '../api'

// ------------------------------------------------------

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>you are signed in</h1> : <h1>not signed</h1>
}

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/currentuser')
  return data
}

export default LandingPage
