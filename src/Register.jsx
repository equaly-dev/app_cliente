import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bgTrading from './assets/bg-trading.png';

export default function Register() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        country: 'EC',
        terms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.terms) {
            setError('Debes aceptar los términos y condiciones.');
            return;
        }

        setLoading(true);
        const fullName = `${formData.nombre} ${formData.apellido}`.trim();

        const urlParams = new URLSearchParams(location.search);
        const referralCode = urlParams.get('ref') || '';

        try {
            const response = await fetch('https://api.equaly.co/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: fullName,
                    email: formData.email,
                    password: formData.password,
                    country: formData.country,
                    terms_accepted: formData.terms,
                    referral_code: referralCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocurrió un error en el registro.');
            }

            setSuccessMessage('Registro exitoso. Ahora puedes iniciar sesión.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#0b0f19] text-white font-sans">
            {/* Columna Izquierda: Formulario */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center px-8 sm:px-12 lg:px-24 py-6 overflow-hidden">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src="/images/equaly-logo.png" alt="EQUALY Logo" className="w-10 h-10 object-contain" />
                            <span className="text-white text-2xl font-bold uppercase tracking-wide">EQUALY</span>
                        </Link>
                    </div>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white mb-2">Únete a EQUALY hoy mismo</h1>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm mb-4 text-center">{error}</div>}
                    {successMessage && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm mb-4 text-center">{successMessage}</div>}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 tracking-wider">NOMBRES</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej. Juan"
                                    className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 tracking-wider">APELLIDOS</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="Ej. Perez"
                                    className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 tracking-wider">CORREO ELECTRÓNICO</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 tracking-wider">CONTRASEÑA</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 tracking-wider">PAÍS</label>
                            <div className="relative">
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                                >
                                    <option value="EC">Ecuador</option>
                                    <option value="CO">Colombia</option>
                                    <option value="PE">Perú</option>
                                    <option value="AR">Argentina</option>
                                    <option value="MX">México</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                className="w-4 h-4 rounded-sm border-gray-600 bg-[#0b0f19] checked:bg-indigo-500 text-indigo-500 cursor-pointer focus:ring-0 focus:ring-offset-0"
                            />
                            <label htmlFor="terms" className="text-xs font-bold text-white tracking-wider cursor-pointer">
                                ACEPTO LOS <span className="text-blue-500 hover:text-blue-400 transition-colors">TÉRMINOS Y CONDICIONES</span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#6366f1] hover:bg-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                            >
                                {loading ? 'Cargando...' : 'Registrarse'}
                            </button>
                        </div>

                        <div className="text-center pt-2">
                            <span className="text-gray-400 text-sm">
                                ¿Ya tienes una cuenta? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Inicia Sesión</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Columna Derecha: Imagen */}
            <div className="hidden lg:block lg:w-1/2 h-full relative border-l border-[#1e293b]">
                {/* Imagen Abstracta de fondo, ajustada para verse "tech/trading" */}
                <div className="absolute inset-0 z-0 bg-[#0b0f19] opacity-90"></div>
                <img
                    src={bgTrading}
                    alt="Trading Visuals"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-[#0b0f19]/30 to-[#0b0f19]"></div>

                {/* Elemento Decorativo encima de la imagen */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end items-start p-16">
                    <div className="max-w-md">
                        <div className="bg-[#0b0f19]/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-3">Tu portal a los mercados globales</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Accede a más de 150 activos. Invierte en tiempo real con herramientas avanzadas desde cualquier lugar del mundo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
