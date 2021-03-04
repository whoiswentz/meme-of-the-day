import {useState} from 'react'

import logo from '../../assets/logo.svg'

function App() {
  const [file, setFile] = useState()

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      console.log(Buffer(reader.result))
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
        <img className="object-none object-top object-center bg-yellow-300 w-24 h-24" src={logo} alt="logo" />

        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange}/>
          <button>Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
