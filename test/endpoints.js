/* globals it describe */

const assert = require('assert')
const provider = require('../')

describe('Endpoint Test', () => {
  it('Endpoint: https://cloudflare-eth.com', async () => {
    const pro = provider(['https://cloudflare-eth.com'])
    assert(await pro.send('net_version') === '1')
  })
  it('Endpoint: https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b', async () => {
    const pro = provider(['https://mainnet.infura.io/v3/786ade30f36244469480aa5c2bf0743b'])
    assert(await pro.send('net_version') === '1')
  })
})
