import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, StarIcon } from '@heroicons/react/24/solid';

export default function Acciones() {
    const chartData = [
        { time: '09:30', price: 185.5 },
        { time: '10:00', price: 186.2 },
        { time: '11:00', price: 185.8 },
        { time: '12:00', price: 187.5 },
        { time: '13:00', price: 188.1 },
        { time: '14:00', price: 187.9 },
        { time: '15:00', price: 189.2 },
        { time: '16:00', price: 189.43 }
    ];

    const stocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '$189.43', change: '+1.25%', isUp: true },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: '$175.34', change: '-0.45%', isUp: false },
        { symbol: 'AMZN', name: 'Amazon.com', price: '$178.22', change: '+1.12%', isUp: true },
        { symbol: 'NVDA', name: 'Nvidia Corp', price: '$875.28', change: '+4.56%', isUp: true },
        { symbol: 'MSFT', name: 'Microsoft', price: '$420.55', change: '+0.88%', isUp: true },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$142.17', change: '-0.30%', isUp: false }
    ];

    return (
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 text-white font-sans">

            {/* Header Section */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Mercado de Acciones</h1>
                    <p className="text-gray-400 text-sm">Opera e invierte en las mejores empresas del mundo.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-surface border border-borderC hover:bg-white/5 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
                        Mis Favoritos
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart Area */}
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-surfaceDark border border-borderC rounded-2xl p-6 shadow-lg">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-3xl font-bold text-white">AAPL</h2>
                                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded font-bold border border-accent/20">NASDAQ</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">Apple Inc.</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-extrabold text-white">$189.43</span>
                                    <span className="flex items-center gap-1 text-emerald-400 font-bold mb-1">
                                        <ArrowTrendingUpIcon className="w-5 h-5" /> +$2.34 (1.25%)
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-borderC text-gray-400 hover:text-white transition-colors">1D</button>
                                <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-borderC text-gray-400 hover:text-white transition-colors">1S</button>
                                <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-accent text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]">1M</button>
                                <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-borderC text-gray-400 hover:text-white transition-colors">1A</button>
                                <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-borderC text-gray-400 hover:text-white transition-colors">TODO</button>
                            </div>
                        </div>

                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" vertical={false} />
                                    <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis domain={['auto', 'auto']} stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-borderC">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Apertura</p>
                                <p className="text-white font-bold">$187.20</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Máximo</p>
                                <p className="text-emerald-400 font-bold">$190.15</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Mínimo</p>
                                <p className="text-red-400 font-bold">$186.80</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Capitalización</p>
                                <p className="text-white font-bold">2.98T</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Action Area */}
                <div className="col-span-1 flex flex-col gap-6">

                    {/* Trade Card */}
                    <div className="bg-surfaceDark border border-borderC rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-6">Comprar AAPL</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tipo de Orden</label>
                                <select className="w-full bg-background border border-borderC rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent">
                                    <option>Orden de Mercado</option>
                                    <option>Orden Límite</option>
                                    <option>Stop Loss</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cantidad</label>
                                <div className="relative">
                                    <input type="number" defaultValue="10" className="w-full bg-background border border-borderC rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">Acciones</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6 pt-4 border-t border-borderC">
                            <span className="text-gray-400 text-sm">Total Estimado</span>
                            <span className="text-xl font-bold text-white">$1,894.30</span>
                        </div>

                        <button className="w-full bg-accent hover:bg-accentHover text-white py-3.5 rounded-xl font-bold shadow-lg shadow-accent/30 transition-colors mb-4">
                            Ejecutar Compra
                        </button>

                        <p className="text-center text-xs text-gray-500">Poder de compra: <span className="font-bold text-white">$12,450.80</span></p>
                    </div>

                    {/* Watchlist */}
                    <div className="bg-surface border border-borderC rounded-2xl p-6 shadow-lg flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Lista de Seguimiento</h3>
                            <button className="text-accent text-xs font-bold hover:text-accentHover">Editar</button>
                        </div>

                        <div className="space-y-4">
                            {stocks.map((stock, i) => (
                                <div key={i} className="flex justify-between items-center hover:bg-card p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-background border border-borderC rounded-full flex items-center justify-center text-xs font-bold text-gray-300">
                                            {stock.symbol.slice(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{stock.symbol}</h4>
                                            <p className="text-gray-500 text-xs">{stock.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold text-sm">{stock.price}</p>
                                        <p className={`text-xs font-bold flex items-center justify-end gap-1 ${stock.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {stock.isUp ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
                                            {stock.change}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
