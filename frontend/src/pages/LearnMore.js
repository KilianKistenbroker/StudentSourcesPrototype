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
              <b>Student Sources</b> is designed to help democratize the
              learning process. Our software tools provide students the ability
              to easily <b>organize, collaborate, and streamline</b> their
              workflow in a manner that is both seamless and intuitive.
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
              <b>Organization</b> is intuitive with a simple and familiar
              filesystem design. Students will have access to a directory tree
              and viewing panel, where they can
              <b> upload, download, and organize</b> their lecture notes to and
              from our cloud storage in a way that feels familiar to a
              traditional filesystem.
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
              <b>Collaboration</b> is implemented in a manner that helps
              democratize the learning process. Professors and students are free
              to share their notes and lecture material, in such a way that
              users can <b> view, download, or post public questions</b> on
              provided notes and lecture materials.
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
              <b>Streamlining</b> is achieved with the aid of OpenAI's API
              services. We provide a seamless interface that allows our users to
              <i> Ask Chatbot;</i> a service providing the ability for
              gpt-3.5-turbo to
              <b> read and respond to files directly.</b> Whenever a student may
              feel confused over a concept, our chatbot can help to deliver a
              quick and reliable answer.
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
