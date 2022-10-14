import { HttpPostClient, HttpPostParams } from 'data/protocols/http/httpPostClient'

class HttpPostClientSpy implements HttpPostClient {
  url?: string

  async post (params: HttpPostParams): Promise<void> {
    this.url = params.url
    return Promise.resolve()
  }
}

export {
  HttpPostClientSpy
}
