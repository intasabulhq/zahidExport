function Footer() {
  return (
    <footer className="bg-stone-950 px-6 py-10 text-white lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm tracking-[0.2em]">ZAHID EXPORTS</p>
        <p className="text-xs text-stone-500">© {new Date().getFullYear()} Zahid Exports. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
