import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    // So base url will be format http://SERVICENAME.NAMESPACE.svc.cluster.local
    // Get service name using kubectl get services -n ingress-nginx
    //  http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/...

    // axios.create creates preconfigured version of axios
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    })
  } else {
    // We are on the browser
    // So base url will be ''
    return axios.create({
      baseURL: '/',
    })
  }
}

export default buildClient
