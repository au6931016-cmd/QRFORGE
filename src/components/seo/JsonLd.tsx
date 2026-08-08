interface JsonLdProps {
  data: object;
}

/**
 * Renders a JSON-LD <script> tag. `data` is always produced by our own
 * lib/seo/json-ld.ts builders (never raw user input), so serializing it
 * into a script tag here is safe.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
