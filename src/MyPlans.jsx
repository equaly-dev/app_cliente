import React, { useState, useEffect } from 'react';
import { ClockIcon, PlusIcon, StarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function MyPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('equaly_token');
                const response = await fetch('https://api.equaly.co/api/user/plans', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('No se pudo cargar la información de los planes');
                }
                const data = await response.json();
                if (data.success) {
                    setPlans(data.plans);
                } else {
                    throw new Error(data.error);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const calculateDaysActive = (purchaseDateStr) => {
        const t1 = new Date(purchaseDateStr).getTime();
        const t2 = new Date().getTime();
        const diff = t2 - t1;
        return Math.floor(diff / (1000 * 3600 * 24));
    };

    const getPlanName = (name) => {
        const n = String(name).toLowerCase();
        if (n.includes('oro')) return 'Oro Élite';
        if (n.includes('plata')) return 'Plata';
        if (n.includes('bronce')) return 'Bronce';
        return name;
    };

    return (
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 text-white font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Planes de Inversión</h1>
                    <p className="text-gray-400 text-sm">Gestiona tu rendimiento actual y explora mejoras de nivel.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-surface border border-borderC px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition flex gap-2 items-center">
                        <ClockIcon className="w-4 h-4" /> Historial
                    </button>
                    <button className="bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)] transition flex gap-2 items-center">
                        <PlusIcon className="w-4 h-4" strokeWidth={3} /> Nueva Inversión
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Mis Planes Activos</h2>
            </div>

            {loading && <p className="text-gray-400 mb-6">Cargando tus planes...</p>}

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && plans.length === 0 && (
                <p className="text-gray-400 mb-6">Aún no tienes planes comprados.</p>
            )}

            {!loading && !error && plans.map(plan => {
                const isGold = String(plan.plan_name).toLowerCase().includes('oro');
                const isSilver = String(plan.plan_name).toLowerCase().includes('plata');

                const planTitle = getPlanName(plan.plan_name);
                const roi = parseFloat(plan.daily_percentage).toFixed(2);
                const days = calculateDaysActive(plan.purchase_date);
                const startDateStr = new Date(plan.purchase_date).toLocaleDateString('es-ES');

                return (
                    <div key={plan.user_plan_id} className="bg-card border border-borderC rounded-xl overflow-hidden mb-6">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 bg-surfaceDark border-b md:border-b-0 md:border-r border-borderC p-8 flex flex-col justify-center items-center relative overflow-hidden">
                                <div className="absolute bottom-0 w-full flex items-end justify-center gap-1 opacity-10">
                                    {[10, 20, 15, 30, 25, 40, 20, 15, 25, 30].map((h, i) => (
                                        <div key={i} className={`w-3 ${isGold ? 'bg-yellow-400' : isSilver ? 'bg-gray-300' : 'bg-accent'}`} style={{ height: `${h}px` }}></div>
                                    ))}
                                </div>

                                <div className="w-12 h-12 bg-surface border border-borderC rounded-full flex items-center justify-center mb-4 relative z-10 shadow-lg" style={{ boxShadow: `0 0 15px ${isGold ? 'rgba(250,204,21,0.2)' : 'rgba(59,130,246,0.2)'}` }}>
                                    <StarIcon className={`w-6 h-6 ${isGold ? 'text-yellow-400' : isSilver ? 'text-gray-300' : 'text-accent'}`} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Plan {planTitle}</h3>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider border border-emerald-500/30 relative z-10 flex flex-col items-center">
                                    <span>ACTIVO</span>
                                    <span className="text-[9px] font-normal lowercase tracking-tight mt-0.5 opacity-80">Comprado: {startDateStr}</span>
                                </span>
                            </div>

                            <div className="md:w-2/3 p-8 flex flex-col justify-between">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 mt-2">
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold tracking-wider mb-2">ROI DIARIO</p>
                                        <p className="text-2xl font-bold text-white">{roi}%</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold tracking-wider mb-2">DÍAS ACTIVO</p>
                                        <p className="text-2xl font-bold text-white">{days} Días</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold tracking-wider mb-2">INV. INICIAL</p>
                                        <p className="text-2xl font-bold text-white">${parseFloat(plan.amount_invested).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold tracking-wider mb-2">TOTAL GANADO</p>
                                        <p className="text-2xl font-bold text-emerald-400">${parseFloat(plan.total_earned).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-borderC/50 pt-6">
                                    <div className="flex-1 max-w-sm flex items-center gap-4">
                                        <div className="w-full bg-surfaceDark rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.max(1, (parseFloat(plan.total_earned) / parseFloat(plan.amount_invested)) * 100))}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap min-w-max">Progreso ROI</span>
                                    </div>
                                    <button className="bg-accent hover:bg-accentHover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition">
                                        Gestionar Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="flex items-center gap-2 mb-4 mt-10">
                <div className="w-1.5 h-6 bg-gray-400 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Mejoras Disponibles</h2>
            </div>
            {/* Omito las tarjetas de Mejoras Disponibles para ser conciso, en un dashboard real se cargarían de la bdd */}
            <p className="text-gray-400 text-sm mb-6">Explora otros planes superiores disponibles en nuestra plataforma y aumenta tus rendimientos.</p>
        </div >
    );
}
