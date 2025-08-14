interface SettingsHeaderProps {
  title: string
  description?: string
}

export function SettingsHeader({ title, description }: SettingsHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  )
}