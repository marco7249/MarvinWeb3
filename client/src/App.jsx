import { Footer,Navbar,Services,Transactions,Welcome  } from "./components"

const App = () => {
  
  return (
    <div className="mid-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer/>
    </div>
  )
}

export default App;
