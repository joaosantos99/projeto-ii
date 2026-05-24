export function  SectionLayout({title, description, children}) {
    return (
        <div className="max-w-full mx-auto p-12">
            <div className="flex flex-col gap-2 mb-6">
                <h3 className="font-landing text-xl">{title}</h3>
                <p className="text-xs">{description}</p>
            </div>
            {children}
        </div>

    )
}