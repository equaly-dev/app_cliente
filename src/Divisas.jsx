import React, { useState, useEffect } from 'react';
import { CurrencyDollarIcon, BanknotesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const COUNTRY_CURRENCY_MAP = {
    'EC': { code: 'USD', symbol: '$' },
    'CO': { code: 'COP', symbol: '$' },
    'PE': { code: 'PEN', symbol: 'S/' },
    'AR': { code: 'ARS', symbol: '$' },
    'MX': { code: 'MXN', symbol: '$' }
};

export default function Divisas() {
    const [rates, setRates] = useState(null);
    const [localCurrency, setLocalCurrency] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(null);
    const [purchaseAmount, setPurchaseAmount] = useState({ usd: '', eur: '' });
    const [targetAsset, setTargetAsset] = useState(null); // 'usd' or 'eur'
    const [userDivisas, setUserDivisas] = useState([]);

    useEffect(() => {
        const fetchRatesAndProfile = async () => {
            try {
                // Fetch user profile to get country
                const profileRes = await fetch('https://api.equaly.co/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('equaly_token')}` }
                });
                const profileData = await profileRes.json();

                let country = 'US'; // default fallback
                if (profileData.success && profileData.profile.country) {
                    country = profileData.profile.country;
                }

                const currencyInfo = COUNTRY_CURRENCY_MAP[country] || { code: 'USD', symbol: '$' };
                setLocalCurrency(currencyInfo);

                // Fetch exchange rates
                const ratesRes = await fetch('https://open.er-api.com/v6/latest/USD');
                const ratesData = await ratesRes.json();

                if (ratesData && ratesData.rates) {
                    setRates(ratesData.rates);
                }

                // Fetch user divisas
                const divisasRes = await fetch('https://api.equaly.co/api/user/divisas', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('equaly_token')}` }
                });
                const divisasData = await divisasRes.json();
                if (divisasData.success) {
                    setUserDivisas(divisasData.divisas || []);
                }
            } catch (err) {
                console.error("Error cargando divisas", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRatesAndProfile();
        // Refresh rates every minute
        const interval = setInterval(fetchRatesAndProfile, 60000);
        return () => clearInterval(interval);
    }, []);

    const getPriceInLocalCurrency = (assetCode) => {
        if (!rates || !localCurrency) return '---';
        const targetRate = rates[localCurrency.code]; // e.g. COP rate for 1 USD

        if (assetCode === 'usd') {
            return `${localCurrency.symbol}${targetRate.toFixed(2)} ${localCurrency.code}`;
        }
        if (assetCode === 'eur') {
            // rates is based on 1 USD.
            // So 1 EUR = 1 / rates['EUR'] USD
            // Price in local = (1 / rates['EUR']) * targetRate
            const usdToEur = rates['EUR'];
            const eurToLocal = (1 / usdToEur) * targetRate;
            return `${localCurrency.symbol}${eurToLocal.toFixed(2)} ${localCurrency.code}`;
        }
        return '---';
    };

    const handleAmountChange = (e, asset) => {
        setPurchaseAmount(prev => ({ ...prev, [asset]: e.target.value }));
    };

    const startCheckout = async (assetId) => {
        const amount = purchaseAmount[assetId];
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Por favor ingrese un monto válido de inversión en USD.");
            return;
        }

        setCheckoutLoading(assetId);

        let targetRate = 1;
        if (rates && localCurrency) {
            if (assetId === 'usd') {
                targetRate = rates[localCurrency.code];
            } else if (assetId === 'eur') {
                const usdToEur = rates['EUR'];
                targetRate = (1 / usdToEur) * rates[localCurrency.code];
            }
        }

        try {
            const response = await fetch('https://api.equaly.co/api/payments/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('equaly_token')}`
                },
                body: JSON.stringify({
                    planId: assetId,
                    amount: Number(amount),
                    localCurrencyCode: localCurrency?.code || 'USD',
                    exchangeRate: targetRate
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            if (data.url) window.location.href = data.url;
        } catch (err) {
            alert("Error: " + err.message);
            setCheckoutLoading(null);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 text-white font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Mercado de Divisas</h1>
                    <p className="text-gray-400 text-sm">Adquiere stablecoins y reservas fiduciarias. El precio local se calcula automáticamente basado en tu ubicación.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-surface border border-borderC text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition flex gap-2 items-center"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar Tasas
                </button>
            </div>

            {loading && !rates ? (
                <div className="text-center py-20">Cargando cotizaciones del mercado...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Tarjeta USD */}
                    <div className="bg-surface border border-borderC rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-lg hover:border-emerald-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                                <CurrencyDollarIcon className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">Dólar Estadounidense</h2>
                            <p className="text-gray-400 text-sm mb-6">Activo refugio (USD)</p>

                            <div className="bg-background border border-borderC rounded-xl p-4 mb-8">
                                <p className="text-xs text-gray-500 font-bold tracking-wider mb-2">PRECIO DE COMPRA ACTUAL (Local)</p>
                                <p className="text-3xl font-bold text-white">{getPriceInLocalCurrency('usd')}</p>
                            </div>

                            {targetAsset === 'usd' ? (
                                <div className="flex flex-col gap-3 mt-auto">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-bold">Monto de inversión (en USD equivalente)</label>
                                        <input
                                            type="number"
                                            value={purchaseAmount.usd}
                                            onChange={(e) => handleAmountChange(e, 'usd')}
                                            className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                            placeholder="Ej. 100"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTargetAsset(null)}
                                            className="w-1/3 py-3 rounded-xl border border-borderC text-gray-400 font-bold hover:text-white transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() => startCheckout('usd')}
                                            disabled={checkoutLoading === 'usd'}
                                            className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                        >
                                            {checkoutLoading === 'usd' ? 'Procesando...' : 'Pagar Ahora'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setTargetAsset('usd')}
                                    className="w-full bg-surfaceDark border border-emerald-500/50 text-emerald-400 py-3 rounded-xl font-bold hover:bg-emerald-500/10 transition mt-auto"
                                >
                                    Adquirir Dólares
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tarjeta EUR */}
                    <div className="bg-surface border border-borderC rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-lg hover:border-indigo-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-6">
                                <BanknotesIcon className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">Euro Comunitario</h2>
                            <p className="text-gray-400 text-sm mb-6">Bloque Europeo (EUR)</p>

                            <div className="bg-background border border-borderC rounded-xl p-4 mb-8">
                                <p className="text-xs text-gray-500 font-bold tracking-wider mb-2">PRECIO DE COMPRA ACTUAL (Local)</p>
                                <p className="text-3xl font-bold text-white">{getPriceInLocalCurrency('eur')}</p>
                            </div>

                            {targetAsset === 'eur' ? (
                                <div className="flex flex-col gap-3 mt-auto">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-bold">Monto de inversión (en USD equivalente para pasarela)</label>
                                        <input
                                            type="number"
                                            value={purchaseAmount.eur}
                                            onChange={(e) => handleAmountChange(e, 'eur')}
                                            className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            placeholder="Ej. 100"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTargetAsset(null)}
                                            className="w-1/3 py-3 rounded-xl border border-borderC text-gray-400 font-bold hover:text-white transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={() => startCheckout('eur')}
                                            disabled={checkoutLoading === 'eur'}
                                            className="w-2/3 bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl font-bold transition shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
                                        >
                                            {checkoutLoading === 'eur' ? 'Procesando...' : 'Pagar Ahora'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setTargetAsset('eur')}
                                    className="w-full bg-surfaceDark border border-indigo-500/50 text-indigo-400 py-3 rounded-xl font-bold hover:bg-indigo-500/10 transition mt-auto"
                                >
                                    Adquirir Euros
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            )}

            {/* User Divisas Table */}
            <div className="bg-surface border border-borderC rounded-2xl p-6 shadow-lg mt-12 mb-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                    <h2 className="text-lg font-bold text-white">Mis Divisas (Rentabilidad Diaria)</h2>
                </div>

                {loading ? (
                    <div className="text-gray-400 py-10 text-center">Cargando portafolio...</div>
                ) : userDivisas.length === 0 ? (
                    <div className="border border-dashed border-borderC rounded-xl p-10 flex flex-col items-center justify-center text-center">
                        <ArrowPathIcon className="w-12 h-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Sin activos cambiarios</h3>
                        <p className="text-gray-400 text-sm">Adquiere tus primeros dólares o euros para verlos reflejados aquí.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-borderC">
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Activo</th>
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Fecha de Compra</th>
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Monto Ref. (USD)</th>
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider">Precio Compra Local</th>
                                    <th className="py-4 text-xs text-gray-500 font-bold uppercase tracking-wider text-right">Rentabilidad Actual</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {userDivisas.map(asset => {
                                    // Calculate current performance
                                    let currentRate = 1;
                                    const locCode = asset.local_currency_code;
                                    if (rates && rates[locCode]) {
                                        if (asset.divisa_type === 'usd') {
                                            currentRate = rates[locCode];
                                        } else if (asset.divisa_type === 'eur') {
                                            const usdToEur = rates['EUR'];
                                            currentRate = (1 / usdToEur) * rates[locCode];
                                        }
                                    }

                                    // initial spending in local currency
                                    const initialLocal = Number(asset.amount_usd_paid) * Number(asset.purchase_exchange_rate);
                                    // current value in local currency
                                    const currentLocal = Number(asset.amount_usd_paid) * currentRate;
                                    const rawProfit = rates ? currentLocal - initialLocal : 0;
                                    const pctProfit = rates && initialLocal > 0 ? (rawProfit / initialLocal) * 100 : 0;

                                    const isPositive = rawProfit >= 0;

                                    return (
                                        <tr key={asset.id} className="border-b border-borderC/50 hover:bg-surfaceDark transition-colors">
                                            <td className="py-4 text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${asset.divisa_type === 'usd' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'}`}>
                                                        {asset.divisa_type === 'usd' ? '$' : '€'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold uppercase">{asset.divisa_type}</p>
                                                        <p className="text-xs text-gray-400">{asset.divisa_type === 'usd' ? 'Dólar' : 'Euro'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-300">
                                                {new Date(asset.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 text-white font-medium">
                                                ${parseFloat(asset.amount_usd_paid).toFixed(2)} USD
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {Number(asset.purchase_exchange_rate).toFixed(2)} {locCode}
                                            </td>
                                            <td className="py-4 text-right">
                                                {rates ? (
                                                    <span className={`px-3 py-1 rounded-full border font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        {isPositive ? '+' : ''}{rawProfit.toFixed(2)} {locCode} ({isPositive ? '+' : ''}{pctProfit.toFixed(2)}%)
                                                    </span>
                                                ) : <span className="text-gray-500">Calculando...</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="text-center text-gray-500 text-xs mt-4">
                Las tasas de mercado reflejan el tipo de cambio spot global actual convertido dinámicamente según la ubicación registrada en tu perfil de inversión ({localCurrency?.code || 'USD'}).
            </div>
        </div>
    );
}
