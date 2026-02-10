import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header-container">
      <div className="bio">
        <h1>
          Hello, I'm <span className="name">Arkady Dolina</span>
        </h1>
        Senior Software Engineer based in Washington D.C.
      </div>
      <div className="bio">
        I provide software solutions to complex business problems, <br />
        create eye-catching functional sites, lead teams to the finish line, win
        UX Hackathons, and confidently surf both the web and <br />
        (much less confidently) the waves.
      </div>
      <div className="button">
        <a href="/assets/ArkadyDolinaResume.pdf" noref noopener target="_blank">
          View My Resume
        </a>
      </div>
    </div>
  );
};

export default Header;
