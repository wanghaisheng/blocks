// components/faqs.tsx
import { cosmic } from "@/cosmic/client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion"

type FAQ = {
  question: string
  answer: string
}

export async function FAQs({
  query,
  className,
  preview,
}: {
  query: any
  className?: string
  preview?: boolean
}) {
  const { object: page } = await cosmic.objects
    .findOne(query)
    .props("slug,title,metadata")
    .depth(1)
    .status(preview ? "any" : "published")
  if (!page?.metadata?.faqs) return <></>
  return (
    <div className={className}>
      {(page?.metadata?.faqs).map((faq: FAQ) => {
        return (
          <Accordion type="single" collapsible key={faq.question}>
            <AccordionItem value="item-1">
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      })}
    </div>
  )
}
