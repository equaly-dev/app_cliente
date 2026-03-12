import React, { useState, useEffect } from 'react';
import {
    CameraIcon,
    CheckBadgeIcon,
    ArrowTrendingUpIcon,
    LinkIcon,
    DocumentDuplicateIcon
} from '@heroicons/react/24/solid';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://api.equaly.co/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('equaly_token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setProfile(data.profile);
                }
            } catch (err) {
                console.error("Error cargando perfil", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const copyToClipboard = () => {
        if (!profile) return;
        const link = `https://equaly.co/register?ref=${profile.referral_code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="p-10 text-white font-sans text-center">Cargando perfil...</div>;
    if (!profile) return <div className="p-10 text-red-500 font-sans text-center">Error al cargar perfil</div>;

    const refLink = `https://equaly.co/register?ref=${profile.referral_code}`;

    return (
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 text-white font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 p-1">
                            <div className="w-full h-full rounded-full bg-surfaceDark flex items-center justify-center border-4 border-background overflow-hidden">
                                <span className="text-3xl font-bold text-white uppercase">{profile.name.substring(0, 2)}</span>
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-background hover:bg-accentHover transition-colors">
                            <CameraIcon className="w-4 h-4 text-white" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
                        <p className="text-gray-400 text-sm mb-2">Miembro desde {new Date(profile.created_at).toLocaleDateString()}</p>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-full font-bold border border-orange-400/20">VERIFICADO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enlace de Afiliados */}
            <div className="bg-gradient-to-r from-accent/20 to-surface border border-accent/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <LinkIcon className="w-32 h-32 text-accent" />
                </div>
                <div className="relative z-10 w-full md:w-2/3">
                    <h2 className="text-xl font-bold text-white mb-2">Tu Enlace de Invitación</h2>
                    <p className="text-sm text-gray-300 mb-4">
                        Refiere personas usando este enlace y gana el 5% por valor de ingreso de referido.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 bg-background border border-borderC rounded-xl px-4 py-3 flex items-center shadow-inner">
                            <span className="text-gray-400 text-sm truncate mr-2">{refLink}</span>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={`px-5 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-accent hover:bg-accentHover text-white'}`}
                        >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                            {copied ? '¡Copiado!' : 'Copiar Enlace'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-surface border border-borderC rounded-2xl overflow-hidden mb-8 shadow-lg">
                <div className="p-6 border-b border-borderC">
                    <h2 className="text-lg font-bold text-white">Información Personal</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Nombre Completo</label>
                            <input
                                type="text"
                                defaultValue={profile.name}
                                className="w-full bg-background border border-borderC rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Correo Electrónico</label>
                            <input
                                type="email"
                                defaultValue={profile.email}
                                className="w-full bg-background border border-borderC rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
