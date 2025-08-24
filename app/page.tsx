'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-12 h-12 bg-electric-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">ME</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Multi Electric Supply</h1>
                  <p className="text-sm text-gray-500">Professional Electrical Solutions</p>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Link href="/cuenta" className="p-2 text-gray-600 hover:text-electric-600">
                <UserIcon className="h-6 w-6" />
              </Link>
              <Link href="/carrito" className="p-2 text-gray-600 hover:text-electric-600 relative">
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-electric-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link href="/login" className="btn-primary">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-electric-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12 items-center">
            <Link href="/productos" className="hover:text-electric-200 transition-colors">
              Todos los Productos
            </Link>
            <Link href="/productos/cables" className="hover:text-electric-200 transition-colors">
              Cables
            </Link>
            <Link href="/productos/interruptores" className="hover:text-electric-200 transition-colors">
              Interruptores
            </Link>
            <Link href="/productos/iluminacion" className="hover:text-electric-200 transition-colors">
              Iluminación
            </Link>
            <Link href="/productos/herramientas" className="hover:text-electric-200 transition-colors">
              Herramientas
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-electric-600 to-electric-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Suministros Eléctricos Profesionales
            </h2>
            <p className="text-xl mb-8 text-electric-100">
              Calidad, confiabilidad y servicio experto para todos sus proyectos eléctricos
            </p>
            <Link href="/productos" className="bg-white text-electric-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ver Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Productos Destacados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Imagen del Producto</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Producto Ejemplo {item}</h4>
                <p className="text-gray-600 text-sm mb-3">Descripción del producto eléctrico profesional</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-electric-600">$99.99</span>
                  <button className="btn-primary text-sm">Agregar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-electric-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Productos de Calidad</h4>
              <p className="text-gray-600">Suministros eléctricos de las mejores marcas del mercado</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-electric-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚚</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Recogida Rápida</h4>
              <p className="text-gray-600">Sistema de pedidos con recogida en tienda eficiente</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-electric-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Servicio Experto</h4>
              <p className="text-gray-600">Asesoramiento profesional para sus proyectos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">Multi Electric Supply</h5>
              <p className="text-gray-400 text-sm">
                Su socio confiable en suministros eléctricos profesionales
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Productos</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/productos/cables">Cables</Link></li>
                <li><Link href="/productos/interruptores">Interruptores</Link></li>
                <li><Link href="/productos/iluminacion">Iluminación</Link></li>
                <li><Link href="/productos/herramientas">Herramientas</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Servicio</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contacto">Contacto</Link></li>
                <li><Link href="/ayuda">Ayuda</Link></li>
                <li><Link href="/devoluciones">Devoluciones</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Cuenta</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/login">Iniciar Sesión</Link></li>
                <li><Link href="/registro">Registrarse</Link></li>
                <li><Link href="/cuenta">Mi Cuenta</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Multi Electric Supply. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
