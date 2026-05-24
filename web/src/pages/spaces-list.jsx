import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { KpisWidget } from "../components/widgets/kpis-widget"
import { MapPin, Rows, CheckCircle, Buildings } from "@phosphor-icons/react"
import { SpacesWidget } from "#/components/widgets/spaces-widget"

const kpis = [
  {
    title: "Espaços registados",
    value: "34",
    description: "Espaços verdes do município",
    Icon: MapPin,
  },
  {
    title: "Zonas mapeadas",
    value: "28",
    description: "Subdivisões por espaço",
    Icon: Rows,
  },
  {
    title: "Activos",
    value: "6",
    description: "Estado operacional normal",
    Icon: CheckCircle,
  },
  {
    title: "Distritos",
    value: "4",
    description: "Cobertura geográfica",
    Icon: Buildings,
  },
]

export function SpacesListPage() {
    const { setTitle } = useOutletContext()
    useEffect(() => {
        setTitle("Utilizadores")
    }, [setTitle])

    return (
        <div className="flex flex-col gap-4">
            <KpisWidget kpis={kpis} />
            <SpacesWidget />
        </div>
    )
}