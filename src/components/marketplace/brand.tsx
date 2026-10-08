import { Link } from "@/i18n/navigation";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="WeShareCozy home">
      <svg
        width="35"
        height="38"
        viewBox="0 0 36 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 19 18 6l13 13v15H5V19Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M11 22c0-5 7-4 7 0 0-4 7-5 7 0 0 5-7 9-7 9s-7-4-7-9Z"
          fill="currentColor"
        />
      </svg>
      <span>
        WeShare<span className="brand-cozy">Cozy</span>
        <small>FIND YOUR ISTANBUL</small>
      </span>
    </Link>
  );
}
