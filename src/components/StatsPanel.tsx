import React from "react";
import { Eye, Users, Target } from "lucide-react";
import "./StatsPanel.css";

export default function StatsPanel() {
  return (
    <div className="stats-panel" aria-label="Professional stats and availability">
      <div className="stats-panel__card">
        {/* Stats list */}
        <div className="stats-panel__items">
          {/* Profile Views */}
          <div className="stats-panel__item">
            <div className="stats-panel__icon-box">
              <Eye size={18} className="stats-panel__icon" />
            </div>
            <div className="stats-panel__text">
              <span className="stats-panel__label">Profile Views</span>
              <span className="stats-panel__val">12.4K+</span>
            </div>
          </div>

          {/* Followers */}
          <div className="stats-panel__item">
            <div className="stats-panel__icon-box">
              <Users size={18} className="stats-panel__icon" />
            </div>
            <div className="stats-panel__text">
              <span className="stats-panel__label">Followers</span>
              <span className="stats-panel__val">1.1K+</span>
            </div>
          </div>

          {/* Focus */}
          <div className="stats-panel__item">
            <div className="stats-panel__icon-box">
              <Target size={18} className="stats-panel__icon" />
            </div>
            <div className="stats-panel__text">
              <span className="stats-panel__label">Focus</span>
              <span className="stats-panel__val">Clean Code &amp; Scalability</span>
            </div>
          </div>
        </div>

        {/* Right side: Slanted script text in warm gold */}
        <div className="stats-panel__opportunity">
          <span className="stats-panel__script">Open to Opportunities</span>
        </div>
      </div>
    </div>
  );
}
