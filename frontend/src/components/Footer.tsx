import { Link } from "react-router-dom";
import YouTubeSVG from "../assets/youtube.svg"
import InstagramSVG from "../assets/instagram.svg"

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 border-black/10 shadow-inner px-8 py-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-black/50">
        <p className="text-sm">© {year} Daniel Valdivia · Valdivia.co</p>
        <div className="flex justify-evenly [&>a]:px-4">
          <Link to={"https://www.instagram.com/danielvaldivia"} target="_blank" className="transition-all hover:text-black hover:tracking-widest duration-300" >
            <div className="flex justify-between items-center content-center text-center">
              <img className="mr-2" src={InstagramSVG} height={24} width={24} />
              <p className="text-lg font-bold">@danielvaldivia</p>
            </div>
          </Link>
          <Link to={"https://www.youtube.com/@danielvaldiviapaints"} target="_blank" className="transition-all hover:text-black hover:tracking-widest duration-300" >
            <div className="flex justify-between items-center">
              <img className="flex items-center content-center mr-2" src={YouTubeSVG} height={24} width={24} />
              <p className="text-lg font-bold">@danielvaldiviapaints</p>
            </div>
          </Link>
        </div>
        <p className="text-sm">
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
