import DotPattern from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'
import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Image from 'next/image'
import React from 'react'

function Signup() {
    return (
        <section className="bg-[#121212] min-h-[screen]">
          <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            width={100}
            height={100}
            unoptimized
            alt=""
            src="/finance.png"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
    
          <div className="hidden lg:relative lg:block lg:p-12">
           
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to Expense Mart 
            </h2>
    
            <p className="mt-4 leading-relaxed text-white/90">
            The Next Gneration Expense App for Your Finance Management
            </p>
          </div>
        </section>
    
        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
             
    
              <h1 className="mt-2 text-2xl font-bold text-center text-white sm:text-3xl md:text-4xl">
              Welcome to Expense Mart 
              </h1>
              <p className="mt-4 leading-relaxed text-white/90 my-10 text-center">
            The Next Gneration Expense App for Your Finance Management
            </p>
    
            </div>
    
            <SignIn appearance={{baseTheme:dark}}/>
          </div>
        </main>
      </div>
    </section>
      )
}

export default Signup