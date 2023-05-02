import Footer from "../components/Footer";

const Credits = ({ windowDimension }) => {
  return (
    <div className="page">
      <div className="legal">
        <div className="legal-h1">ATTRIBUTIONS</div>
        <br />
        <br />
        <p>
          {" "}
          <div className="legal-h2">Product Logo</div>{" "}
        </p>
        <p className="legal-body">Design by Dipesh Shrestha</p>
        <br />
        <p>
          {" "}
          <div className="legal-h2">
            preparing-test-together-learning-studying-with-friends-effective-revision-revision-timetables-planning-how-revise-exams-concept-pinkish-coral-bluevector-isolated-illustration
          </div>{" "}
        </p>
        <p className="legal-body"> Image by vectorjuice on Freepik</p>
        <br />
        <p>
          {" "}
          <div className="legal-h2">
            boy-student-sitting-stack-books-with-laptop-flat-icon-illustration
          </div>{" "}
        </p>
        <p className="legal-body"> Image by macrovector on Freepik</p>
        <br />
        <p>
          {" "}
          <div className="legal-h2">
            internet-forum-abstract-concept-illustration
          </div>{" "}
        </p>
        <p className="legal-body"> Image by vectorjuice on Freepik</p>
        <br />
        <p>
          {" "}
          <div className="legal-h2">
            chatbot-development-platform-abstract-concept-illustration
          </div>{" "}
        </p>
        <p className="legal-body"> Image by vectorjuice on Freepik</p>
        <br />
        <p>
          {" "}
          <div className="legal-h2">
            Website used to draft Terms and Conditions
          </div>{" "}
        </p>
        <p className="legal-body"> LawDepot ©2002-2023 LawDepot.com® </p>
        <br />
      </div>

      <Footer windowDimension={windowDimension} />
    </div>
  );
};

export default Credits;
