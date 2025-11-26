export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-3xl">
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground pb-2">
            Next.js + Tailwind
          </h1>
          <p className="text-lg sm:text-xl text-foreground/60 max-w-lg mx-auto leading-relaxed">
            A premium starting point for your next great idea. Built with the
            latest Next.js and Tailwind CSS v4.
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row z-10 mt-4">
          <a
            className="rounded-full border border-solid border-transparent transition-all flex items-center justify-center bg-foreground text-background gap-2 hover:opacity-90 text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 font-medium shadow-lg hover:shadow-xl"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Documentation
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-all flex items-center justify-center hover:bg-black/[.04] dark:hover:bg-white/[.04] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 sm:min-w-44 font-medium backdrop-blur-sm"
            href="https://github.com/vercel/next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-foreground/40">
        <p>© {new Date().getFullYear()} Project Starter</p>
      </footer>
    </div>
  );
}
