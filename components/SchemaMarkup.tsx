import Script from 'next/script';

interface SchemaMarkupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemas: any[];
}

export default function SchemaMarkup({ schemas }: SchemaMarkupProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`schema-markup-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
          strategy="beforeInteractive"
        />
      ))}
    </>
  );
}