import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-link">
          <a
            href="https://github.com/adunderground"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <img
              src="/assets/github.svg"
              alt="GitHub"
              className="github-icon"
            />
            ad_underground
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
