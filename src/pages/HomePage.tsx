import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="main-panel homepage-panel">
        <h1 style={{ textAlign: "left" }}>Welcome to Tooner.io</h1>
        <p className="homepage-text">
          Tooner.io aims to provide musicians with the tools they need to
          improve the quality of their practice sessions. It uses your browser's
          local storage to save and configure custom tunings, youtube tutorials
          and sheet music tabs across sessions without collecting any of your
          data or serving ads. To get started, select one of the items from the
          navigation bar above. If you have any issues or feature requests,
          please reach out to me at rjtunney@uwaterloo.ca. The website is also
          open source and can be found{" "}
          <a href="https://github.com/R0NAND/tooner.io">here</a> for anyone
          willing to contribute.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
