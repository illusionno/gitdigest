import "./SpaceDecorations.css";

export function SpaceDecorations() {
    return (
        <div className="space-decor" aria-hidden="true">
            {/* floating planet */}
            <svg className="space-decor__planet" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="32" stroke="currentColor" strokeWidth="1.5" />
                <ellipse
                    cx="60"
                    cy="60"
                    rx="52"
                    ry="14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    transform="rotate(-18 60 60)"
                />
                <circle cx="48" cy="52" r="6" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="72" cy="68" r="4" stroke="currentColor" strokeWidth="1.2" />
                <path d="M40 44c4-6 12-8 16-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* rocket */}
            <svg className="space-decor__rocket" viewBox="0 0 80 120" fill="none">
                <path
                    d="M40 8c12 18 14 40 14 56 0 10-6 18-14 22-8-4-14-12-14-22 0-16 2-38 14-56z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <circle cx="40" cy="48" r="7" stroke="currentColor" strokeWidth="1.4" />
                <path d="M26 72l-10 18M54 72l10 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M34 86c2 8 4 14 6 18 2-4 4-10 6-18" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M32 28h16M30 36h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            </svg>

            {/* astronaut */}
            <svg className="space-decor__astro" viewBox="0 0 100 140" fill="none">
                <circle cx="50" cy="36" r="18" stroke="currentColor" strokeWidth="1.5" />
                <rect x="38" y="28" width="24" height="14" rx="4" stroke="currentColor" strokeWidth="1.3" />
                <path
                    d="M34 56c-6 4-10 14-8 28l8 4 8-8 8 8 8-4c2-14-2-24-8-28"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path d="M26 78c-8 2-14 10-12 18M74 78c8 2 14 10 12 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M42 88v28M58 88v28M38 116h12M50 116h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="78" cy="52" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M66 58c4-2 8-4 12-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* moon base / satellite */}
            <svg className="space-decor__sat" viewBox="0 0 100 80" fill="none">
                <rect x="34" y="28" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="40" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M34 40H18M66 40h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <rect x="8" y="34" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <rect x="82" y="34" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="M50 28V14M46 14h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="50" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            {/* stars */}
            <svg className="space-decor__stars space-decor__stars--a" viewBox="0 0 60 60" fill="none">
                <path d="M30 4v16M22 12h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M48 36v10M43 41h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="12" cy="44" r="1.5" fill="currentColor" />
                <circle cx="50" cy="14" r="1.2" fill="currentColor" />
            </svg>

            <svg className="space-decor__stars space-decor__stars--b" viewBox="0 0 48 48" fill="none">
                <path d="M24 6v14M17 13h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="32" r="1.4" fill="currentColor" />
                <circle cx="40" cy="28" r="1.1" fill="currentColor" />
                <path d="M36 40l4 4M40 40l-4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>

            <svg className="space-decor__stars space-decor__stars--c" viewBox="0 0 40 40" fill="none">
                <path d="M20 4v12M14 10h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="32" cy="28" r="1.3" fill="currentColor" />
                <circle cx="6" cy="24" r="1" fill="currentColor" />
            </svg>
        </div>
    );
}