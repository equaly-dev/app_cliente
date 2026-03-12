import React, { useState } from 'react';
import {
    UserIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    BellAlertIcon,
    CreditCardIcon,
    PlusIcon,
    QuestionMarkCircleIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('Cuenta');

    const tabs = [
        { id: 'Cuenta', label: 'Configuración de Cuenta' },
        { id: 'Notificaciones', label: 'Notificaciones' },
        { id: 'Pagos', label: 'Métodos de Pago' },
        { id: 'Privacidad', label: 'Privacidad y Seguridad' }
    ];

    return (
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 text-white font-sans">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Configuración</h1>
                <p className="text-gray-400 text-sm">Administra tu cuenta, seguridad y preferencias de pago</p>
            </div>

            <div className="flex border-b border-borderC mb-8 gap-8 overflow-x-auto hide-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'text-accent border-b-2 border-accent'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-10">
                {/* Account Settings */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <UserIcon className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-bold text-white">Configuración de Cuenta</h2>
                    </div>
                    <div className="bg-surfaceDark border border-borderC rounded-2xl overflow-hidden shadow-lg">
                        <div className="flex justify-between items-center p-6 border-b border-borderC">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-card border border-borderC rounded-xl flex items-center justify-center shrink-0">
                                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Cambiar Contraseña</h4>
                                    <p className="text-gray-400 text-xs mt-1">Actualiza tu contraseña para mantener tu cuenta segura</p>
                                </div>
                            </div>
                            <button className="bg-surface hover:bg-card border border-borderC text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                                Actualizar
                            </button>
                        </div>

                        <div className="flex justify-between items-center p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-card border border-borderC rounded-xl flex items-center justify-center shrink-0">
                                    <ShieldCheckIcon className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-white font-bold text-sm">Autenticación de Dos Factores</h4>
                                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">ACTIVO</span>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-1">Añade una capa extra de seguridad a tu cuenta</p>
                                </div>
                            </div>
                            <button className="bg-surface hover:bg-card border border-borderC text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                                Configurar
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <BellAlertIcon className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-bold text-white">Notificaciones</h2>
                    </div>
                    <div className="bg-surfaceDark border border-borderC rounded-2xl overflow-hidden shadow-lg">

                        <div className="flex justify-between items-center p-6 border-b border-borderC">
                            <div>
                                <h4 className="text-white font-bold text-sm">Notificaciones por Correo</h4>
                                <p className="text-gray-400 text-xs mt-1">Recibe reportes de transacciones y alertas por correo</p>
                            </div>
                            {/* Toggle Switch */}
                            <button className="w-12 h-6 rounded-full bg-accent relative transition-colors focus:outline-none flex items-center shadow-inner">
                                <span className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm transition-transform"></span>
                            </button>
                        </div>

                        <div className="flex justify-between items-center p-6">
                            <div>
                                <h4 className="text-white font-bold text-sm">Alertas Push</h4>
                                <p className="text-gray-400 text-xs mt-1">Notificaciones móviles instantáneas para actividad</p>
                            </div>
                            {/* Toggle Switch Off */}
                            <button className="w-12 h-6 rounded-full bg-surface border border-borderC relative transition-colors focus:outline-none flex items-center shadow-inner">
                                <span className="w-4 h-4 bg-gray-400 rounded-full absolute left-1 shadow-sm transition-transform"></span>
                            </button>
                        </div>

                    </div>
                </section>

                {/* Payment Methods */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <CreditCardIcon className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-bold text-white">Métodos de Pago</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-accent rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] min-h-[180px] flex flex-col justify-between">
                            {/* Card visual elements */}
                            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-tl-full translate-x-1/4 translate-y-1/4"></div>

                            <div className="relative z-10 flex justify-between items-start mb-auto">
                                <div className="w-10 h-6 bg-white/20 rounded-md"></div>
                                <span className="text-white text-[10px] font-bold tracking-wider">TARJETA PRIMARIA</span>
                            </div>

                            <div className="relative z-10 mt-6">
                                <div className="text-white font-mono text-xl tracking-widest mb-4">
                                    •••• •••• •••• 4242
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-white/80 text-xs tracking-widest uppercase">JUAN PEREZ</span>
                                    <span className="text-white text-sm font-bold">12/26</span>
                                </div>
                            </div>
                        </div>

                        <button className="bg-surfaceDark border border-dashed border-borderC hover:border-gray-500 rounded-2xl flex flex-col items-center justify-center p-8 transition-colors group min-h-[180px]">
                            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                                <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                            </div>
                            <span className="text-sm font-bold text-white">Conectar Nueva Billetera/Tarjeta</span>
                        </button>

                    </div>
                </section>

                {/* Privacy & Security */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <EyeSlashIcon className="w-5 h-5 text-accent" />
                        <h2 className="text-lg font-bold text-white">Privacidad</h2>
                    </div>

                    <div className="bg-surfaceDark border border-borderC rounded-2xl overflow-hidden shadow-lg">

                        <div className="flex items-start gap-4 p-6 border-b border-borderC">
                            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-sm">Compartir Datos</h4>
                                <p className="text-gray-400 text-xs mt-1 mb-4">Elige qué información compartes con aplicaciones de terceros y socios.</p>
                                <a href="#" className="text-accent text-sm font-bold hover:text-accentHover transition-colors">
                                    Gestionar Permisos
                                </a>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-6 bg-surface/30">
                            <div>
                                <h4 className="text-red-400 font-bold text-sm">Eliminar Cuenta</h4>
                                <p className="text-gray-400 text-xs mt-1">Elimina permanentemente todos tus datos y transacciones</p>
                            </div>
                            <button className="bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-bold transition">
                                Desactivar
                            </button>
                        </div>

                    </div>
                </section>

            </div>

            <div className="mt-16 pt-6 border-t border-borderC/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 mb-4">
                <p>© 2026 Equaly Technologies Inc.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
                    <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                    <a href="#" className="hover:text-white transition-colors">Configuración de Cookies</a>
                </div>
            </div>

        </div>
    );
}
