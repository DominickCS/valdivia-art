export default function HeroVideo() {
  return (
    <div className="relative w-full overflow-hidden [&>video]:blur-xs" style={{ height: '100svh' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/output.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/30 blur-xs" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        <p className="text-lg tracking-[16px] uppercase opacity-80">Valdivia Art</p>
      </div>
    </div>
  )
}
