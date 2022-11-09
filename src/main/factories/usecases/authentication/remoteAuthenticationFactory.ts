import { makeAxiosHttpClient } from '@/main/factories/http/axiosHttpClientFactory'
import { RemoteAuthentication } from '@/data/usecases/authentication/remoteAuthentication'
import { makeApiUrl } from '@/main/factories/http/apiUrlFactory'

export const makeRemoteAuthentication = (): RemoteAuthentication => {
  return new RemoteAuthentication(makeApiUrl(), makeAxiosHttpClient())
}
