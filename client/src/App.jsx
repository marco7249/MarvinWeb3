import { Footer, Navbar, Services, Transactions, Welcome } from "./components"
import NFTs from "./components/NFTs";

const App = () => {

  return (
    <div className="mid-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <div className="gradient-bg-transactions">
        <Transactions />
        <NFTs />
      </div>
      <Footer />
    </div>
  )
}

export default App;
