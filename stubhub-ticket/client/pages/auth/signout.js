// ----------------------- Packages -----------------------

import { useEffect } from 'react'
import Router from 'next/router'

// ----------------------- Local -----------------------

import { useRequest } from '../../hooks'

// ------------------------------------------------------

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })

  useEffect(() => {
    doRequest()
  }, [])

  return <div>signing you out ...</div>
}

// ------------------------------------------------------

export default Signout
