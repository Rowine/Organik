const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-green-500 to-green-400/80">
      {/* Desktop Image Container */}
      <div className="absolute right-0 top-0 hidden h-full md:block">
        <img
          src="/images/hero/hero-2.png"
          alt="Fresh produce arrangement"
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
        {/* Desktop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/95 to-transparent" />
      </div>

      {/* Content Container - Always Visible */}
      <div className="relative">
        <div className="mx-auto flex min-h-[500px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-8 py-20 md:py-28">
            <div className="space-y-2">
              <h1 className="space-y-4">
                <span className="block text-5xl font-bold tracking-tight text-white sm:text-7xl">
                  Fresh Produce,
                  <br />
                  Fresh Life
                </span>
                <span className="mt-4 block text-2xl font-normal text-white/95 sm:text-3xl">
                  Delivered straight to your doorstep
                </span>
              </h1>
            </div>
            <p className="text-lg font-light leading-relaxed text-white/90 sm:text-xl">
              Experience the freshness of locally sourced fruits and vegetables,
              carefully selected and delivered to ensure the highest quality for your family.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <button className="rounded-lg bg-white px-8 py-4 text-lg font-medium text-green-700 shadow-lg shadow-green-700/20 transition-all hover:bg-green-50 hover:shadow-xl hover:shadow-green-700/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
                Shop Now
              </button>
              <button className="rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Hero
