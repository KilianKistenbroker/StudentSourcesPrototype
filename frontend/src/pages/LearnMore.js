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
        <div
          className="learn-more-grid-item"
          style={
            windowDimension.winWidth < 800
              ? { gridTemplateColumns: "repeat(1, auto)", paddingTop: "50px" }
              : { paddingTop: "50px" }
          }
        >
          <div className="learn-more-img-container">
            <img src={Banner1} alt="" className="learn-more-img" />
          </div>

          <div className="learn-more-description" style={{ paddingTop: "0px" }}>
            <div
              className="learn-more-title"
              style={
                windowDimension.winWidth < 800
                  ? { textAlign: "center" }
                  : { textAlign: "left" }
              }
            >
              Study with Student Sources
            </div>
            <div className="learn-more-body">
              <b>Student Sources</b> is designed to help democratize the
              learning process. Our software tools provide students the ability
              to easily <b>organize, collaborate, and streamline</b> their
              workflow in a manner that is both seamless and intuitive.
            </div>
          </div>
        </div>

        {/* content 2 */}
        {windowDimension.winWidth < 800 ? (
          <div
            className="learn-more-grid-item"
            style={{ gridTemplateColumns: "repeat(1, auto)" }}
          >
            <div className="learn-more-img-container">
              <img src={Organize} alt="" className="learn-more-img" />
            </div>

            <div
              className="learn-more-description"
              style={
                windowDimension.winWidth < 800
                  ? { paddingTop: "0px" }
                  : { paddingTop: "50px" }
              }
            >
              <div
                className="learn-more-title"
                style={
                  windowDimension.winWidth < 800
                    ? { textAlign: "center" }
                    : { textAlign: "left" }
                }
              >
                Organize
              </div>
              <div className="learn-more-body">
                <b>Organization</b> is structured within a filesystem design
                pattern. Users will have access to a directory tree and viewing
                panel, where they can
                <b> upload, download, and organize</b> their lecture notes to
                and from our cloud storage.
              </div>
            </div>
          </div>
        ) : (
          <div className="learn-more-grid-item">
            <div
              className="learn-more-description"
              style={
                windowDimension.winWidth < 800
                  ? { paddingTop: "0px" }
                  : { paddingTop: "50px" }
              }
            >
              <div
                className="learn-more-title"
                style={
                  windowDimension.winWidth < 800
                    ? { textAlign: "center" }
                    : { textAlign: "left" }
                }
              >
                Organize
              </div>
              <div className="learn-more-body">
                <b>Organization</b> is structured within a filesystem design
                pattern. Users will have access to a directory tree and viewing
                panel, where they can
                <b> upload, download, and organize</b> their lecture notes to
                and from our cloud storage.
              </div>
            </div>

            <div className="learn-more-img-container">
              <img src={Organize} alt="" className="learn-more-img" />
            </div>
          </div>
        )}

        {/* content 3 */}

        <div
          className="learn-more-grid-item"
          style={
            windowDimension.winWidth < 800
              ? { gridTemplateColumns: "repeat(1, auto)" }
              : { gridTemplateColumns: "repeat(2, auto)" }
          }
        >
          <div className="learn-more-img-container">
            <img src={Collaborate} alt="" className="learn-more-img" />
          </div>
          <div
            className="learn-more-description"
            style={
              windowDimension.winWidth < 800
                ? { paddingTop: "0px" }
                : { paddingTop: "50px" }
            }
          >
            <div
              className="learn-more-title"
              style={
                windowDimension.winWidth < 800
                  ? { textAlign: "center" }
                  : { textAlign: "left" }
              }
            >
              Collaborate
            </div>
            <div className="learn-more-body">
              <b>Collaboration</b> is implemented in a way that democratizes the
              learning process. Professors and students are free to share their
              notes, with options to{" "}
              <b> view, download, or post public questions</b> on provided
              resources.
            </div>
          </div>
        </div>

        {/* content 4 */}
        {windowDimension.winWidth < 800 ? (
          <div
            className="learn-more-grid-item"
            style={{
              gridTemplateColumns: "repeat(1, auto)",
              paddingBottom: "100px",
            }}
          >
            <div className="learn-more-img-container">
              <img src={Streamline} alt="" className="learn-more-img" />
            </div>

            <div
              className="learn-more-description"
              style={
                windowDimension.winWidth < 800
                  ? { paddingTop: "0px" }
                  : { paddingTop: "50px" }
              }
            >
              <div
                className="learn-more-title"
                style={
                  windowDimension.winWidth < 800
                    ? { textAlign: "center" }
                    : { textAlign: "left" }
                }
              >
                Streamline
              </div>
              <div className="learn-more-body">
                <b>Streamlining</b> is achieved with the aid of OpenAI's newest
                GPT model. We provide a seamless interface by providing the
                option for GPT-4.0 to
                <b> read and respond to files directly.</b> Whenever students
                are struggling over concepts, our chatbot can help to deliver
                quick and reliable guidance.
              </div>
            </div>
          </div>
        ) : (
          <div
            className="learn-more-grid-item"
            style={{ paddingBottom: "100px" }}
          >
            <div
              className="learn-more-description"
              style={
                windowDimension.winWidth < 800
                  ? { paddingTop: "0px" }
                  : { paddingTop: "50px" }
              }
            >
              <div
                className="learn-more-title"
                style={
                  windowDimension.winWidth < 800
                    ? { textAlign: "center" }
                    : { textAlign: "left" }
                }
              >
                Streamline
              </div>
              <div className="learn-more-body">
                <b>Streamlining</b> is achieved with the aid of OpenAI's newest
                GPT model. We provide a seamless interface by providing the
                option for GPT-4.0 to
                <b> read and respond to files directly.</b> Whenever students
                are struggling over concepts, our chatbot can help to deliver
                quick and reliable guidance.
              </div>
            </div>

            <div className="learn-more-img-container">
              <img src={Streamline} alt="" className="learn-more-img" />
            </div>
          </div>
        )}

        <div
          className="sign-up-button"
          onClick={() => {
            navigate("/sign-up");
            window.scrollTo(0, 0);
          }}
        >
          Sign up for free
        </div>
      </div>
      <Footer windowDimension={windowDimension} />
    </div>
  );
};

export default LearnMore;
