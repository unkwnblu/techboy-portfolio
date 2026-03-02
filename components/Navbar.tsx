import Link from "next/link";
import { Camera, Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white">
            <Link href="/" className="flex items-center gap-2 group">
                <Camera className="w-6 h-6 transition-transform group-hover:rotate-12" />
                <span className="text-xl font-bold tracking-tighter uppercase">Creative</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide uppercase">
                <Link href="/portfolio" className="hover:text-gray-400 transition-colors">Portfolio</Link>
                <Link href="/services" className="hover:text-gray-400 transition-colors">Services</Link>
                <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
                <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
            </div>

            <button className="md:hidden">
                <Menu className="w-6 h-6" />
            </button>
        </nav>
    );
}
