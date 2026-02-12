import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header-container">
      <article className="bio">
        <h1>
          Hello, I'm <span className="name">Arkady Dolina</span>
        </h1>
        Senior Software Engineer based in Washington D.C.
      </article>
      <article className="bio">
        I build software that solves complex business problems, <br />
        create eye-catching, high-performing websites,
        <br /> lead teams from idea to launch, win UX hackathons,
        <br /> and leverage cutting-edge AI with intent. <br />
        <br />
        When I'm not surfing the web, I like to surf the ocean swells, <br />
        play guitar, and spin vinyl records for my friends.
      </article>
      <a
        className="button"
        href="/assets/ArkadyDolinaResume.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        View My Resume
      </a>
    </div>
  );
};

export default Header;
