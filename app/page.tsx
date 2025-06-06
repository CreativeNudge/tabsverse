export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-blue to-brand-pink flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Tabsverse
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-2">
          Your digital world, curated by you
        </p>
        <p className="text-lg text-white/70 max-w-xl mx-auto">
          Organize, access, and share your web discoveries across devices and with your community.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Get Started
          </button>
          <button className="border border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
        <div className="mt-12 text-sm text-white/60">
          <p>🚀 Project initialized successfully!</p>
          <p>Built with Next.js 15.3.3 + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </main>
  )
}
