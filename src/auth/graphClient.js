import { Client } from '@microsoft/microsoft-graph-client'

export function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  })
}
