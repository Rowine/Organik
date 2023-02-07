import Loader from './Loader'

const HeroImageSkeleton = () => {
  return (
    <div className='relative w-full py-4 sm:py-0'>
      <div className='m-auto w-fit animate-pulse rounded-2xl bg-slate-300 drop-shadow-lg'>
        <img height={400} width={900} className='rounded-2xl border-0'></img>
      </div>
    </div>
  )
}
export default HeroImageSkeleton
