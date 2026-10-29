import React from "react";
import { 
  Mail, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Link2,
  CheckCircle2,
  Share2
} from "lucide-react";
import { BrandIcons } from "./TechIcons";
import { socialLinks, freelancePlatforms, portfolioLinks, followUsOn } from "../data/socialLinks";
import "./ProfileSidebar.css";

export default function ProfileSidebar() {
  return (
    <aside className="profile-sidebar" aria-label="Personal Profile and Quick Links">
      {/* Contact Section */}
      <div className="sidebar-group sidebar-group--contact">
        <a 
          href={`mailto:${socialLinks.email}`} 
          className="sidebar-row sidebar-row--mail"
          title="Send an email"
        >
          <div className="sidebar-row__icon-box">
            <Mail size={16} />
          </div>
          <span className="sidebar-row__text">{socialLinks.email}</span>
        </a>

        <a 
          href={socialLinks.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="sidebar-row sidebar-row--whatsapp"
          title="Chat on WhatsApp (@Nagedy)"
        >
          <div className="sidebar-row__icon-box">
            <BrandIcons.WhatsApp size={16} />
          </div>
          <span className="sidebar-row__text">{socialLinks.whatsappDisplay}</span>
          <ExternalLink size={13} className="sidebar-row__arrow" />
        </a>

        <a 
          href={socialLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="sidebar-row sidebar-row--linkedin"
          title="LinkedIn Profile"
        >
          <div className="sidebar-row__icon-box">
            <BrandIcons.LinkedIn size={16} />
          </div>
          <span className="sidebar-row__text">/in/mostafa-nagdey/</span>
          <ExternalLink size={13} className="sidebar-row__arrow" />
        </a>

        <a 
          href={socialLinks.github} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="sidebar-row sidebar-row--github"
          title="GitHub Profile"
        >
          <div className="sidebar-row__icon-box">
            <BrandIcons.GitHub size={16} />
          </div>
          <span className="sidebar-row__text">github.com/mostafanagedy</span>
          <ExternalLink size={13} className="sidebar-row__arrow" />
        </a>

        <a 
          href={socialLinks.devto} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="sidebar-row sidebar-row--devto"
          title="Dev.to Profile"
        >
          <div className="sidebar-row__icon-box">
            <BrandIcons.Devto size={16} />
          </div>
          <span className="sidebar-row__text">dev.to/mostafanagedy</span>
          <ExternalLink size={13} className="sidebar-row__arrow" />
        </a>
      </div>

      {/* Follow Us On (Social Channels) */}
      <div className="sidebar-group sidebar-group--follow">
        <div className="sidebar-group__heading">
          <Share2 size={15} className="sidebar-group__heading-icon" />
          <span>Follow Us On</span>
        </div>
        <div className="sidebar-follow-icons">
          {followUsOn.map((item) => {
            const Icon = BrandIcons[item.iconKey];
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`sidebar-follow-btn sidebar-follow-btn--${item.name.toLowerCase()}`}
                title={`${item.name} (${item.handle})`}
                aria-label={item.name}
              >
                <Icon size={15} />
              </a>
            );
          })}
        </div>
      </div>

      {/* Portfolio Links */}
      <div className="sidebar-group sidebar-group--portfolio">
        <div className="sidebar-group__heading">
          <Link2 size={16} className="sidebar-group__heading-icon" />
          <span>Portfolio Links</span>
        </div>
        <div className="sidebar-group__list">
          {portfolioLinks.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-item"
              title={`Visit ${p.label}`}
            >
              <span className="sidebar-item__target-icon">◎</span>
              <span className="sidebar-item__text">{p.label}</span>
              <ExternalLink size={12} className="sidebar-row__arrow" />
            </a>
          ))}
        </div>
      </div>

      {/* Freelance Platforms */}
      <div className="sidebar-group sidebar-group--freelance">
        <div className="sidebar-group__heading">
          <Briefcase size={16} className="sidebar-group__heading-icon" />
          <span>Freelance Platforms</span>
        </div>
        <div className="sidebar-freelance-grid">
          {freelancePlatforms.map((f) => (
            <a
              key={f.name}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-platform-badge"
              title={`Hire on ${f.name}`}
            >
              <div className="sidebar-platform-badge__left">
                <CheckCircle2 size={13} className="sidebar-platform-badge__check" />
                <span className="sidebar-platform-badge__name">{f.name}</span>
              </div>
              <ExternalLink size={11} className="sidebar-platform-badge__arrow" />
            </a>
          ))}
        </div>
      </div>

      {/* Education & Location */}
      <div className="sidebar-group sidebar-group--footer">
        <div className="sidebar-meta">
          <GraduationCap size={18} className="sidebar-meta__icon" />
          <div>
            <div className="sidebar-meta__name">Sohag University</div>
            <div className="sidebar-meta__sub">Computer Science • 2023</div>
          </div>
        </div>

        <div className="sidebar-meta">
          <MapPin size={18} className="sidebar-meta__icon" />
          <div>
            <div className="sidebar-meta__name">Egypt</div>
            <div className="sidebar-meta__sub">Remote Worldwide</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
