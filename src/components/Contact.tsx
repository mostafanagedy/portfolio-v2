"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Copy, 
  MapPin, 
  Share2, 
  Network,
  ExternalLink, 
  User, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "./Icons";
import { BrandIcons } from "./TechIcons";
import { socialLinks, freelancePlatforms, followUsOn } from "../data/socialLinks";
import "./Contact.css";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(socialLinks.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const validateForm = () => {
    const errs: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) {
      errs.name = "Please enter your name";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = "Please enter your email";
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      errs.message = "Please write a message";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Launch user's default email client with pre-populated message
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoUrl = `mailto:${socialLinks.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setSubmitted(true);
  };

  return (
    <section id="contact" className="section contact-section" aria-label="Contact and hire Mostafa Nagdy">
      <div className="container contact-container">
        {/* Header with Accent Label, Title, Accent Bar, Subtitle */}
        <div className="section__header contact-header">
          <span className="contact__eyebrow">CONTACT</span>
          <h1 className="section__title contact-title">
            Let's <span className="text-accent">Connect</span>
          </h1>
          <div className="contact-title-bar" aria-hidden="true" />
          <p className="section__subtitle contact-subtitle">
            Have a project in mind or looking to hire? Feel free to reach out.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="contact__grid">
          {/* Left Column: Direct channels & profiles (~60%) */}
          <div className="contact__info">
            {/* Row 1: Email & WhatsApp */}
            <div className="contact__info-row">
              {/* Email Card */}
              <div className="contact__card contact__card--email">
                <div className="contact__card-header">
                  <div className="contact__icon-box" aria-hidden="true">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h2 className="contact__card-title">Email Direct</h2>
                    <p className="contact__card-desc">Quickest way to reach me</p>
                  </div>
                </div>

                <div className="contact__email-row">
                  <a href={`mailto:${socialLinks.email}`} className="contact__email-link" title="Click to email directly">
                    {socialLinks.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="contact__copy-btn"
                    title="Copy email to clipboard"
                    type="button"
                    aria-label="Copy email address"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-primary" /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp Direct Card */}
              <div className="contact__card contact__card--whatsapp">
                <div className="contact__card-header">
                  <div
                    className="contact__icon-box contact__icon-box--whatsapp"
                    aria-hidden="true"
                  >
                    <BrandIcons.WhatsApp size={18} />
                  </div>
                  <div>
                    <h2 className="contact__card-title">WhatsApp Direct</h2>
                    <p className="contact__card-desc">Instant chat & fast response</p>
                  </div>
                </div>

                <div className="contact__email-row">
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__email-link"
                    title="Open WhatsApp chat"
                  >
                    {socialLinks.whatsappDisplay}
                  </a>
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__copy-btn contact__chat-btn"
                    title="Chat on WhatsApp"
                    aria-label="Chat on WhatsApp"
                  >
                    <Send size={13} aria-hidden="true" />
                    <span>Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Row 2: Networks & Freelance Platforms */}
            <div className="contact__info-row">
              {/* Professional Networks */}
              <div className="contact__card contact__card--networks">
                <div className="contact__card-header">
                  <div className="contact__icon-box" aria-hidden="true">
                    <Network size={18} />
                  </div>
                  <div>
                    <h2 className="contact__card-title">Professional Networks</h2>
                    <p className="contact__card-desc">Verified profiles & code</p>
                  </div>
                </div>
                <div className="contact__social-list">
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social-item"
                    title="Visit LinkedIn Profile"
                  >
                    <LinkedInIcon size={16} />
                    <span>LinkedIn Profile</span>
                    <ExternalLink size={13} className="contact__social-ext" />
                  </a>
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social-item"
                    title="Visit GitHub Repositories"
                  >
                    <GitHubIcon size={16} />
                    <span>GitHub Repositories</span>
                    <ExternalLink size={13} className="contact__social-ext" />
                  </a>
                </div>
              </div>

              {/* Hire via Platforms */}
              <div className="contact__card contact__card--platforms">
                <div className="contact__card-header">
                  <div className="contact__icon-box" aria-hidden="true">
                    <Share2 size={18} />
                  </div>
                  <div>
                    <h2 className="contact__card-title">Hire via Platforms</h2>
                    <p className="contact__card-desc">Freelance marketplaces</p>
                  </div>
                </div>
                <div className="contact__platforms">
                  {freelancePlatforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact__platform-tag"
                      title={`Hire on ${platform.name}`}
                    >
                      <span>{platform.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Follow Us On (Social Grid) */}
            <div className="contact__card contact__card--follow">
              <div className="contact__card-header">
                <div className="contact__icon-box" aria-hidden="true">
                  <Share2 size={18} />
                </div>
                <div>
                  <h2 className="contact__card-title">Follow Us On</h2>
                  <p className="contact__card-desc">Social media channels & community</p>
                </div>
              </div>

              <div className="contact__follow-grid">
                {followUsOn.map((item) => {
                  const Icon = BrandIcons[item.iconKey];
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`contact__follow-item contact__follow-item--${item.name.toLowerCase()}`}
                      title={`${item.name} (${item.handle})`}
                    >
                      <div className="contact__follow-icon-box" aria-hidden="true">
                        <Icon size={16} />
                      </div>
                      <div className="contact__follow-meta">
                        <span className="contact__follow-name">{item.name}</span>
                        <span className="contact__follow-handle">{item.handle}</span>
                      </div>
                      <ExternalLink size={12} className="contact__follow-arrow" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Availability Bar */}
            <div className="contact__location-badge" role="note">
              <MapPin size={16} className="text-primary" aria-hidden="true" />
              <span>Based in Egypt • Available for Remote & Freelance Globally</span>
            </div>
          </div>

          {/* Right Column: Contact Form Card (~40%) */}
          <div className="contact__form-container">
            <div className="contact__form-header">
              <div className="contact__form-eyebrow">
                <Send size={14} className="text-primary" aria-hidden="true" />
                <span>SEND A MESSAGE</span>
              </div>
              <h2 className="contact__form-title">Get In Touch</h2>
              <p className="contact__form-subtitle">
                Fill out the form below and I'll get back to you as soon as possible.
              </p>
            </div>

            {submitted ? (
              <div className="contact__success" role="alert">
                <div className="contact__success-icon">
                  <CheckCircle2 size={36} className="text-primary" />
                </div>
                <h3>Message Ready to Send!</h3>
                <p>
                  Your default email client has been opened with your message addressed to{" "}
                  <strong>{socialLinks.email}</strong>.
                </p>
                <div className="contact__success-note">
                  <p>
                    <em>Note: To connect an automated backend server without opening a mail client, configure an email provider (such as Resend or EmailJS).</em>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", message: "" });
                  }}
                  className="btn btn--primary contact__reset-btn"
                >
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact__form" noValidate>
                {/* Name Field */}
                <div className={`form-group ${errors.name ? "form-group--error" : ""}`}>
                  <label htmlFor="contact-name">
                    <User size={13} className="form-label-icon text-primary" aria-hidden="true" />
                    <span>Your Name</span>
                  </label>
                  <div className="form-input-wrapper">
                    <User size={15} className="form-input-icon" aria-hidden="true" />
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      className="form-input"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                    />
                  </div>
                  {errors.name && (
                    <span className="form-error-msg">
                      <AlertCircle size={12} aria-hidden="true" />
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email Field */}
                <div className={`form-group ${errors.email ? "form-group--error" : ""}`}>
                  <label htmlFor="contact-email">
                    <Mail size={13} className="form-label-icon text-primary" aria-hidden="true" />
                    <span>Your Email</span>
                  </label>
                  <div className="form-input-wrapper">
                    <Mail size={15} className="form-input-icon" aria-hidden="true" />
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className="form-input"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && (
                    <span className="form-error-msg">
                      <AlertCircle size={12} aria-hidden="true" />
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Message Field */}
                <div className={`form-group ${errors.message ? "form-group--error" : ""}`}>
                  <label htmlFor="contact-message">
                    <MessageSquare size={13} className="form-label-icon text-primary" aria-hidden="true" />
                    <span>Message</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Describe your project, timeline, or inquiry..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    className="form-textarea"
                    aria-required="true"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <span className="form-error-msg">
                      <AlertCircle size={12} aria-hidden="true" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Full-width Orange Submit Button */}
                <button type="submit" className="contact__submit-btn">
                  <Send size={16} aria-hidden="true" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
