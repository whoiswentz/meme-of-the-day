import { useState, useEffect } from 'react'
import ipfsClient from 'ipfs-http-client'
import Web3 from 'web3'

import Meme from '../../abis/Meme.json'

const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https'
})

const App = () => {
  const [buffer, setBuffer] = useState()
  const [image, setImage] = useState('')
  const [account, setAccount] = useState('')
  const [memeContract, setMemeContract] = useState()

  useEffect(() => {
    loadweb3()
    loadBlockchainData()
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      setBuffer(Buffer(reader.result))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const result = await ipfs.add(buffer)
      const r = await memeContract.methods.set(result.path).send({
        from: account
      })

      console.log(r)
      setImage(result.path)
    } catch (error) {
      console.log('IPFS Error', error)
    }
  }

  const loadBlockchainData = async () => {
    const accounts = await window.web3.eth.getAccounts()
    setAccount(accounts[0])
    console.log(accounts)
    const networkId = await window.web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if (networkData) {
      const abi = Meme.abi
      const address = networkData.address
      const contract = new window.web3.eth.Contract(abi, address)
      setMemeContract(contract)
      const memeHash = await contract.methods.get().call()
      setImage(memeHash)
    } else {
      window.alert('Smart contracts not deployed')
    }
  }

  const loadweb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Use metamask')
    }
  }

  return (
    <>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto">
        <h2>{account}</h2>
        <img className="object-none object-top object-center bg-yellow-300 mt-6" src={`https://ipfs.infura.io/ipfs/${image}`} alt="logo" />

        <h1 className="mt-6 text-2xl font-bold text-gray-900 text-center">Interplanetary File System</h1>

        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button>Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
