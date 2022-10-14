import { HttpPostClient } from 'data/protocols/http/httpPostClient'

class HttpPostClientSpy implements HttpPostClient {
  url?: string

  async post (url: string): Promise<void> {
    this.url = url
    return Promise.resolve()
  }
}

export {
  HttpPostClientSpy
}
