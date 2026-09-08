import Header from "../components/Header"
import Footer from "../components/Footer"

function About() {
  return <div className="min-h-screen bg-stone-50 text-stone-900"><Header /><main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10"><p className="mb-5 text-xs uppercase tracking-[0.3em] text-stone-500">About Zahid Exports</p><div className="grid gap-12 lg:grid-cols-2"><h1 className="text-5xl font-light leading-tight md:text-7xl">Craftsmanship meets timeless design.</h1><div><p className="text-lg leading-8 text-stone-600">We are building a premium catalogue experience around furniture, home décor and handcrafted products for B2B buyers and global markets.</p><div className="mt-12 grid grid-cols-3 gap-4 border-t border-stone-300 pt-7"><div><p className="text-3xl font-light">01</p><p className="mt-2 text-xs uppercase tracking-widest text-stone-500">Craftsmanship</p></div><div><p className="text-3xl font-light">02</p><p className="mt-2 text-xs uppercase tracking-widest text-stone-500">Quality</p></div><div><p className="text-3xl font-light">03</p><p className="mt-2 text-xs uppercase tracking-widest text-stone-500">Export</p></div></div></div></div></main><Footer /></div>
}

export default About
