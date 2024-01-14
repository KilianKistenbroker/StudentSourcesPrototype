import Footer from "../components/Footer";

const AboutUs = ({ windowDimension }) => {
  return (
    <div className="page">
      <div
        className="legal"
        // style={{ margin: "auto", marginTop: "200px", marginBottom: "100px" }}
      >
        <h1 className="legal-h1">About Us</h1> <br />
        <p className="legal-body">- Team info removed for privacy -</p> <br />
        <h1 className="legal-h1">Helpful Information</h1> <br />
        <p className="legal-body">
          1. You do not need to enter any real information to register. <br />
          2. All uploaded data is automatically deleted at the end of the day.
        </p>
      </div>

      <Footer windowDimension={windowDimension} />
    </div>
  );
};

export default AboutUs;
