/**
 * Renders one or more JSON-LD structured-data blocks. Server component
 * — emitted into the page HTML so crawlers pick it up without running
 * JS. Content is our own structured data (not user input), so the
 * stringify-into-script pattern is safe here.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
