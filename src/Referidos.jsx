import React, { useState, useEffect } from 'react';
import { UserPlusIcon, UsersIcon, CurrencyDollarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Referidos() {
    const [referrals, setReferrals] = useState([]);
    const [totalEarned, setTotalEarned] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const response = await fetch('https://api.equaly.co/api/user/referrals', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('equaly_token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setReferrals(data.referrals);
                    setTotalEarned(data.total_earned);
                }
            } catch (err) {
                console.error("Error cargando referidos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReferrals();
    }, []);

    return (
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 text-white font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Mis Referidos</h1>
                    <p className="text-gray-400 text-sm">Gestiona tus vinculados y visualiza tus ganancias por comisión (5% por valor de ingreso).</p>
                </div>
                <button className="bg-surface border border-accent text-accent px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-accent/10 transition flex gap-2 items-center">
                    <UserPlusIcon className="w-5 h-5" /> Invitar Amigos
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-surfaceDark border border-borderC rounded-2xl p-6 relative overflow-hidden shadow-lg flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                        <UsersIcon className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Vinculados</p>
                        <p className="text-3xl font-extrabold text-white">{loading ? '...' : referrals.length}</p>
                    </div>
                    <div className="absolute right-0 top-0 opacity-5 w-32 h-32 bg-accent rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                </div>

                <div className="bg-surfaceDark border border-borderC rounded-2xl p-6 relative overflow-hidden shadow-lg flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <CurrencyDollarIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Comisiones Ganadas</p>
                        <p className="text-3xl font-extrabold text-emerald-400">${loading ? '...' : Number(totalEarned).toFixed(2)}</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-5 w-32 h-32 bg-emerald-500 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>
                </div>
            </div>

            <div className="bg-surface border border-borderC rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                    <h2 className="text-lg font-bold text-white">Lista de Vinculados</h2>
                </div>

                {loading ? (
                    <div className="text-gray-400 py-10 text-center">Cargando datos...</div>
                ) : referrals.length === 0 ? (
                    <div className="border border-dashed border-borderC rounded-xl p-10 flex flex-col items-center justify-center text-center">
                        <UserPlusIcon className="w-12 h-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Aún no tienes referidos</h3>
                        <p className="text-gray-400 text-sm max-w-sm">
                            Comparte tu enlace de invitación desde tu perfil con amigos y familiares para empezar a ganar el 5% de sus ingresos al sistema.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-borderC">
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Usuario</th>
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Fecha Vinculación</th>
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider text-right">Comisiones Generadas</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {referrals.map(user => (
                                    <tr key={user.id} className="border-b border-borderC/50 hover:bg-surfaceDark transition-colors">
                                        <td className="py-4 text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold shadow-inner">
                                                    {user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{user.name}</p>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-gray-300">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className="bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                                                + ${Number(user.total_commission).toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <InformationCircleIcon className="w-6 h-6 text-blue-400 shrink-0" />
                <p className="text-sm text-blue-100">
                    <strong>Información de Comisiones:</strong> Recibirás un <strong>5%</strong> por el valor de ingreso de cada referido directamente a tu saldo. Para comisiones tipo <strong>Partner</strong> (2% por transferencia), contacta a soporte para elevar tu rango.
                </p>
            </div>
        </div>
    );
}
