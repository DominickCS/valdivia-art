import { useEffect, useRef } from "react"

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // React doesn't correctly set the muted attribute on the DOM node —
    // older iOS Safari reads the attribute, not the property
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {
        // Autoplay blocked — silently fail, poster image shows instead
      })
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '100svh' }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        // webkit-playsinline is required for older iOS Safari (<= iOS 9)
        {...{ 'webkit-playsinline': 'true' }}
        poster="/assets/output-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover [&]:blur-xs"
        style={{ WebkitTransform: 'translateZ(0)' }}
      >
        <source src="/assets/output.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        <p className="text-lg tracking-[16px] uppercase opacity-80">Valdivia Art</p>
      </div>
    </div>
  )
}
