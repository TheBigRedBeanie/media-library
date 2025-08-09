import '../styles/globals.css'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { AuthProvider } from '@/lib/context/AuthContext'


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-base-200">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-6 overflow-y-auto">
            <AuthProvider>{children}</AuthProvider>
          </main>
        </div>
      </body>
    </html>
  )
}