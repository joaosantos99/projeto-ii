import { useSearchParams } from "react-router-dom"

function Tabs({ tabs }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const tab = searchParams.get("tab") ?? tabs[0].id
    return (
        <div>
            <div className="flex mb-6">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSearchParams({ tab: t.id})}
                        className={tab === t.id
                            ? "px-4 pb-2 text-sm border-b-2 border-foreground font-medium"
                            : "px-4 pb-2 text-sm text-muted-foreground"
                        }
                    >
                        <span className="flex items-center gap-2">
                            {t.icon && <t.icon />}
                            {t.label}
                        </span>

                    </button>
                ))}
            </div>
            <div>
                {tabs.map((t) => tab === t.id && <div key={t.id}>{t.content}</div>)}
            </div>
        </div>

    )
}

export { Tabs }
