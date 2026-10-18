export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
      <div className="absolute top-[-10%] left-[-5%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-emerald-500/[0.03] rounded-full blur-[100px] md:blur-[160px]" />
      <div className="absolute top-[40%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-500/[0.02] rounded-full blur-[100px] md:blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/[0.02] rounded-full blur-[100px] md:blur-[120px]" />
    </div>
  )
}
