// -------------------------------- Packages ------------------------------

import axios from 'axios'

// -------------------------------- Local ------------------------------

// ------------------------------------------------------------------------

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller-admission.kube-system.svc.cluster.local',
      headers: req.headers
    })
  } else {
    //
    return axios.create({ baseURL: '/' })
  }
}
