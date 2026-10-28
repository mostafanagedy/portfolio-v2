"use client";

import React, { ReactNode } from "react";
import "./PageTransition.css";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return <div className="page-transition-container">{children}</div>;
}
