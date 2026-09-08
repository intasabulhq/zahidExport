import Header from "../components/Header"
import Footer from "../components/Footer"

function Contact() {
  return <div className="min-h-screen bg-stone-50 text-stone-900"><Header /><main className="mx-auto max-w-4xl px-6 pb-24 pt-36 lg:px-10"><p className="mb-5 text-xs uppercase tracking-[0.3em] text-stone-500">B2B Enquiry</p><h1 className="text-5xl font-light md:text-7xl">Let's talk about your next collection.</h1><form className="mt-16 grid gap-7" onSubmit={(event) => event.preventDefault()}><input required placeholder="Your name" className="border-b border-stone-300 bg-transparent py-4 outline-none" /><input required type="email" placeholder="Business email" className="border-b border-stone-300 bg-transparent py-4 outline-none" /><input placeholder="Company" className="border-b border-stone-300 bg-transparent py-4 outline-none" /><textarea required placeholder="Tell us about your requirements" rows="6" className="resize-none border-b border-stone-300 bg-transparent py-4 outline-none" /><button type="submit" className="w-fit border border-stone-900 px-9 py-4 text-sm uppercase tracking-widest transition hover:bg-stone-900 hover:text-white">Send Enquiry</button></form></main><Footer /></div>
}

export default Contact
