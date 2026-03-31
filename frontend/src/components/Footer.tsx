export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 border-black/10 shadow-inner px-8 py-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-black/50">
        <p>© {year} Daniel Valdivia · Valdivia.co</p>
        <p>
          Developed by{" "}
          <a
            href="https://dominickcs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all hover:text-black hover:tracking-widest duration-300"
          >
            DominickCS
          </a>
        </p>
      </div>
    </footer>
  )
}
