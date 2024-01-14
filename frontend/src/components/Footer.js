import { Link, useNavigate } from "react-router-dom";

const Footer = ({ windowDimension }) => {
  const navigate = useNavigate();

  return (
    <div className="footer">
      <div
        className={
          windowDimension.winWidth > 1050
            ? "footer-grid footer-desktop"
            : "footer-grid footer-mobile"
        }
      >
        <div className="footer-content">
          <h2>Features</h2> <br />
          <div
            className="sentence_spacing cursor-enabled"
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
          >
            Learn More <br />
          </div>
          {/* <div className="sentence_spacing">
            Plans <br />
          </div> */}
        </div>
        <div className="footer-content">
          <h2>Support</h2> <br />
          {/* <div className="sentence_spacing">
            Help center <br />
          </div> */}
          <div
            className="sentence_spacing cursor-enabled"
            onClick={() => {
              navigate("/credits");
              window.scrollTo(0, 0);
            }}
          >
            References <br />
          </div>
          <div
            className="sentence_spacing cursor-enabled"
            onClick={() => {
              navigate("/terms");
              window.scrollTo(0, 0);
            }}
          >
            Terms <br />
          </div>
        </div>
        <div className="footer-content">
          <h2>Learning</h2> <br />
          <Link
            className="sentence_spacing footer-link cursor-enabled"
            target="_blank"
            to={
              "https://idp.sfsu.edu/idp/profile/SAML2/Redirect/SSO?execution=e1s1"
            }
          >
            Gateway
          </Link>
          <br />
          <Link
            className="sentence_spacing footer-link cursor-enabled"
            target="_blank"
            to={"https://canvas.sfsu.edu/canvas.html"}
          >
            Canvas
          </Link>
          <br />
          <Link
            className="sentence_spacing footer-link cursor-enabled"
            target="_blank"
            to={
              "https://ilearn.sfsu.edu/local/hub/index.php?wantsurl=https%3A%2F%2Filearn.sfsu.edu%2F"
            }
          >
            iLearn
          </Link>
          <br />
        </div>
        <div className="footer-content">
          <h2>Contacts</h2> <br />
          <div
            className="sentence_spacing footer-link cursor-enabled"
            onClick={() => {
              navigate("/about-us");
              window.scrollTo(0, 0);
            }}
          >
            About Us
          </div>{" "}
          <br />
        </div>
      </div>
    </div>
  );
};

export default Footer;
