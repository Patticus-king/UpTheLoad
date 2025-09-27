import "./Homepage.css";
import Header from "./Header";
import Button from "./Button";
import Box from "./Box";

function App() {
  return (
    
    <div className="app-container">
     <Header title="Welcome To UpTheLoad!" />
      <main className="content">
        <div className="sidebar"></div>
        <section className="info">
          <h4>The Loading Scheme Generator for Everybody.</h4>

          <Box title="How to use:">

            <h2>
              Simply Input your Trailer and load specifications into the text fields, 
              and let us do the rest!
            </h2> 
          </Box>

          <Box title="Pricing:">
            <h2>
              <li>$10.99 a month</li>
              <li>Up to 5 Users</li>
              <li>No Limit of Schemes</li> 
                Generated Per User
            </h2>
          </Box>
        </section>

        <aside className="image">
          <img src="loadTruck.jpg" alt="Trailer loading schemes" />
          <Button label="Go to Page" to="/input" />
        </aside>
      </main>
    </div>
  );
}

export default App;
