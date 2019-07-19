const {get, post} = require('../executions')

jest.mock('../../utils/generate')

const setup = () => {
  const setupObject = {
    req: {},
    res: {
      status: jest.fn(() => setupObject.res),
      send: jest.fn()
    }
  }
  return setupObject
}

test('should allow GET method', () => {
  const {req, res} = setup()
  const fakePipeline = {
    name: 'my fake pipeline'
  }
  req.body = fakePipeline

  post(req, res)  

  const {req: getReq, res: getRes} = setup()
  getReq.query = {}
  get(getReq, getRes)

  expect(getRes.status).toHaveBeenCalledTimes(1)
  expect(getRes.status).toHaveBeenCalledWith(200)
  expect(getRes.send).toHaveBeenCalledTimes(1)
  expect(getRes.send).toHaveBeenCalledWith([expect.objectContaining(fakePipeline)])
  
  const {req: getWithFilterReq, res: getWithFilterRes} = setup()
  getWithFilterReq.query = { id: 'uuid' }
  get(getWithFilterReq, getWithFilterRes)

  expect(getWithFilterRes.status).toHaveBeenCalledTimes(1)
  expect(getWithFilterRes.status).toHaveBeenCalledWith(200)
  expect(getWithFilterRes.send).toHaveBeenCalledTimes(1)
  expect(getWithFilterRes.send).toHaveBeenCalledWith({...fakePipeline, _id: 'uuid'})
});

test('should allow POST method', () => {
  const {req, res} = setup()
  const fakePipeline = {
    name: 'my fake pipeline'
  }
  req.body = fakePipeline

  post(req, res)
  
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.send).toHaveBeenCalledTimes(1)
  expect(res.send).toHaveBeenCalledWith(expect.objectContaining(fakePipeline))
});