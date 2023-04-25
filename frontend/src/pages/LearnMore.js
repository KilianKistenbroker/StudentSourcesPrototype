import Footer from "../components/Footer";
import Banner1 from "../logos/Banner.jpg";
import Organize from "../logos/Organize.jpg";
import Collaborate from "../logos/Collaborate.jpg";
import Streamline from "../logos/Streamline.jpg";
import { useNavigate } from "react-router-dom";

const LearnMore = ({ windowDimension }) => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="learn-more-container">
        {/* content 1 */}
        <div className="learn-more-grid-item" style={{ paddingTop: "50px" }}>
          <div className="learn-more-img-container">
            <img src={Banner1} alt="" className="learn-more-img" />
          </div>

          <div className="learn-more-description">
            <div className="learn-more-title">Welcome to Student Sources</div>
            <div className="learn-more-body">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum
              corrupti deserunt eius quam corporis? Atque vel voluptatem
              tenetur, commodi nostrum eligendi debitis minus fugiat sequi culpa
              quas incidunt sint porro!
            </div>
          </div>
        </div>

        {/* content 2 */}
        <div className="learn-more-grid-item">
          <div className="learn-more-description">
            <div className="learn-more-title" style={{ textAlign: "right" }}>
              Organize
            </div>
            <div className="learn-more-body">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum
              corrupti deserunt eius quam corporis? Atque vel voluptatem
              tenetur, commodi nostrum eligendi debitis minus fugiat sequi culpa
              quas incidunt sint porro!
            </div>
          </div>

          <div className="learn-more-img-container">
            <img src={Organize} alt="" className="learn-more-img" />
          </div>
        </div>

        {/* content 3 */}

        <div className="learn-more-grid-item">
          <div className="learn-more-img-container">
            <img src={Collaborate} alt="" className="learn-more-img" />
          </div>
          <div className="learn-more-description">
            <div className="learn-more-title">Collaborate</div>
            <div className="learn-more-body">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum
              corrupti deserunt eius quam corporis? Atque vel voluptatem
              tenetur, commodi nostrum eligendi debitis minus fugiat sequi culpa
              quas incidunt sint porro!
            </div>
          </div>
        </div>

        {/* content 4 */}
        <div
          className="learn-more-grid-item"
          style={{ paddingBottom: "100px" }}
        >
          <div className="learn-more-description">
            <div className="learn-more-title" style={{ textAlign: "right" }}>
              Streamline
            </div>
            <div className="learn-more-body">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum
              corrupti deserunt eius quam corporis? Atque vel voluptatem
              tenetur, commodi nostrum eligendi debitis minus fugiat sequi culpa
              quas incidunt sint porro!
            </div>
          </div>

          <div className="learn-more-img-container">
            <img src={Streamline} alt="" className="learn-more-img" />
          </div>
        </div>

        <div className="sign-up-button" onClick={() => navigate("/sign-up")}>
          Sign up for free
        </div>
      </div>
      <Footer windowDimension={windowDimension} />
    </div>
  );
};

export default LearnMore;
