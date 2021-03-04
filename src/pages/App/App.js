import { useState, useEffect } from 'react'
import ipfsClient from 'ipfs-http-client'

import logo from '../../assets/logo.svg'

const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https'
})

const App = () => {
  const [buffer, setBuffer] = useState()
  const [image, setImage] = useState('')

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
      
      console.log("IPFS Result", result)
      setImage(result.path)
      console.log("Image URL", image)
    } catch (error) {
      console.log('IPFS Error', error)
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
        <img className="object-none object-top object-center bg-yellow-300 w-24 h-24 mt-6" src={image || logo} alt="logo" />

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
