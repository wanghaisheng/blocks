/* eslint-disable @next/next/no-img-element */
import dedent from "dedent"

import { fetchFeature } from "@/lib/cosmic"
import { BlogCard, PostType } from "@/components/blog-card"
import { BucketAPILink } from "@/components/bucket-api-link"
import { Markdown } from "@/components/elements/Markdown/Markdown"
import CodeSteps from "@/components/layouts/CodeSteps"

export const generateMetadata = async () => ({ title: `Blog` })

export default async function BlogPage({
  searchParams,
}: {
  searchParams: {
    tab?: "preview" | "tab"
  }
}) {
  let tab = searchParams.tab
  if (!tab) tab = "preview"

  return (
    <>
      <section className="container m-auto grid max-w-[800px] items-center pb-8">
        {tab === "preview" ? <Preview /> : <Code />}
      </section>
    </>
  )
}

async function Preview() {
  const posts = await fetchFeature<PostType>("blog-posts")
  const blog = posts[0]
  const date = new Date(blog.metadata.published_date).toLocaleDateString(
    "en-us",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )
  return (
    <>
      <section className="container m-auto grid items-center px-4 py-8">
        <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Blog List
        </h1>
        <div className="relative m-auto flex max-w-[950px] flex-col items-start gap-2">
          <div className="mx-auto grid w-full max-w-screen-lg grid-cols-1 flex-col gap-5 pb-24 sm:grid-cols-2 lg:gap-10">
            {posts.map((post: PostType) => {
              return <BlogCard key={post.id} post={post} />
            })}
          </div>
        </div>
        <div className="relative m-auto flex max-w-[950px] flex-col items-start gap-2">
          <h1 className="mb-8 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Single Post Page
          </h1>
          <>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-black dark:text-white md:text-4xl">
              {blog.title}
            </h1>
            <div className="mb-10 w-full overflow-hidden rounded-xl">
              <img
                src={`${blog.metadata.image.imgix_url}?w=2000&auto=format,compression`}
                alt={blog.title}
                className="w-full object-cover"
              />
            </div>
            <div className="mb-2 md:flex">
              <img
                className="mr-2 h-[60px] w-[60px] rounded-full object-cover"
                src={`${blog.metadata.author.metadata.image.imgix_url}?w=120&auto=format,compression`}
                alt={blog.metadata.author.title}
              />
              <div className="mb-4 flex flex-col">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {blog.metadata.author.title}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">{date}</span>
              </div>
              <div className="md:absolute md:right-0">
                {blog.metadata.categories.map((category: any) => {
                  const categoryBackgroundColor = `${category.metadata.color}22`
                  return (
                    <span
                      className="mb-1 mr-1 rounded-xl px-3 py-1 text-black/70 dark:text-white/70"
                      style={{
                        backgroundColor: categoryBackgroundColor,
                        border: `1px solid ${category.metadata.color}`,
                      }}
                      key={category.slug}
                    >
                      {category.title}
                    </span>
                  )
                })}
              </div>
            </div>
            <Markdown className="space-y-4 text-zinc-700 dark:text-zinc-300">
              {blog.metadata.content}
            </Markdown>
          </>
        </div>
      </section>
    </>
  )
}

function Code() {
  const blockCommand = dedent`
  \`\`\`bash
  bunx @cosmicjs/blocks add blog
  \`\`\`
  `

  const codeString = dedent`
    \`\`\`jsx
      // app/blog/page.tsx
      import { BlogList } from "@/cosmic/blocks/blog/BlogList";

      export default async function BlogPage() {
        const query = { 
          type: "blog-posts",
          locale: ""
        }
        return <div className="container max-w-6xl m-auto grid grid-cols-3 space-x-3 py-10">
          <BlogList query={query} sort="-created_at" limit={10} skip={0} />
        </div>
      }
    \`\`\`
    `

  const codeSinglePageString = dedent`
    \`\`\`jsx
      // app/blog/[slug]/page.tsx
      import { SingleBlog } from "@/cosmic/blocks/blog/SingleBlog";
      export default async function SingleBlogPage({
        params,
      }: {
        params: { slug: string };
      }) {
        const query = {
          slug: params.slug,
          locale: "",
          type: "blog-posts",
        };
        return <SingleBlog query={query} />;
      }
    
    \`\`\`
    `
  const steps = [
    {
      title: "Install the Block content model",
      code: blockCommand,
      description:
        "This will create the `blog-posts`, `authors`, and `categories` Object types in your Bucket and add demo content.",
      installButton: true,
    },
    {
      title: "Install the Block code",
      code: blockCommand,
      description:
        "This will add the files `BlogCard.tsx`,`BlogList.tsx`, and `SingleBlog.tsx` to your blocks folder located in `cosmic/blocks/blog`.",
    },
    {
      title: "Create the blog grid page",
      code: codeString,
      description:
        "Add a new file located at `app/blog/page.tsx` with the following",
    },
    {
      title: "Create the single blog page",
      code: codeSinglePageString,
      description:
        "Add a new file located at `app/blog/[slug]/page.tsx` with the following",
    },
  ]

  return (
    <>
      <CodeSteps steps={steps} preview={<Preview />} featureKey="blog" />
    </>
  )
}
