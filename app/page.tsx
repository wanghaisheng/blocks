import { Features } from "@/components/features"

export default async function IndexPage({
  searchParams,
}: {
  searchParams: {
    bucket_slug: string
    read_key: string
    write_key: string
    location: string
  }
}) {
  const bucket = {
    bucket_slug: searchParams.bucket_slug,
    read_key: searchParams.read_key,
    write_key: searchParams.write_key,
  }

  return (
    <section className="container grid items-center gap-6 p-4 pb-8 pt-6 md:py-10 lg:w-[980px]">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Feature Installer
        </h1>
        <p>Install the following features to your Cosmic Object types.</p>
      </div>
      <Features bucket={bucket} />
    </section>
  )
}
