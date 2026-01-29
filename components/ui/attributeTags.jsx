export default function AttributeTags(attributes) {
  return (
    <div className="flex flex-wrap gap-1">
      {attributes.attributes.map(attribute => (
        <div key={attribute} className="px-5 font-mono bg-light-grey text-dark-grey rounded-sm">
          {attribute}
        </div>
      ))}
    </div>
  )
}