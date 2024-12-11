import Image from 'next/image'
import React from 'react'
import { ContainerScroll } from '../ui/container-scroll-animation'
import DotPattern from '../ui/dot-pattern'
import { cn } from '@/lib/utils'

function Hero() {
  return (
    <section className='bg-[#121212] flex items-center flex-col'>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
         <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-gray-200 dark:text-white">
              Manage your money with AI-Driven Personal <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-secondary">
                ExpenseMate
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={`/dashboard.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
    </section>
  )
}

export default Hero