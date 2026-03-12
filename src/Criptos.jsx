import React, { useState, useEffect } from 'react';
import { CurrencyDollarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const COUNTRY_CURRENCY_MAP = {
    'EC': { code: 'USD', symbol: '$' },
    'CO': { code: 'COP', symbol: '$' },
    'PE': { code: 'PEN', symbol: 'S/' },
    'AR': { code: 'ARS', symbol: '$' },
    'MX': { code: 'MXN', symbol: '$' }
};

export default function Criptos() {
    const [btcPriceUsd, setBtcPriceUsd] = useState(null);
    const [localCurrency, setLocalCurrency] = useState(null);
    const [usdToLocalRate, setUsdToLocalRate] = useState(1);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [userCryptos, setUserCryptos] = useState([]);

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

                // Fetch USD to Local Rate
                const ratesRes = await fetch('https://open.er-api.com/v6/latest/USD');
                const ratesData = await ratesRes.json();

                if (ratesData && ratesData.rates && ratesData.rates[currencyInfo.code]) {
                    setUsdToLocalRate(ratesData.rates[currencyInfo.code]);
                }

                // Fetch BTC to USD Rate
                const btcRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
                const btcData = await btcRes.json();

                if (btcData && btcData.price) {
                    setBtcPriceUsd(parseFloat(btcData.price));
                }

                // Fetch user cryptos
                const cryptosRes = await fetch('https://api.equaly.co/api/user/criptos', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('equaly_token')}` }
                });
                const cryptosData = await cryptosRes.json();
                if (cryptosData.success) {
                    setUserCryptos(cryptosData.cryptos || []);
                }
            } catch (err) {
                console.error("Error cargando criptomonedas", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRatesAndProfile();
        const interval = setInterval(fetchRatesAndProfile, 60000);
        return () => clearInterval(interval);
    }, []);

    const getPriceInLocalCurrency = () => {
        if (!btcPriceUsd || !localCurrency) return '---';
        const localPrice = btcPriceUsd * usdToLocalRate;
        return `${localCurrency.symbol}${localPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${localCurrency.code}`;
    };

    const handleAmountChange = (e) => {
        setPurchaseAmount(e.target.value);
    };

    const startCheckout = async () => {
        if (!purchaseAmount || isNaN(purchaseAmount) || Number(purchaseAmount) <= 0) {
            alert("Por favor ingrese un monto válido de inversión en USD.");
            return;
        }

        setCheckoutLoading(true);

        try {
            const response = await fetch('https://api.equaly.co/api/payments/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('equaly_token')}`
                },
                body: JSON.stringify({
                    planId: 'btc',
                    amount: Number(purchaseAmount),
                    localCurrencyCode: localCurrency?.code || 'USD',
                    cryptoPriceUsd: btcPriceUsd // Send current BTC price
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            if (data.url) window.location.href = data.url;
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 text-white font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Criptomonedas</h1>
                    <p className="text-gray-400 text-sm">Invierte en la tecnología del futuro. Compra Bitcoin (BTC) con procesamiento fiduciario local.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-surface border border-borderC text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition flex gap-2 items-center"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar Tasas
                </button>
            </div>

            {loading && !btcPriceUsd ? (
                <div className="text-center py-20">Cargando la red Blockchain...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tarjeta BTC */}
                    <div className="bg-surface border border-borderC rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-lg hover:border-orange-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-6">
                                <span className="text-orange-400 text-3xl font-bold">₿</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">Bitcoin</h2>
                            <p className="text-gray-400 text-sm mb-6">Oro Digital (BTC)</p>

                            <div className="bg-background border border-borderC rounded-xl p-4 mb-8">
                                <p className="text-xs text-gray-500 font-bold tracking-wider mb-2">PRECIO DE COMPRA (Local)</p>
                                <p className="text-3xl font-bold text-white">{getPriceInLocalCurrency()}</p>
                                <p className="text-xs text-gray-500 mt-1">1 BTC = ${btcPriceUsd?.toLocaleString()} USD</p>
                            </div>

                            <div className="flex flex-col gap-3 mt-auto">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold">Monto de inversión en USD equivalente</label>
                                    <input
                                        type="number"
                                        value={purchaseAmount}
                                        onChange={handleAmountChange}
                                        className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                        placeholder="Ej. 100"
                                    />
                                    {purchaseAmount && btcPriceUsd && (
                                        <p className="text-orange-400 text-xs mt-1">Recibirás aprox: {(Number(purchaseAmount) / btcPriceUsd).toFixed(8)} BTC</p>
                                    )}
                                </div>
                                <button
                                    onClick={startCheckout}
                                    disabled={checkoutLoading}
                                    className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 mt-2 rounded-xl font-bold transition shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50"
                                >
                                    {checkoutLoading ? 'Procesando...' : 'Adquirir Bitcoin'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User Cryptos Table */}
            <div className="bg-surface border border-borderC rounded-2xl p-6 shadow-lg mt-12 mb-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                    <h2 className="text-lg font-bold text-white">Mi Billetera Crypto</h2>
                </div>

                {loading ? (
                    <div className="text-gray-400 py-10 text-center">Analizando bloques...</div>
                ) : userCryptos.length === 0 ? (
                    <div className="border border-dashed border-borderC rounded-xl p-10 flex flex-col items-center justify-center text-center">
                        <ArrowPathIcon className="w-12 h-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Sin activos digitales</h3>
                        <p className="text-gray-400 text-sm">Da el primer paso en la Web3 invirtiendo hoy en tu primer fragmento de Bitcoin.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-borderC">
                                    <th className="py-4 px-2 text-xs text-gray-500 font-bold uppercase tracking-wider">Activo</th>
                                    <th className="py-4 px-2 text-xs text-gray-500 font-bold uppercase tracking-wider">Monto BTC</th>
                                    <th className="py-4 px-2 text-xs text-gray-500 font-bold uppercase tracking-wider">Precio de Compra (USD)</th>
                                    <th className="py-4 px-2 text-xs text-gray-500 font-bold uppercase tracking-wider">Inversión Base</th>
                                    <th className="py-4 px-2 text-xs text-gray-500 font-bold uppercase tracking-wider text-right">Rentabilidad Actual</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {userCryptos.map(asset => {
                                    // Calculate current performance
                                    const initialUsd = Number(asset.amount_usd_paid);
                                    // current value in USD
                                    const currentUsd = Number(asset.crypto_amount_bought) * btcPriceUsd;
                                    const rawProfitUsd = btcPriceUsd ? currentUsd - initialUsd : 0;
                                    const pctProfit = btcPriceUsd && initialUsd > 0 ? (rawProfitUsd / initialUsd) * 100 : 0;

                                    const isPositive = rawProfitUsd >= 0;

                                    return (
                                        <tr key={asset.id} className="border-b border-borderC/50 hover:bg-surfaceDark transition-colors">
                                            <td className="py-4 px-2 text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border bg-orange-500/20 text-orange-400 border-orange-500/30">
                                                        ₿
                                                    </div>
                                                    <div>
                                                        <p className="font-bold uppercase">BTC</p>
                                                        <p className="text-xs text-gray-400">Bitcoin</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-white font-medium">
                                                {Number(asset.crypto_amount_bought).toFixed(8)} BTC
                                            </td>
                                            <td className="py-4 px-2 text-gray-300">
                                                ${Number(asset.purchase_price_usd).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-2 text-white font-medium">
                                                ${initialUsd.toFixed(2)} USD
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                {btcPriceUsd ? (
                                                    <span className={`px-3 py-1 rounded-full border font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        {isPositive ? '+' : ''}{rawProfitUsd.toFixed(2)} USD ({isPositive ? '+' : ''}{pctProfit.toFixed(2)}%)
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
                El valor es representativo y referencial al mercado libre. Equaly provee el acceso a índices internacionales sujetos a volatilidad.
            </div>
        </div>
    );
}
