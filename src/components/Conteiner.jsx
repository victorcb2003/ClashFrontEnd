import Sidebar from "./Sidebar"

export default function Conteiner({children}) {
  return (
    <div className="relative w-full min-h-screen">
        <Sidebar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/Pelouse.png"
          alt="background"
          className="fixed w-full h-full object-cover brightness-70"
        />
      </div>
      <div className="relative z-10 ml-16 p-6 space-y-6">
        {children}
      </div>
    </div>
  )
}
