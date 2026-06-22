import { Link } from "@tanstack/react-router";

/** Editorial footer — privacy, terms, trust, about, accessibility */
export function EditorialFooterLinks() {
  return (
    <>
      <Link to="/privacy" className="text-link">
        privacy
      </Link>
      <span aria-hidden="true"> · </span>
      <Link to="/terms" className="text-link">
        terms
      </Link>
      <span aria-hidden="true"> · </span>
      <Link to="/trust" className="text-link">
        trust
      </Link>
      <span aria-hidden="true"> · </span>
      <Link to="/about" className="text-link">
        about
      </Link>
      <span aria-hidden="true"> · </span>
      <Link to="/accessibility" className="text-link">
        accessibility
      </Link>
    </>
  );
}
