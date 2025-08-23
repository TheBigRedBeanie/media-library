import '../styles/globals.css'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { AuthProvider } from '@/lib/context/AuthContext'
export const metadata = { title: "Media Library", description: "Media Library" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-base-200">
        {/* Sidebar */}
        <AuthProvider>
          <Sidebar />
      
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
        </AuthProvider>
      </body>
    </html>
  )
}