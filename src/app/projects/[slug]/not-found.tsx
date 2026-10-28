import Link from "next/link";
import { FolderX, ArrowLeft } from "lucide-react";
import "./project-details.css";

export default function ProjectNotFound() {
  return (
    <div className="view-container pd-not-found-container">
      <div className="container pd-container">
        <div className="pd-not-found-card">
          <div className="pd-not-found-icon">
            <FolderX size={44} aria-hidden="true" />
          </div>
          <h1 className="pd-not-found-title">Project Not Found</h1>
          <p className="pd-not-found-desc">
            The repository you are looking for does not exist on GitHub, may have been renamed, or is currently private.
          </p>
          <div className="pd-not-found-actions">
            <Link href="/projects" className="btn btn--primary pd-btn-back">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to All Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
