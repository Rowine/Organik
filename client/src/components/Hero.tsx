const Hero = () => {
  return (
    <section className="relative h-[450px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero/hero.jpg"
          alt="Fresh produce arrangement"
          className="hidden h-full w-full object-cover object-center md:block"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/hero/fallback.jpg'
          }}
        />

        <div className="absolute inset-0">

          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 md:hidden" />

          <div className="absolute inset-0 hidden bg-gradient-to-r from-green-600/95 via-green-600/40 to-transparent md:block" />
        </div>
      </div>

      <div className="relative h-full">
        <div className="flex h-full items-center pl-4 sm:pl-6 lg:pl-8">
          <div className="max-w-2xl space-y-6">
            <h1>
              <span className="block font-lato text-6xl font-bold tracking-tight text-white sm:text-7xl">
                Fresh Produce
              </span>
              <span className="mt-4 block text-2xl font-light text-white/95 sm:text-3xl">
                Delivered straight to your doorstep
              </span>
            </h1>
            <p className="text-lg font-light leading-relaxed text-white/90 sm:text-xl">
              Experience the freshness of locally sourced fruits and vegetables,
              carefully selected and delivered to ensure the highest quality for your family.
            </p>
            <div className="pt-4">
              <button className="bg-white px-8 py-4 text-lg font-medium text-green-700 transition-all hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Hero
