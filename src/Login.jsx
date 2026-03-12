import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bgLogin from './assets/bg-login.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('https://api.equaly.co/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciales inválidas.');
            }

            // Save token securely in localStorage for cross-domain auth if needed or main storage
            localStorage.setItem('equaly_token', data.token);

            // Navigate a dashboard start point
            window.location.href = '/';

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#0a0f18] text-white font-sans">
            {/* Columna Izquierda: Imagen */}
            <div className="hidden lg:block lg:w-1/2 h-full relative border-r border-[#1e293b]">
                {/* Shadow overlays para fusionar mejor la imagen */}
                <div className="absolute inset-0 z-0 bg-[#0a0f18] opacity-70"></div>
                <img
                    src={bgLogin}
                    alt="Login Trading Visuals"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0f18]"></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-end items-start p-16">
                    <div className="max-w-md">
                        <div className="bg-[#0b0f19]/70 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-3xl font-bold text-white mb-3">Maximiza tu Potencial</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Retoma el control de tus inversiones. Accede al análisis en tiempo real y asegura tus posiciones hoy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center px-8 sm:px-12 py-12 overflow-y-auto hide-scrollbar">
                <div className="w-full max-w-sm">
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src="/images/equaly-logo.png" alt="EQUALY Logo" className="w-10 h-10 object-contain" />
                            <span className="text-white text-2xl font-bold uppercase tracking-wide">EQUALY</span>
                        </Link>
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-white mb-2">Iniciar Sesión</h1>
                        <p className="text-gray-400">Bienvenido de nuevo a EQUALY</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm mb-6 text-center">{error}</div>}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 tracking-wider">CORREO ELECTRÓNICO</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 tracking-wider">CONTRASEÑA</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <div className="text-center">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#6366f1] hover:bg-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                            >
                                {loading ? 'Cargando...' : 'Iniciar Sesión'}
                            </button>
                        </div>

                        <div className="text-center pt-4">
                            <span className="text-gray-400 text-sm">
                                ¿No tienes una cuenta? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Regístrate</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
