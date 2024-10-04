import Nav from './Nav'

const Shell = ({ children }) => {
  return (
    <div className="flex w-screen h-screen">
      <div className="w-[calc(100vw-200px)] ">
        <Nav />
        <main className="h-[calc(100vh-65px)]">{children}</main>
      </div>
    </div>
  )
}

export default Shell
