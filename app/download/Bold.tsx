/**
 * Renders the `**bold**` spans that the download copy carries.
 *
 * The install steps are the one place on this site where emphasis is load-bearing rather
 * than decorative: "right-click **Codepet** and choose **Open**" is an instruction someone
 * follows with a trackpad, and the bold words are the targets. Splitting the strings into
 * pre-bolded fragments in the JSON would mean the translator has to reassemble a sentence
 * out of an array, which is how word order gets wrong in the language that needs it most.
 *
 * Deliberately NOT a markdown library. The whole grammar is `**…**`, the input is our own
 * translation file rather than anything a user typed, and pulling in a parser to render
 * six phrases would ship kilobytes to do less safely — a markdown renderer accepts links
 * and raw HTML, which is exactly the surface this does not want.
 */
export function Bold({ text }: { text: string }) {
  // Capturing split: odd indices are the contents of a `**…**` pair. An unmatched `**`
  // simply never produces an odd index, so it renders as literal text rather than eating
  // the rest of the sentence.
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold text-heading">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}
