import { Link } from "@tanstack/react-router";

/** Trust · About links — matches landing footer in index.tsx */
export function EditorialFooterLinks() {
  return (
    <>
      <Link to="/trust" className="text-link">
        Trust
      </Link>
      <span aria-hidden="true"> · </span>
      <Link to="/about" className="text-link">
        About
      </Link>
    </>
  );
}
