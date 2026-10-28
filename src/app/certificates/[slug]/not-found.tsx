import Link from "next/link";
import { Award, ArrowLeft } from "lucide-react";
import "../certificates.css";

export default function CertificateNotFound() {
  return (
    <div className="view-container certs-view">
      <div className="container certs-container">
        <div className="certs-state-card" role="alert" style={{ marginTop: "60px" }}>
          <div className="certs-state-icon">
            <Award size={40} />
          </div>
          <h2 className="certs-state-title">Certificate Not Found</h2>
          <p className="certs-state-desc">
            The requested certificate could not be located in the GitHub repository. It may have been
            renamed, moved, or updated.
          </p>
          <Link href="/certificates" className="btn btn--primary certs-reset-btn">
            <ArrowLeft size={16} />
            <span>Back to All Certificates</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
