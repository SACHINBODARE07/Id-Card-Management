import { motion } from 'framer-motion'
import { Home, Users, Mail, Bell } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Member ID</h1>
          </div>
          {/* Navigation Links */}
          <div className="space-x-4">
            <a href="#" className="text-gray-800 hover:underline">Home</a>
            <a href="#" className="text-gray-800 hover:underline">About</a>
            <a href="#" className="text-gray-800 hover:underline">Contact</a>
          </div>
        </div>
      </nav>

      {/* Orange Banner */}
      <header className="bg-orange-500 text-white text-center py-4">
        <h1 className="text-3xl font-bold">Member Identity Card System</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-4 space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {/* Information and Photos */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Member ID</h2>
            <p className="text-gray-600 text-center mb-4">
              We provide secure and convenient identity management for all members.
            </p>
            <div className="flex space-x-4 mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-lg w-24 h-24" />
              <div className="bg-gray-200 border-2 border-dashed rounded-lg w-24 h-24" />
              <div className="bg-gray-200 border-2 border-dashed rounded-lg w-24 h-24" />
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-800 hover:underline">
                <Home className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-800 hover:underline">
                <Users className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-800 hover:underline">
                <Mail className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-800 hover:underline">
                <Bell className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Yellow Rectangle with Logo and Stamp */}
          <motion.div
            className="bg-yellow-200 p-8 rounded-lg flex flex-col items-center justify-center"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mb-4" />
            <div className="bg-red-500 text-white text-center p-2 rounded-lg w-32">
              <p className="font-bold">Member ID Card</p>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col items-center justify-center"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-2"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={() => window.location.href = '/admin/login'}
            >
              Admin Login
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-800 text-center py-4">
        <p className="text-sm">Copyright © 2025</p>
        <div className="mt-2">
          <a href="#" className="text-sm text-gray-800 hover:underline mr-4">
            Terms of Use
          </a>
          <a href="#" className="text-sm text-gray-800 hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  )
}

// Simple CSS for the component
const styles = `
  .min-h-screen {
    min-height: 100vh;
  }
  .flex {
    display: flex;
  }
  .flex-col {
    flex-direction: column;
  }
  .bg-white {
    background-color: white;
  }
  .bg-orange-500 {
    background-color: #FFA500;
  }
  .text-white {
    color: white;
  }
  .text-center {
    text-align: center;
  }
  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .font-bold {
    font-weight: 700;
  }
  .space-x-8 {
    margin-left: 2rem;
  }
  .bg-yellow-200 {
    background-color: #FFFFE0;
  }
  .p-8 {
    padding: 2rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .flex-col {
    flex-direction: column;
  }
  .items-center {
    align-items: center;
  }
  .justify-center {
    justify-content: center;
  }
  .bg-gray-200 {
    background-color: #E5E7EB;
  }
  .border-2 {
    border-width: 2px;
  }
  .border-dashed {
    border-style: dashed;
  }
  .rounded-full {
    border-radius: 9999px;
  }
  .w-24 {
    width: 6rem;
  }
  .h-24 {
    height: 6rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .bg-red-500 {
    background-color: #EF4444;
  }
  .text-black {
    color: black;
  }
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .font-medium {
    font-weight: 500;
  }
  .w-full {
    width: 100%;
  }
  .p-4 {
    padding: 1rem;
  }
  .border {
    border-width: 1px;
  }
  .border-gray-300 {
    border-color: #D1D5DB;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .focus\:outline-none:focus {
    outline: none;
  }
  .focus\:ring-2:focus {
    box-shadow: 0 0 0 2px;
  }
  .focus\:ring-blue-500:focus {
    box-shadow: 0 0 0 2px #3B82F6;
  }
  .hover\:bg-blue-600:hover {
    background-color: #2563EB;
  }
  .hover\:bg-red-600:hover {
    background-color: #DC2626;
  }
  .bg-gray-100 {
    background-color: #F3F4F6;
  }
  .text-gray-800 {
    color: #1F2937;
  }
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  .mr-4 {
    margin-right: 1rem;
  }
  .hover\:underline:hover {
    text-decoration: underline;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .w-10 {
    width: 2.5rem;
  }
  .h-10 {
    height: 2.5rem;
  }
  .text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  .w-6 {
    width: 1.5rem;
  }
  .h-6 {
    height: 1.5rem;
  }
`

// Inject the CSS into the document
const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)