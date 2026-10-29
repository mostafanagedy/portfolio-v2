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
  FaXTwitter,
  FaDev,
} from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import { TbSql } from "react-icons/tb";

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BrandIcons = {
  React: ({ size = 24, color = "#61DAFB", className = "", style = {} }: IconProps) => (
    <SiReact size={size} color={color} className={className} style={style} aria-label="React" />
  ),
  Angular: ({ size = 24, color = "#DD0031", className = "", style = {} }: IconProps) => (
    <SiAngular size={size} color={color} className={className} style={style} aria-label="Angular" />
  ),
  Nodejs: ({ size = 24, color = "#5FA04E", className = "", style = {} }: IconProps) => (
    <SiNodedotjs size={size} color={color} className={className} style={style} aria-label="Node.js" />
  ),
  Express: ({ size = 24, color = "currentColor", className = "", style = {} }: IconProps) => (
    <SiExpress size={size} color={color} className={className} style={style} aria-label="Express.js" />
  ),
  MongoDB: ({ size = 24, color = "#47A248", className = "", style = {} }: IconProps) => (
    <SiMongodb size={size} color={color} className={className} style={style} aria-label="MongoDB" />
  ),
  AWS: ({ size = 24, color = "#FF9900", className = "", style = {} }: IconProps) => (
    <FaAws size={size} color={color} className={className} style={style} aria-label="Amazon Web Services" />
  ),
  Git: ({ size = 24, color = "#F05032", className = "", style = {} }: IconProps) => (
    <SiGit size={size} color={color} className={className} style={style} aria-label="Git" />
  ),
  Docker: ({ size = 24, color = "#2496ED", className = "", style = {} }: IconProps) => (
    <SiDocker size={size} color={color} className={className} style={style} aria-label="Docker" />
  ),
  SQL: ({ size = 24, color = "#4479A1", className = "", style = {} }: IconProps) => (
    <TbSql size={size} color={color} className={className} style={style} aria-label="SQL" />
  ),
  Tailwind: ({ size = 24, color = "#06B6D4", className = "", style = {} }: IconProps) => (
    <SiTailwindcss size={size} color={color} className={className} style={style} aria-label="Tailwind CSS" />
  ),
  TypeScript: ({ size = 24, color = "#3178C6", className = "", style = {} }: IconProps) => (
    <SiTypescript size={size} color={color} className={className} style={style} aria-label="TypeScript" />
  ),
  JavaScript: ({ size = 24, color = "#F7DF1E", className = "", style = {} }: IconProps) => (
    <SiJavascript size={size} color={color} className={className} style={style} aria-label="JavaScript" />
  ),
  HTML5: ({ size = 24, color = "#E34F26", className = "", style = {} }: IconProps) => (
    <SiHtml5 size={size} color={color} className={className} style={style} aria-label="HTML5" />
  ),
  CSS3: ({ size = 24, color = "#1572B6", className = "", style = {} }: IconProps) => (
    <SiCss size={size} color={color} className={className} style={style} aria-label="CSS3" />
  ),
  VSCode: ({ size = 24, color = "#007ACC", className = "", style = {} }: IconProps) => (
    <VscVscode size={size} color={color} className={className} style={style} aria-label="VS Code" />
  ),
  GitHub: ({ size = 24, color = "currentColor", className = "", style = {} }: IconProps) => (
    <FaGithub size={size} color={color} className={className} style={style} aria-label="GitHub" />
  ),
  Devto: ({ size = 24, color = "currentColor", className = "", style = {} }: IconProps) => (
    <FaDev size={size} color={color} className={className} style={style} aria-label="Dev.to" />
  ),
  LinkedIn: ({ size = 24, color = "#0A66C2", className = "", style = {} }: IconProps) => (
    <FaLinkedin size={size} color={color} className={className} style={style} aria-label="LinkedIn" />
  ),
  Figma: ({ size = 24, color = "#F24E1E", className = "", style = {} }: IconProps) => (
    <SiFigma size={size} color={color} className={className} style={style} aria-label="Figma" />
  ),
  Postman: ({ size = 24, color = "#FF6C37", className = "", style = {} }: IconProps) => (
    <SiPostman size={size} color={color} className={className} style={style} aria-label="Postman" />
  ),
  Linux: ({ size = 24, color = "#FCC624", className = "", style = {} }: IconProps) => (
    <SiLinux size={size} color={color} className={className} style={style} aria-label="Linux" />
  ),
  WhatsApp: ({ size = 24, color = "#25D366", className = "", style = {} }: IconProps) => (
    <FaWhatsapp size={size} color={color} className={className} style={style} aria-label="WhatsApp" />
  ),
  TikTok: ({ size = 20, color = "currentColor", className = "", style = {} }: IconProps) => (
    <FaTiktok size={size} color={color} className={className} style={style} aria-label="TikTok" />
  ),
  YouTube: ({ size = 20, color = "#FF0000", className = "", style = {} }: IconProps) => (
    <FaYoutube size={size} color={color} className={className} style={style} aria-label="YouTube" />
  ),
  Instagram: ({ size = 20, color = "#E4405F", className = "", style = {} }: IconProps) => (
    <FaInstagram size={size} color={color} className={className} style={style} aria-label="Instagram" />
  ),
  Facebook: ({ size = 20, color = "#1877F2", className = "", style = {} }: IconProps) => (
    <FaFacebook size={size} color={color} className={className} style={style} aria-label="Facebook" />
  ),
  Discord: ({ size = 20, color = "#5865F2", className = "", style = {} }: IconProps) => (
    <FaDiscord size={size} color={color} className={className} style={style} aria-label="Discord" />
  ),
  XTwitter: ({ size = 20, color = "currentColor", className = "", style = {} }: IconProps) => (
    <FaXTwitter size={size} color={color} className={className} style={style} aria-label="X (Twitter)" />
  ),
};
