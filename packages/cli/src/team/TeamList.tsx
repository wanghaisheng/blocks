import { cosmic } from "@/cosmic/client"
import { TeamCard, MemberType } from "./TeamCard"

export async function TeamList({
  query,
  sort,
  limit,
  skip,
  className,
  status,
}: {
  query: any
  sort?: string
  limit?: number
  skip?: number
  className?: string
  status?: "draft" | "published" | "any"
}) {
  const { objects: members } = await cosmic.objects
    .find(query)
    .props("id,slug,title,metadata")
    .depth(1)
    .sort(sort ? sort : "-order")
    .limit(limit ? limit : 100)
    .skip(skip ? skip : 0)
    .status(status ? status : "published")
  return (
    <div
      className={`m-auto grid max-w-[900px] grid-cols-1 gap-6 px-4 lg:grid-cols-2 ${className}`}
    >
      {members.map((member: MemberType) => {
        return <TeamCard key={member.slug} member={member} />
      })}
    </div>
  )
}
