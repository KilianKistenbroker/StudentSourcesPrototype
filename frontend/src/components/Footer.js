import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
            onClick={() => navigate("/")}
          >
            Learn More <br />
          </div>
          <div className="sentence_spacing">
            Plans <br />
          </div>
        </div>
        <div className="footer-content">
          <h2>Support</h2> <br />
          <div className="sentence_spacing">
            Help center <br />
          </div>
          <div
            className="sentence_spacing cursor-enabled"
            onClick={() => navigate("/credits")}
          >
            References <br />
          </div>
          <div
            className="sentence_spacing cursor-enabled"
            onClick={() => navigate("/terms")}
          >
            Terms <br />
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
          <h2>Contacts</h2> <br />
          About us <br />
        </div>
      </div>
    </div>
  );
};

export default Footer;
