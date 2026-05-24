import { Navbar } from "#/components/navbar"
import { Button } from '#/components/ui/button'
import { SectionLayout } from "../components/landing-layout"
import { Footer } from "#/components/footer"
import { Badge } from "#/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Thermometer, Drop, Warning, ChatIcon } from "@phosphor-icons/react"
import { Tabs } from "#/components/ui/tabs"
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field"
import { useParams } from "react-router-dom"

const spaces = [
  { 
    id: 1, 
    name: "Parque Florestal de Monsanto", 
    city: "Lisboa", 
    status: "Normal",
    image: "https://www.scenic.org/wp-content/uploads/2022/07/notable_large_urban_nature-760x378-1.jpg",
    humidity: { value: 39, status: "Normal" },
    temperature: { value: 22, status: "Normal" },
    co2: { value: 400, status: "Normal" },
    noise: { value: 45, status: "Normal" },
    wind: { value: 12, status: "Normal" },
    incidentsList: [
      { id: 101, title: "Queda de ramo junto ao trilho norte", zone: "Zona Norte", date: "2026-03-22 14:20", severity: "warning" },
      { id: 102, title: "Nível de ruído elevado persistente", zone: "Entrada Principal", date: "2026-03-23 09:10", severity: "critical" }
    ]
  },
  { 
    id: 2, 
    name: "Parque da Devesa", 
    city: "Famalicão", 
    status: "Atenção", 
    image: "https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=600",
    humidity: { value: 55, status: "Atenção" },
    temperature: { value: 19, status: "Normal" },
    co2: { value: 420, status: "Normal" },
    noise: { value: 38, status: "Normal" },
    wind: { value: 18, status: "Normal" },
    incidentsList: []
  },
  { 
    id: 3, 
    name: "Parque da Cidade", 
    city: "Porto", 
    status: "Crítico", 
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600",
    humidity: { value: 20, status: "Crítico" },
    temperature: { value: 28, status: "Atenção" },
    co2: { value: 550, status: "Crítico" },
    noise: { value: 60, status: "Atenção" },
    wind: { value: 25, status: "Normal" },
    incidentsList: [
      { id: 103, title: "Falta de água nos bebedouros", zone: "Zona Central", date: "2026-05-24 11:00", severity: "warning" }
    ]
  }
]

export function SpacePage() {    
    const { spaceId } = useParams()
    const space = spaces.find(s => s.id === Number(spaceId)) || spaces[0]

    return (
        <div>
            <Navbar />
            <img src={space.image} alt={space.name} className="w-full h-127.75 object-cover"/>
            <div className="max-w-full mx-auto px-12 py-6">
                <h4 className="font-sans tracking-widest text-xs uppercase">{space.city}</h4>
                <div className="flex gap-4 ">
                    <h1 className="text-2xl font-semibold">{space.name}</h1>
                    <Badge variant={
                        space.status === "Normal" ? "secondary" :
                        space.status === "Atenção" ? "warning" :
                        "destructive"
                    }>
                        {space.status}
                    </Badge>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-full mx-auto px-12 py-6">
                <div className="border border-border p-2 flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase">Humidade do solo</span>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium">{space.humidity.value} %</span>
                        <Badge variant={
                            space.humidity.status === "Normal" ? "secondary" :
                            space.humidity.status === "Atenção" ? "warning" :
                            "destructive"
                        }>
                            {space.humidity.status}
                        </Badge>
                    </div>
                </div>
                <div className="border border-border p-2 flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase">Temperatura</span>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium">{space.temperature.value} C</span>
                        <Badge variant={
                            space.temperature.status === "Normal" ? "secondary" :
                            space.temperature.status === "Atenção" ? "warning" :
                            "destructive"
                        }>
                            {space.temperature.status}
                        </Badge>
                    </div>
                </div>
                <div className="border border-border p-2 flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase">CO2</span>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium">{space.co2.value} ppm</span>
                        <Badge variant={
                            space.co2.status === "Normal" ? "secondary" :
                            space.co2.status === "Atenção" ? "warning" :
                            "destructive"
                        }>
                            {space.co2.status}
                        </Badge>
                    </div>
                </div>
                <div className="border border-border p-2 flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase">Ruido</span>
                    <div className="flex justify-between">
                        <span className="text-sm font-medium">{space.noise.value} dB</span>
                        <Badge variant={
                            space.noise.status === "Normal" ? "secondary" :
                            space.noise.status === "Atenção" ? "warning" :
                            "destructive"
                        }>
                            {space.noise.status}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="max-w-full mx-auto px-12 py-6">
                <Card>
                    <CardHeader >
                        <div className="flex flex-col justify-between">
                            <CardTitle>Condições meteorológicas</CardTitle>
                            <CardDescription>Atualizado há 10 minutos</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                            <div className="border border-border p-2 flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase">Temperatura</span>
                                <div className="flex items-center gap-2">
                                    <Thermometer size={20}/>
                                    <span className="text-sm font-medium">{space.temperature.value} C</span>
                                </div>
                            </div>
                            <div className="border border-border p-2 flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase">Humidade</span>
                                <div className="flex items-center gap-2">
                                    <Drop size={20}/>
                                    <span className="text-sm font-medium">{space.humidity.value} %</span>
                                </div>
                            </div>
                            <div className="border border-border p-2 flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground uppercase">Vento</span>
                                <span className="text-sm font-medium">{space.wind.value} km/h</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                                                        <option value="zona1">Zona Norte</option>
                                                        <option value="zona2">Zona Sul</option>
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