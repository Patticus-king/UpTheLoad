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
          <h2>A Loading Scheme Generator for Everybody.</h2>

          <Box title="How to use:">
            <p>
              Simply Input your Trailer and load specifications into the text fields, 
              and let us do the rest!
            </p> 
          </Box>

          <Box title="Pricing:">
            <ul>
              <li>$10.99 a month</li>
              <li>Up to 5 Users</li>
              <li>No Limit of Schemes Generated Per User</li>
            </ul>
          </Box>
        </section>

        <aside className="image">
          <img src="loadTruck.jpg" alt="Trailer loading schemes" />
          <Button label="Go to Page" />
        </aside>
      </main>
    </div>
  );
}

export default App;
