import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const AboutUs = ({ windowDimension }) => {
  return (
    <div className="page">
      <div
        style={{ margin: "auto", marginTop: "200px", marginBottom: "100px" }}
      >
        <header>Joshua Del Rosario</header>
        <p>
          Hello! I'm the Document Master/Database Master for Team 4. I'm
          currently in my last semester at SFSU and I'm excited to finally
          graduate! Some things I enjoy on my free time are playing video games
          and going to the gym/working out. I also enjoy musicals, I've been
          addicted to Hamilton songs recently :D.
        </p>

        <br />
        <header>Elias Abay</header>
        <p>
          Hello! I'm the Backend Lead for Team 4. I'm a computer science student
          at SFSU and I'm in my second to last semester so I'm almost done!! A
          few things that I enjoy when I have free time is that I like to listen
          to R&B music or go out to hang with friends. Another thing that I
          enjoy is playing video games, especially ones from older consoles.
        </p>
        <br />
        <header>Saru Shrestha</header>
        <p>
          Meet Saru, an enthusiastic and driven computer science student who
          thrives on the challenges and possibilities presented by the digital
          world. With a deep-rooted passion for technology, she is on a constant
          quest to expand her knowledge and skills.
          <br />
          With a keen interest in problem-solving and a natural curiosity about
          how things work, Saru embarked on her educational journey in computer
          science. Throughout her studies, she has delved into various aspects
          of the field, including programming languages, algorithms, and
          software development.
          <br />
          Driven by her desire for hands-on experience, Saru actively seeks
          opportunities to apply her theoretical knowledge in practical
          settings. She has actively contributed to projects and research,
          collaborating with professions to gain invaluable real-world insights.
          <br />
          Outside of her computer science pursuits, Saru appreciates the
          intersection of technology and the humanities. She believes in the
          importance of combining technical expertise with creative thinking to
          drive groundbreaking advancements.
          <br />
          As Saru continues her journey as a computer science student, she
          remains committed to lifelong learning and personal growth. She is
          eager to explore emerging technologies, stay updated on industry
          trends, and contribute to the ever-expanding landscape of computer
          science.
          <br />
          To connect with Saru on LinkedIn, please visit her LinkedIn profile at{" "}
          <Link to={"https://linkedin.com/in/shresthasaru"} target="_blank">
            www.linkedin.com/in/shresthasaru
          </Link>
          . Don't hesitate to reach out and send her a connection request to
          stay connected and explore professional opportunities together.
        </p>
      </div>

      <Footer windowDimension={windowDimension} />
    </div>
  );
};

export default AboutUs;
