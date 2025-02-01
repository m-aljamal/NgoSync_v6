import Link from "next/link"
import { type users } from "@/db/schemas"

import SigninBtn from "./signin-btn"

type HeroProps = {
  role: typeof users.$inferSelect.role | undefined
}
export default function Hero({ role }: HeroProps) {
  const company = process.env.COMPANY_NAME as "EDC"
  const org = {
    EDC: {
      logo: "https://res.cloudinary.com/dqoung1wz/image/upload/v1613318354/websiteImage/edcLogo_vupus2.png",
      image1:
        "https://cdn.sanity.io/images/j3l9pq2i/production/e77f7c3c180524eb8724cac74e825c1de1edda80-1920x1080.jpg?fm=webp",
      image2:
        "https://cdn.sanity.io/images/j3l9pq2i/production/db08d59cdfde2ea9802d1aa4537f311fb9392785-1368x912.jpg?fm=webp",
      image3:
        "https://cdn.sanity.io/images/j3l9pq2i/production/3916dffde6b7d40a7e2154c3a98a0e974fd5736b-2736x1824.webp?w=1368&h=912&fit=crop",
      image4:
        "https://cdn.sanity.io/images/j3l9pq2i/production/8f1189dafede8f2671b36202e332f46b604ffec1-1080x607.jpg?fm=webp",
      image5:
        "https://cdn.sanity.io/images/j3l9pq2i/production/63c2101968915de88b22a77ca42ddf08a2a44938-960x640.jpg?fm=webp",
      orgName: "هيئة تطوير التعليم",
      orgDescription: "منظمة غير ربحية تعمل على تطوير التعليم",
    },
    RUYA: {
      logo: "https://scontent.fada1-12.fna.fbcdn.net/v/t39.30808-6/464397392_122216629616028411_4906670146771025282_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1nTnQFl6NQ4Q7kNvgGgYpNa&_nc_zt=23&_nc_ht=scontent.fada1-12.fna&_nc_gid=AzsSTep0oQ2hE_RT0pmzN-1&oh=00_AYDFC7YkWI2jMNchedqfaJCIKDV6BRmzszpkNX1uvXTkfQ&oe=67A3DDF5",
      image1:
        "https://scontent.fada1-12.fna.fbcdn.net/v/t39.30808-6/464397392_122216629616028411_4906670146771025282_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1nTnQFl6NQ4Q7kNvgGgYpNa&_nc_zt=23&_nc_ht=scontent.fada1-12.fna&_nc_gid=AzsSTep0oQ2hE_RT0pmzN-1&oh=00_AYDFC7YkWI2jMNchedqfaJCIKDV6BRmzszpkNX1uvXTkfQ&oe=67A3DDF5",
      image2:
        "https://scontent.fada1-12.fna.fbcdn.net/v/t39.30808-6/464397392_122216629616028411_4906670146771025282_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1nTnQFl6NQ4Q7kNvgGgYpNa&_nc_zt=23&_nc_ht=scontent.fada1-12.fna&_nc_gid=AzsSTep0oQ2hE_RT0pmzN-1&oh=00_AYDFC7YkWI2jMNchedqfaJCIKDV6BRmzszpkNX1uvXTkfQ&oe=67A3DDF5",
      image3:
        "https://scontent.fada1-12.fna.fbcdn.net/v/t39.30808-6/464397392_122216629616028411_4906670146771025282_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1nTnQFl6NQ4Q7kNvgGgYpNa&_nc_zt=23&_nc_ht=scontent.fada1-12.fna&_nc_gid=AzsSTep0oQ2hE_RT0pmzN-1&oh=00_AYDFC7YkWI2jMNchedqfaJCIKDV6BRmzszpkNX1uvXTkfQ&oe=67A3DDF5",
      image4:
        "https://scontent.fada1-12.fna.fbcdn.net/v/t39.30808-6/464397392_122216629616028411_4906670146771025282_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1nTnQFl6NQ4Q7kNvgGgYpNa&_nc_zt=23&_nc_ht=scontent.fada1-12.fna&_nc_gid=AzsSTep0oQ2hE_RT0pmzN-1&oh=00_AYDFC7YkWI2jMNchedqfaJCIKDV6BRmzszpkNX1uvXTkfQ&oe=67A3DDF5",
      image5:
        "https://scontent.fada1-12.fna.fbcdn.net/v/t39.30808-6/464397392_122216629616028411_4906670146771025282_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1nTnQFl6NQ4Q7kNvgGgYpNa&_nc_zt=23&_nc_ht=scontent.fada1-12.fna&_nc_gid=AzsSTep0oQ2hE_RT0pmzN-1&oh=00_AYDFC7YkWI2jMNchedqfaJCIKDV6BRmzszpkNX1uvXTkfQ&oe=67A3DDF5",
      orgName: "مركز رؤية المستقبل",
      orgDescription: "منظمة غير ربحية تعمل على تطوير المجتمع",
    },
  }

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-14 w-auto" src={org[company].logo} alt="" />
            </a>
          </div>

          <div className="flex flex-1 justify-end">
            {!role && <SigninBtn />}
            
            {role && role !== "viewer" && (
              <Link
                href={role === "teacher" ? "/courses" :"/overview"}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                لوحة التحكم <span aria-hidden="true">&larr;</span>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main>
        <div className="relative isolate">
          <svg
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
            />
          </svg>
          <div
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
            aria-hidden="true"
          >
            <div
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    {org[company].orgName}
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    {org[company].orgDescription}
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <a
                      href="#"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      تواصل معنا
                    </a>
                  </div>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        src={org[company].image1}
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        src={org[company].image2}
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src={org[company].image3}
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        src={org[company].image4}
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        src={org[company].image5}
                        alt=""
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
