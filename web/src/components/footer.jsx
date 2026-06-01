import logo from "#/assets/logo.svg"
import { Link } from "react-router-dom"

export function Footer() {
    return (
        <footer>
            <hr className="border-0 h-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))' }} />            
            <div className="flex items-center justify-between px-12 py-6">
                <div className="flex align-center gap-2">
                    <div>
                        <img src={logo} alt="logo" />
                    </div>
                    <div>
                        <div className="font-serif">Green Space</div>
                        <div className="font-sans tracking-widest text-xs uppercase">Monitorização ambiental</div>
                    </div>
                </div>

                <div className="flex gap-4 ">
                    <Link to="/" className="text-sm">Início</Link>
                    <Link to="/admin" className="text-sm">Portal do município</Link>
                </div>
            </div>

        </footer>
    )
}