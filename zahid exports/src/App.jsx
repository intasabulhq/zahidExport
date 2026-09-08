function App() {
  const products = [
    {
      name: "Coffee Tables",
      category: "Furniture",
      image:
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1400&q=85",
    },
    {
      name: "Side Tables",
      category: "Furniture",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=85",
    },
    {
      name: "Console Tables",
      category: "Furniture",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
    },
    {
      name: "Home Decor",
      category: "Decor",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">

      {/* ================= NAVBAR ================= */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">

          {/* Logo */}
          <a
            href="#home"
            className="text-xl font-semibold tracking-[0.25em] text-white"
          >
            ZAHID EXPORTS
          </a>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-10 md:flex">
            <a
              href="#home"
              className="text-sm uppercase tracking-widest text-white transition hover:opacity-60"
            >
              Home
            </a>

            <a
              href="#products"
              className="text-sm uppercase tracking-widest text-white transition hover:opacity-60"
            >
              Products
            </a>

            <a
              href="#about"
              className="text-sm uppercase tracking-widest text-white transition hover:opacity-60"
            >
              About Us
            </a>

            <a
              href="#contact"
              className="text-sm uppercase tracking-widest text-white transition hover:opacity-60"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="border border-white px-5 py-2 text-xs uppercase tracking-widest text-white md:hidden">
            Menu
          </button>

        </nav>
      </header>


      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden"
      >

        {/* Temporary Hero Image */}
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90"
          alt="Luxury interior"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="max-w-4xl text-white">

            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-stone-200 md:text-sm">
              Furniture • Home Decor • Handicrafts
            </p>

            <h1 className="text-5xl font-light leading-[1.05] md:text-7xl lg:text-8xl">
              Crafted for
              <br />
              Beautiful Spaces
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-stone-200 md:text-lg">
              Discover thoughtfully crafted furniture and handcrafted
              pieces designed to bring character, elegance and warmth
              to every space.
            </p>

            <a
              href="#products"
              className="mt-9 inline-block border border-white px-8 py-4 text-sm uppercase tracking-widest transition duration-300 hover:bg-white hover:text-stone-900"
            >
              Explore Collection
            </a>

          </div>
        </div>

      </section>


      {/* ================= PRODUCTS ================= */}
      <section
        id="products"
        className="px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="mb-16 max-w-3xl">

            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-500">
              Our Collection
            </p>

            <h2 className="text-4xl font-light leading-tight md:text-6xl">
              Products made to
              <br />
              make an impression.
            </h2>

          </div>


          {/* Product Grid */}
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2">

            {products.map((product) => (
              <div
                key={product.name}
                className="group cursor-pointer"
              >

                {/* Product Image */}
                <div className="overflow-hidden bg-stone-200">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                </div>


                {/* Product Information */}
                <div className="flex items-center justify-between border-b border-stone-300 py-5">

                  <div>

                    <p className="text-lg font-normal">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">
                      {product.category}
                    </p>

                  </div>

                  <span className="text-2xl transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>

                </div>

              </div>
            ))}

          </div>


          {/* View All Button */}
          <div className="mt-16 text-center">

            <button className="border border-stone-900 px-8 py-4 text-sm uppercase tracking-widest transition duration-300 hover:bg-stone-900 hover:text-white">
              View All Products
            </button>

          </div>

        </div>
      </section>


      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="bg-stone-900 px-6 py-24 text-white lg:px-10 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left */}
          <div>

            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-stone-400">
              About Zahid Exports
            </p>

            <h2 className="text-4xl font-light leading-tight md:text-6xl">
              Craftsmanship
              <br />
              meets timeless design.
            </h2>

          </div>


          {/* Right */}
          <div>

            <p className="text-lg leading-8 text-stone-300">
              At Zahid Exports, we believe every piece should tell a story.
              Our collection combines skilled craftsmanship, thoughtful
              design and attention to detail to create products made for
              beautiful interiors.
            </p>


            {/* Numbers */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-stone-700 pt-8">

              <div>
                <p className="text-3xl font-light">
                  01
                </p>

                <p className="mt-2 text-xs uppercase tracking-widest text-stone-400">
                  Craftsmanship
                </p>
              </div>


              <div>
                <p className="text-3xl font-light">
                  02
                </p>

                <p className="mt-2 text-xs uppercase tracking-widest text-stone-400">
                  Quality
                </p>
              </div>


              <div>
                <p className="text-3xl font-light">
                  03
                </p>

                <p className="mt-2 text-xs uppercase tracking-widest text-stone-400">
                  Export
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        className="px-6 py-24 lg:px-10 lg:py-36"
      >
        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-stone-500">
            Get In Touch
          </p>

          <h2 className="text-4xl font-light leading-tight md:text-6xl">
            Let's create something
            <br />
            beautiful together.
          </h2>

          <button className="mt-10 border border-stone-900 px-9 py-4 text-sm uppercase tracking-widest transition duration-300 hover:bg-stone-900 hover:text-white">
            Contact Us
          </button>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-stone-950 px-6 py-10 text-white lg:px-10">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <p className="text-sm tracking-[0.2em]">
            ZAHID EXPORTS
          </p>

          <p className="text-xs text-stone-500">
            © 2026 Zahid Exports. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  )
}

export default App