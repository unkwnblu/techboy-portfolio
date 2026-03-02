"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: "Portfolio", href: "/portfolio" },
        { name: "Services", href: "/services" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${mobileMenuOpen || !scrolled
                    ? "bg-transparent py-6"
                    : "bg-black/90 backdrop-blur-md py-4 border-b border-white/10"
                    } ${!scrolled && !mobileMenuOpen ? "mix-blend-difference" : ""} text-white`}
            >
                <div className="flex items-center justify-between px-8 max-w-7xl mx-auto relative z-[60]">
                    <Link href="/" className="flex items-center group" onClick={() => setMobileMenuOpen(false)}>
                        <img
                            src="/logo.svg"
                            alt="Techboy"
                            className="h-12 w-auto transition-opacity group-hover:opacity-80"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide uppercase z-[60]">
                        {navLinks.map(link => (
                            <Link key={link.name} href={link.href} className="hover:text-gray-400 transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="md:hidden z-[60] relative"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed top-0 left-0 w-screen h-[100dvh] bg-black z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
            >
                {/* Logo in mobile menu */}
                <div className="absolute top-6 left-8">
                    <img src="/logo.svg" alt="Techboy" className="h-12 w-auto" />
                </div>

                <div className="flex flex-col items-center gap-8 text-2xl font-bold uppercase tracking-widest mt-16">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="hover:text-gray-400 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms'
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
