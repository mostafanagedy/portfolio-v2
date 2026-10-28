"use client";

import React from "react";
import { Zap } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__container">
        <div className="footer__content">
          {/* Left: Motto */}
          <div className="footer__motto">
            <Zap size={16} className="footer__icon-zap" />
            <span className="footer__phrase">Turning ideas into real world applications</span>
            <span className="footer__arrow">→</span>
            <span className="footer__author">Mostafa Nagdy</span>
          </div>

          {/* Far Right: Signature */}
          <div className="footer__signature" aria-hidden="true">
            <span className="footer__keep-going">Keep Going</span>
            <span className="footer__crown">👑</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
