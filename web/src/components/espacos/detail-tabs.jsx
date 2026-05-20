'use client'

export function DetailTabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-md bg-muted/40 p-1">
      {tabs.map((tab) => {
        const isActive = tab.value === active
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-background font-medium text-foreground shadow-xs"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            ].join(" ")}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}