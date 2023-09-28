"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import {
  addAuthorObjectType,
  addBlogObjectType,
  addCategoriesObjectType,
  addPagesObjectType,
  cosmicTargetBucketConfig,
  getBlogMetafields,
  getFAQMetafields,
  getPageBuilderMetafields,
  getSEOMetafields,
} from "@/lib/cosmic"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

// Types
type FeaturesProps = {
  targetBucket: {
    bucket_slug: string
    read_key: string
    write_key: string
  }
}

// Set the target Object type. This will change to selectable.
const OBJECT_TYPE = "test-target"

function featureInfo(featureKey: string) {
  let title
  let type
  switch (featureKey) {
    case "seo":
      title = "SEO"
      type = "metafields"
      break
    case "faqs":
      title = "FAQs"
      type = "metafields"
      break
    case "page_builder":
      title = "Page Builder"
      type = "object_type"
      break
    case "blog":
      title = "Blog"
      type = "object_type"
      break
  }
  return {
    title,
    type,
  }
}

export function Features({ targetBucket }: FeaturesProps) {
  const cosmicTargetBucket = cosmicTargetBucketConfig(
    targetBucket.bucket_slug,
    targetBucket.read_key,
    targetBucket.write_key
  )

  const [showModal, setShowModal] = useState<boolean>(false)
  const [featureKey, setFeatureKey] = useState<string>("")
  const [installedFeatures, setInstalledFeature] = useState<string[]>([])
  function InstallDialog() {
    const [installing, setInstalling] = useState<boolean>(false)
    const { toast } = useToast()
    return (
      <Dialog open onOpenChange={() => setShowModal(false)}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={() => setShowModal(false)}
          onEscapeKeyDown={() => setShowModal(false)}
        >
          <DialogHeader>
            <DialogTitle>Install {featureInfo(featureKey).title}</DialogTitle>
            <DialogDescription>
              {featureInfo(featureKey).type === "metafields" ? (
                <>
                  <div className="mb-4">
                    Which existing Object type would you like to add this
                    feature to? You can also{" "}
                    <a
                      href={`https://app.cosmicjs.com/${targetBucket.bucket_slug}/object-types/new`}
                      target="_parent"
                      className="text-cosmic-blue"
                    >
                      create a new Object type
                    </a>
                  </div>
                  <div className="mb-4">ADD SELECT OBJECT TYPE LIST HERE</div>
                  <div className="mb-4">
                    <div className="mb-2">Add Object type slug here:</div>
                    <Input type="text" placeholder="Object type slug" />
                  </div>
                </>
              ) : (
                <>Are you sure you want to add this feature to your Project?</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              disabled={installing}
              onClick={async () => {
                setInstalling(true)
                try {
                  await installFeature()
                  setInstalledFeature([...installedFeatures, featureKey])
                } catch (err) {}
                setInstalling(false)
                setShowModal(false)
                toast({
                  title: "Success!",
                  description: `${featureInfo(featureKey).title} installed`,
                })
              }}
            >
              {installing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Installing...
                </>
              ) : (
                `Install ${featureInfo(featureKey).title}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  async function installMetafields() {
    // Get the selected Object type metafields
    const {
      object_type: { metafields },
    } = await cosmicTargetBucket.objectTypes.findOne(OBJECT_TYPE)

    // Get new Metafields
    let newMetafields
    if (featureKey === "seo") newMetafields = await getSEOMetafields()
    if (featureKey === "faqs") newMetafields = await getFAQMetafields()

    const keyArr = newMetafields.map((obj: any) => obj.key)

    // Check for the metafields existing
    let metafieldClash
    for (const metafield of metafields) {
      if (keyArr.indexOf(metafield.key) !== -1) {
        throw Error
      }
    }
    // Check for metafield key exists then add to the top of the Metafields array
    if (!metafieldClash) {
      await cosmicTargetBucket.objectTypes.updateOne(OBJECT_TYPE, {
        metafields: [...newMetafields, ...metafields],
      })
    }
  }

  async function installObjectType() {
    let metafields
    if (featureKey === "page_builder") {
      metafields = await getPageBuilderMetafields()
      const seoMetafields = await getSEOMetafields()
      await addPagesObjectType(cosmicTargetBucket, [
        ...metafields,
        ...seoMetafields,
      ])
    }
    if (featureKey === "blog") {
      await addAuthorObjectType(cosmicTargetBucket)
      await addCategoriesObjectType(cosmicTargetBucket)
      metafields = await getBlogMetafields()
      const seoMetafields = await getSEOMetafields()
      await addBlogObjectType(cosmicTargetBucket, [
        ...metafields,
        ...seoMetafields,
      ])
    }
  }

  async function installFeature() {
    try {
      if (featureInfo(featureKey).type === "metafields")
        await installMetafields()
      else await installObjectType()
    } catch (err) {}
  }

  function handleInstallClick(key: string) {
    setShowModal(true)
    setFeatureKey(key)
  }

  type Props = {
    children: React.ReactNode
  }

  function Card({ children }: Props) {
    return <div className="mb-10 rounded-xl border p-6">{children}</div>
  }

  return (
    <div>
      <Card>
        <h2 className="mb-4 text-2xl font-semibold">📝 Blog</h2>
        <div className="mb-4">
          <p className="text-lg text-gray-800 dark:text-dark-gray-800">
            Adds a blog to your Project. Installs the following new Object
            types: `blog-posts`,`authors`, and `categories`. Blog fields
            include:
          </p>
        </div>
        <div className="mb-6">
          <ol className="list-decimal pl-8">
            <li>Hero image</li>
            <li>Content in Markdown</li>
            <li>Author Object relationship Metafield</li>
            <li>Categories Object relationship Metafield</li>
            <li>SEO fields (see below)</li>
          </ol>
        </div>
        {installedFeatures.indexOf("blog") !== -1 ? (
          <Button variant="secondary" disabled>
            Installed ✅
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => handleInstallClick("blog")}
          >
            Install Blog Feature
          </Button>
        )}
      </Card>
      <Card>
        <h2 className="mb-4 text-2xl font-semibold">📄 Page Builder</h2>
        <div className="mb-4">
          <p className="text-lg text-gray-800 dark:text-dark-gray-800">
            Adds a `pages` Object type to your Bucket with a page builder.
            Fields include:
          </p>
        </div>
        <div className="mb-6">
          <ol className="list-decimal pl-8">
            <li>Hero image</li>
            <li>Rich text content</li>
            <li>
              Repeating layouts in: 1 column and alternating 2 columns with
              headline, image, and rich text content.
            </li>
            <li>SEO fields (see below)</li>
          </ol>
        </div>
        {installedFeatures.indexOf("page_builder") !== -1 ? (
          <Button variant="secondary" disabled>
            Installed ✅
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => handleInstallClick("page_builder")}
          >
            Install Page Builder
          </Button>
        )}
      </Card>
      <Card>
        <h2 className="mb-4 text-2xl font-semibold">🔍 SEO fields</h2>
        <div className="mb-4">
          <p className="text-lg text-gray-800 dark:text-dark-gray-800">
            Adds SEO fields to existing Object type.
          </p>
        </div>
        <div className="mb-6">
          <p>
            Parent Metafield with key <code>seo</code> with the following
            children:
          </p>
          <ol className="list-decimal pl-8">
            <li>SEO Title</li>
            <li>SEO Description</li>
            <li>OG title</li>
            <li>OG description</li>
            <li>OG image</li>
          </ol>
        </div>
        {installedFeatures.indexOf("seo") !== -1 ? (
          <Button variant="secondary" disabled>
            Installed ✅
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => handleInstallClick("seo")}>
            Install SEO
          </Button>
        )}
      </Card>
      <Card>
        <h2 className="mb-4 text-2xl font-semibold">❓ FAQs</h2>
        <div className="mb-4">
          <p className="text-lg text-gray-800 dark:text-dark-gray-800">
            Add FAQs to existing Object type. Fields include:
          </p>
        </div>
        <div className="mb-6">
          <p>
            Repeater Metafield with key <code>faqs</code> with the following
            children:
          </p>
          <ol className="list-decimal pl-8">
            <li>Question</li>
            <li>Answer</li>
          </ol>
        </div>
        {installedFeatures.indexOf("faqs") !== -1 ? (
          <Button variant="secondary" disabled>
            Installed ✅
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => handleInstallClick("faqs")}
          >
            Install FAQs
          </Button>
        )}
      </Card>
      {showModal && <InstallDialog />}
      <Toaster />
    </div>
  )
}
