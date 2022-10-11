<br>
<div align="center">
  <img src="/asset/header.png?raw=true" alt="eth-provider" height="400"/>
</div>
<br>
<br>
<h3 align="center">A Universal Ethereum Provider Client</h3>
<p align="center">Seamlessly connect to  <b>HTTP</b>, <b>WebSocket</b>, <b>IPC</b> and <b>Injected</b> RPC transports in <b>Node</b> and the <b>Browser</b>!</p>
<br>
<br>

### Goals
* Follows [EIP 1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md) Spec
* Support all transport types (websocket, http, ipc & injected)
* Attempt connection to an array of RPC endpoints until successful connection
* Reconnect when connection is lost
* Emit helpful status updates so apps can handle changes gracefully

### Install
```
npm install eth-provider --save
```

### Use

```js
const provider = require('eth-provider')
const web3 = new Web3(provider())
```
* By default, eth-provider will first try to discover providers injected by the environment, usually by a browser or extension
* If eth-provider fails to find an injected provider it will attempt to connect to local providers running on the user's device like [Frame](https://github.com/floating/frame), Geth or Parity
* You can override these defaults by passing in your own RPC targets
```js
const provider = require('eth-provider')
const web3 = new Web3(provider('wss://sepolia.infura.io/ws/v3/${INFURA_ID}))
```
* When passing in multiple RPC targets order them by priority
* When eth-provider fails to connect to a target it will automatically attempt to connect to the next priority target
* For example `['injected', 'wss://sepolia.infura.io/ws/v3/${INFURA_ID}']` will first try to discover injected providers and if unsuccessful connect to the Infura endpoint
```js
const provider = require('eth-provider')
const web3 = new Web3(provider(['injected', 'wss://sepolia.infura.io/ws/v3/${INFURA_ID}']))
```
* In Node and Electron you'll have access to IPC endpoints created by Geth or Parity that cannot be accessed by the Browser. You can connect to these by using the `'direct'` preset, or by passing custom IPC paths
```js
const provider = require('eth-provider')
const web3 = new Web3(provider('direct'))
```

### Presets
* **`injected`** - Discover providers injected by environment, usually by the browser or a browser extension
  * Browser
    * `['injected']`
* **`frame`** - Connect to [Frame](https://github.com/floating/frame) running on the user's device
  * Browser/Node/Electron
    * `['ws://127.0.0.1:1248', 'http://127.0.0.1:1248']`
* **`direct`** - Connect to local Ethereum nodes running on the user's device
  * Browser
    * `['ws://127.0.0.1:8546', 'http://127.0.0.1:8545']`
  * Node/Electron
    * `[/* Default IPC paths for platform */, 'ws://127.0.0.1:8546', 'http://127.0.0.1:8545']`
* **`infura`** - Connect to Mainnet Infura
  * Browser/Node/Electron
    * `['wss://mainnet.infura.io/ws/v3/${infuraId}', 'https://mainnet.infura.io/v3/${infuraId}']`
* **`alchemy`** - Connect to Mainnet Alchemy
  * Browser/Node/Electron
    * `['wss://eth-mainnet.ws.alchemyapi.io/v2/${alchemyId}', 'https://eth-mainnet.alchemyapi.io/v2/${alchemyId}']`

View all possible presets [here](https://github.com/floating/eth-provider/blob/master/presets/index.js)

If you do not pass any targets, eth-provider will use default targets `['injected', 'frame']` in the Browser and `['frame', 'direct']` in Node and Electron.

### Options

When creating the provider you can also pass an options object

* `infuraId` - Your projects Infura ID
* `alchemyId` - Your projects Alchemy ID
* `origin` - Used when connecting from outside of a browser env to declare the identity of your connection to interfaces like Frame (this currently doesn't work with HTTP connections)

`provider('infura', { infuraId: '123abc' })` or `provider({ origin: 'DappName', infuraId: '123abc' })`

The origin setting will only be applied when a dapp is connecting to from outside of a browser env. 
