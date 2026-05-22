import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8">

          <div className="col-span-2">
            <h3 className="text-lg font-bold mb-3">
              Mohan<span className="text-blue-400">Journal</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              An open access academic journal platform publishing
              peer-reviewed research across multiple disciplines.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-slate-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/journals", label: "Journals" },
                { href: "/papers",   label: "Papers" },
                { href: "/about",    label: "About" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-slate-300">
              Authors
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/register",          label: "Submit Paper" },
                { href: "/author/dashboard",  label: "Author Portal" },
                { href: "/login",             label: "Sign In" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MohanJournal. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}