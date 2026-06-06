export default function PlaceholderPage({ title, description }) {
  return (
    <div className="mx-auto max-w-3xl space-y-2 py-12 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <p className="text-sm text-muted-foreground">Sezione in arrivo.</p>
    </div>
  )
}
