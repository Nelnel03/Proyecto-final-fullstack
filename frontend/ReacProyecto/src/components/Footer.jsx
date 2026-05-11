import React from 'react'
import { Facebook, Instagram, Phone } from 'lucide-react'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="main-footer">
        {/* Decoración sutil de fondo */}
        <div className="footer-decor"></div>
        
        <div className="footer-container">
            <div className="footer-logo-section">
                <img src="/src/assets/logo.png" alt="Logo" className="footer-logo-img" />
                <div className="footer-brand">
                    <h3 className="footer-title">BioMon ADI</h3>
                    <p className="footer-subtitle">BIOMON ADI | LA ANGOSTURA</p>
                </div>
            </div>
            
            <p className="footer-description">
                Preservando la rica biodiversidad de Puntarenas. Nuestra flora y fauna son el corazón de La Angostura. ¡Sé parte del cambio hoy mismo!
            </p>

            <div className="footer-contact-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#c6f6d5', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '500' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={20} />
                    <span>Teléfono: +506 2257 9060</span>
                </div>
                <a href="https://wa.me/50683999999" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    <span>WhatsApp: +506 8399 9999</span>
                </a>
            </div>

            <div className="footer-socials">
                <a href="https://www.facebook.com/Coopenae/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                   <Facebook size={24} />
                </a>
                <a href="https://www.instagram.com/coopenaecr/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                   <Instagram size={24} />
                </a>
                <a href="https://www.tiktok.com/@coopenaecr" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="TikTok">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02C13.812 0 15.097.01 16.38 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.24-2.42 1.25-4.8 3.42-5.71 1.05-.44 2.21-.57 3.32-.43v4.02c-.89-.13-1.83.17-2.5.76-.7.62-1.05 1.59-1.01 2.53.04 1.22.86 2.37 2.02 2.78 1.15.42 2.49.26 3.47-.45.89-.66 1.4-1.74 1.43-2.84 0-4.66.01-9.33.01-14z"/></svg>
                </a>
            </div>

            <div className="footer-bottom">
                <div className="footer-dot"></div>
                <p className="footer-copy">
                    &copy; {new Date().getFullYear()} ADI La Angostura. Con amor por nuestra tierra.
                </p>
                <div className="footer-dot"></div>
            </div>
        </div>
    </footer>
  )
}

export default Footer