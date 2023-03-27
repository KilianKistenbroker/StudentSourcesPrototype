import { useState, useEffect } from "react";

const Footer = () => {
  // ***************** REUSED CODE *****************
  const [windowDimension, setWindowDimension] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    setWindowDimension({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    // reset focus
    document.activeElement.blur();

    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);
  // ****************** REUSED CODE *****************

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
          <div className="sentence_spacing">
            Solutions <br />
          </div>
          <div className="sentence_spacing">
            Security <br />
          </div>
          <div className="sentence_spacing">
            Plans <br />
          </div>
        </div>
        <div className="footer-content">
          <h2>Support</h2> <br />
          <div className="sentence_spacing">
            Privacy & Terms <br />
          </div>
          <div className="sentence_spacing">
            Help center <br />
          </div>
          <div className="sentence_spacing">
            API usage <br />
          </div>
        </div>
        <div className="footer-content">
          <h2>Learning</h2> <br />
          <div className="sentence_spacing">
            Gateway <br />
          </div>
          <div className="sentence_spacing">
            Canvas <br />
          </div>
          <div className="sentence_spacing">
            iLearn <br />
          </div>
        </div>
        <div className="footer-content">
          <h2>Developer</h2> <br />
          About us <br />
        </div>
      </div>
    </div>
  );
};

export default Footer;
