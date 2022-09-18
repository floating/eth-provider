import type EthereumProvider from 'ethereum-provider'

type ProviderOpts = {
  name: string
  origin: string
  infuraId: string
  alchemyId: string
  interval: number
}

export default function (targets?: string | string[], opts?: Partial<ProviderOpts>): EthereumProvider
