import { useEffect, useState } from "react"
import { Navbar } from "#/components/navbar"
import { Button } from '#/components/ui/button'
import { SectionLayout } from "../components/landing-layout"
import { Footer } from "#/components/footer"
import { Badge } from "#/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Warning, ChatIcon } from "@phosphor-icons/react"
import { Tabs } from "#/components/ui/tabs"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { useParams } from "react-router-dom"
import { api } from "#/lib/api"

function SensorMetric({ label, data }) {
    const hasSensors = data && data.count > 0
    const range = hasSensors && data.minValue != null && data.maxValue != null
        ? `${data.minValue}–${data.maxValue}${data.unit ? ` ${data.unit}` : ""}`
        : "—"

    return (
        <div className="border border-border p-2 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase">{label}</span>
            <div className="flex justify-between">
                <span className="text-sm font-medium">{range}</span>
                <Badge variant={hasSensors ? (data.activeCount > 0 ? "outline" : "warning") : "outline"}>
                    {hasSensors ? `${data.activeCount}/${data.count} ativos` : "—"}
                </Badge>
            </div>
        </div>
    )
}

export function SpacePage() {
    const { id } = useParams()
    const [space, setSpace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.get(`/spaces/${id}`, { params: { includeZones: true, includeReports: true, sensorsSummary: true } })
            .then((res) => setSpace(res.data))
            .catch((err) => setError(err.response?.data?.error || "Erro ao carregar espaço"))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="bg-[#F8F5F0] min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        )
    }

    if (error || !space) {
        return (
            <div className="bg-[#F8F5F0] min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">{error || "Espaço não encontrado"}</p>
            </div>
        )
    }

    return (
        <div className="bg-[#F8F5F0]">
            <Navbar />
            <img src={space.imageUrl} alt={space.name} className="w-full h-127.75 object-cover"/>
            <div className="max-w-full mx-auto px-12 py-6">
                <h4 className="font-sans tracking-widest text-xs uppercase">{space.parish}</h4>
                <div className="flex gap-4 ">
                    <h1 className="text-2xl font-semibold">{space.name}</h1>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-full mx-auto px-12 py-6">
                <SensorMetric label="Humidade do solo" data={space.sensorsSummary?.soilMoisture} />
                <SensorMetric label="Temperatura" data={space.sensorsSummary?.temperature} />
                <SensorMetric label="CO2" data={space.sensorsSummary?.co2} />
                <SensorMetric label="Ruido" data={space.sensorsSummary?.noise} />
            </div>
            <SectionLayout title="Feedback e incidentes">
                <Tabs tabs={[
                    { id: "incidents", label: "Incidentes", icon: Warning, content:
                        <div className="flex flex-col gap-6">
                            <Card>
                                <CardHeader >
                                    <div className="flex flex-col">
                                        <CardTitle>Novo relatório de incidente</CardTitle>
                                        <CardDescription>Registe uma ocorrência com zona e nível de severidade.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                    }}>
                                        <FieldGroup>
                                            <div className="grid md:grid-cols-2 gap-2">
                                                <Field>
                                                    <FieldLabel>Zona</FieldLabel>
                                                    <select className="h-8 w-full border border-input bg-transparent px-2.5 py-1 text-xs outline-none">
                                                        <option value="">Selecionar zona</option>
                                                        {space.zones?.map((zone) => (
                                                            <option key={zone.id} value={zone.id}>{zone.name}</option>
                                                        ))}
                                                    </select>
                                                </Field>
                                                <Field>
                                                    <FieldLabel>Severidade</FieldLabel>
                                                    <select className="h-8 w-full border border-input bg-transparent px-2.5 py-1 text-xs outline-none">
                                                        <option value="">Selecionar severidade</option>
                                                        <option value="warning">Warning</option>
                                                        <option value="critical">Critical</option>
                                                    </select>
                                                </Field>
                                            </div>
                                            <Field>
                                                <FieldLabel>Descrição do incidente</FieldLabel>
                                                <textarea
                                                    className="w-full border border-input p-2 text-xs placeholder:text-muted-foreground resize-none"
                                                    placeholder="Impacto, contexto e outros detalhes relevantes."
                                                    rows={5}
                                                />
                                            </Field>
                                        </FieldGroup>
                                        <div className="flex gap-2 justify-end mt-6">
                                            <Button variant="outline">
                                                Cancelar
                                            </Button>
                                            <Button>
                                                Submeter incidente
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader >
                                    <div className="flex flex-col">
                                        <CardTitle>Relatórios recentes</CardTitle>
                                        <CardDescription>Incidentes associados a este espaço.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-3">
                                        {space.reports?.length > 0 ? (
                                            space.reports.map((report) => (
                                                <div key={report.id} className="border border-border p-3 flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">{report.name}</span>
                                                        <Badge variant={
                                                            report.status === "open" ? "warning" :
                                                            report.status === "resolved" ? "secondary" :
                                                            "outline"
                                                        }>
                                                            {report.status}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{report.type}</span>
                                                    <p className="text-xs">{report.description}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Nenhum relatório registado.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    },
                    { id: "feedback", label: "Feedback", icon: ChatIcon, content:
                        <Card>
                            <CardHeader >
                                <div className="flex flex-col">
                                    <CardTitle>Feedback</CardTitle>
                                    <CardDescription>Observações sobre o espaço, sugestões ou comentários que não são uma ocorrência urgente.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                }}>
                                    <Field>
                                        <FieldLabel>A sua mensagem</FieldLabel>
                                        <textarea
                                            className="w-full border border-input p-2 text-xs placeholder:text-muted-foreground resize-none"
                                            placeholder="Impacto, contexto e outros detalhes relevantes."
                                            rows={5}
                                        />
                                    </Field>
                                    <div className="flex gap-2 justify-end mt-6">
                                        <Button variant="outline">
                                            Cancelar
                                        </Button>
                                        <Button>
                                            Submeter feedback
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    }
                ]} />
            </SectionLayout>
            <Footer />
        </div>
    )
}
