export default function HomePage() {
  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Tabsverse
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Your personal digital content hub. Organize, access, and share your web discoveries across devices and with your community.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button className="bg-brand-cyan hover:bg-cyan-400 text-brand-deep-blue font-semibold py-3 px-6 rounded-lg transition-colors">
            Get Started
          </button>
          <button className="border border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
        <div className="mt-12 text-sm text-blue-200">
          <p>🚀 Project initialized successfully!</p>
          <p>Built with Next.js 15.3.3 + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </main>
  )
}
