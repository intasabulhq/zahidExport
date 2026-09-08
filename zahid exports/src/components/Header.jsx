import { useState } from "react"
import { Link } from "react-router-dom"

const links = [
  ["Home", "/"],
  ["Products", "/products"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
]

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <Link to="/" className="text-xl font-semibold tracking-[0.25em] text-white">
          ZAHID EXPORTS
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} to={href} className="text-sm uppercase tracking-widest text-white transition hover:opacity-60">
              {label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="border border-white px-5 py-2 text-xs uppercase tracking-widest text-white md:hidden"
          aria-expanded={open}
        >
          Menu
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/20 bg-stone-950 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map(([label, href]) => (
              <Link key={href} to={href} onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
