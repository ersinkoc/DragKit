interface IDEWindowProps {
  fileName?: string
  children: React.ReactNode
}

export function IDEWindow({ fileName = 'index.ts', children }: IDEWindowProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-muted-foreground ml-2">{fileName}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}
