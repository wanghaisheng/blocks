import { cosmic } from "@/cosmic/client"
import { EventCard, EventCardType } from "./EventCard"

export async function EventsList({ query }: { query: any }) {
  const { objects: events } = await cosmic.objects
    .find(query)
    .props("title,slug,metadata")
    .depth(1)

  return (
    <>
      {events?.map((event: EventCardType) => {
        return <EventCard event={event} key={event.slug} />
      })}
    </>
  )
}
