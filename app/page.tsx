import BigHeading from "@/components/BigHeading"
import { Features } from "@/components/features"
import Header from "@/components/layouts/Header"

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
  const targetBucket = {
    bucket_slug: searchParams.bucket_slug,
    read_key: searchParams.read_key,
    write_key: searchParams.write_key,
  }

  return (
    <>
      <section className="container grid items-center gap-6 p-4 pb-8 pt-6 md:py-10">
        <Header/>
        <div className="relative z-30">
        <BigHeading id="features" subheading="Get Started" heading="Build Your Project, Block by Block" description="Install the content model into your Bucket in a single click, 
then copy & paste the code into your website codebase." className="mb-20"/>
        <Features targetBucket={targetBucket} /></div>
      </section>
    </>
  )
}
