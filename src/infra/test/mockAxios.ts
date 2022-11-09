import axios from 'axios'
import faker from 'faker'

export const mockHttpRespose = (): object => ({
  data: faker.random.objectElement(),
  status: faker.random.number()
})

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.post.mockResolvedValue(mockHttpRespose())

  return mockedAxios
}
