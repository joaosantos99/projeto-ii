import { Link } from "react-router-dom"
import { Button } from "#/components/ui/button"
import logo from "#/assets/logo.svg"

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-12 py-4">
            <div className="flex align-center gap-2">
                <div>
                    <img src={logo} alt="logo" />
                </div>
                <div>
                    <div className="font-serif">Green Space</div>
                    <div className="font-sans tracking-widest text-xs uppercase">Monitorização ambiental</div>
                </div>
            </div>

            <Button asChild variant="default" size="default">
                <Link to="/admin">Portal do municipio</Link>
            </Button>
        </nav>
    )
}