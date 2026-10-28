import React from "react";
import {
  SiReact,
  SiAngular,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiDocker,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiFigma,
  SiPostman,
  SiLinux,
} from "react-icons/si";
import { 
  FaAws, 
  FaGithub, 
  FaLinkedin, 
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaDiscord,
  FaXTwitter
} from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import { TbSql } from "react-icons/tb";

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const BrandIcons = {
  React: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiReact size={size} color="#61DAFB" className={className} style={style} aria-label="React" />
  ),
  Angular: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiAngular size={size} color="#DD0031" className={className} style={style} aria-label="Angular" />
  ),
  Nodejs: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiNodedotjs size={size} color="#5FA04E" className={className} style={style} aria-label="Node.js" />
  ),
  Express: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiExpress size={size} color="#FFFFFF" className={className} style={style} aria-label="Express.js" />
  ),
  MongoDB: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiMongodb size={size} color="#47A248" className={className} style={style} aria-label="MongoDB" />
  ),
  AWS: ({ size = 24, className = "", style = {} }: IconProps) => (
    <FaAws size={size} color="#FF9900" className={className} style={style} aria-label="Amazon Web Services" />
  ),
  Git: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiGit size={size} color="#F05032" className={className} style={style} aria-label="Git" />
  ),
  Docker: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiDocker size={size} color="#2496ED" className={className} style={style} aria-label="Docker" />
  ),
  SQL: ({ size = 24, className = "", style = {} }: IconProps) => (
    <TbSql size={size} color="#4479A1" className={className} style={style} aria-label="SQL" />
  ),
  Tailwind: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiTailwindcss size={size} color="#06B6D4" className={className} style={style} aria-label="Tailwind CSS" />
  ),
  TypeScript: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiTypescript size={size} color="#3178C6" className={className} style={style} aria-label="TypeScript" />
  ),
  JavaScript: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiJavascript size={size} color="#F7DF1E" className={className} style={style} aria-label="JavaScript" />
  ),
  HTML5: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiHtml5 size={size} color="#E34F26" className={className} style={style} aria-label="HTML5" />
  ),
  CSS3: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiCss size={size} color="#1572B6" className={className} style={style} aria-label="CSS3" />
  ),
  VSCode: ({ size = 24, className = "", style = {} }: IconProps) => (
    <VscVscode size={size} color="#007ACC" className={className} style={style} aria-label="VS Code" />
  ),
  GitHub: ({ size = 24, className = "", style = {} }: IconProps) => (
    <FaGithub size={size} color="#F7F8FA" className={className} style={style} aria-label="GitHub" />
  ),
  LinkedIn: ({ size = 24, className = "", style = {} }: IconProps) => (
    <FaLinkedin size={size} color="#0A66C2" className={className} style={style} aria-label="LinkedIn" />
  ),
  Figma: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiFigma size={size} color="#F24E1E" className={className} style={style} aria-label="Figma" />
  ),
  Postman: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiPostman size={size} color="#FF6C37" className={className} style={style} aria-label="Postman" />
  ),
  Linux: ({ size = 24, className = "", style = {} }: IconProps) => (
    <SiLinux size={size} color="#FCC624" className={className} style={style} aria-label="Linux" />
  ),
  WhatsApp: ({ size = 24, className = "", style = {} }: IconProps) => (
    <FaWhatsapp size={size} color="#25D366" className={className} style={style} aria-label="WhatsApp" />
  ),
  TikTok: ({ size = 20, className = "", style = {} }: IconProps) => (
    <FaTiktok size={size} color="#FFFFFF" className={className} style={style} aria-label="TikTok" />
  ),
  YouTube: ({ size = 20, className = "", style = {} }: IconProps) => (
    <FaYoutube size={size} color="#FF0000" className={className} style={style} aria-label="YouTube" />
  ),
  Instagram: ({ size = 20, className = "", style = {} }: IconProps) => (
    <FaInstagram size={size} color="#E4405F" className={className} style={style} aria-label="Instagram" />
  ),
  Facebook: ({ size = 20, className = "", style = {} }: IconProps) => (
    <FaFacebook size={size} color="#1877F2" className={className} style={style} aria-label="Facebook" />
  ),
  Discord: ({ size = 20, className = "", style = {} }: IconProps) => (
    <FaDiscord size={size} color="#5865F2" className={className} style={style} aria-label="Discord" />
  ),
  XTwitter: ({ size = 20, className = "", style = {} }: IconProps) => (
    <FaXTwitter size={size} color="#FFFFFF" className={className} style={style} aria-label="X (Twitter)" />
  ),
};
