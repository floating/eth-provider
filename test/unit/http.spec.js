const fetch = require('node-fetch')
const http = require('../../connections/http')

let connection

jest.mock('node-fetch', () => jest.fn());

beforeEach(() => {
   fetch.mockResolvedValue({ json: () => Promise.resolve({ result: 'success' })})
   connection = http(fetch)('http://frame.sh')
})

describe('#send', () => {
    it('should emit the expected result', (done) => {
      connection.on('payload', (payload) => {
        expect(payload).toStrictEqual({ id: 'test-id', jsonrpc: 'test-jsonrpc', result: 'success' })
        done()
      })
      connection.send({ id: 'test-id', jsonrpc: 'test-jsonrpc', method: 'eth_chainId' })
    }, 45_000)

    it('should not emit when provided with an internal callback', (done) => {
        const payloadMock = jest.fn()
        connection.on('payload', payloadMock)
        connection.send({ id: 'test-id', jsonrpc: 'test-jsonrpc', method: 'eth_chainId' }, (err, result) => {
            expect(err).not.toBeDefined()
            expect(result).toBe('success')
            expect(payloadMock).not.toHaveBeenCalled()
            done()
        })
    }, 45_000)
})
