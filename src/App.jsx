import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MyPlans from './MyPlans.jsx';
import Settings from './Settings.jsx';
import Profile from './Profile.jsx';
import Referidos from './Referidos.jsx';
import Acciones from './Acciones.jsx';
import Divisas from './Divisas.jsx';
import Criptos from './Criptos.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  UsersIcon,
  WalletIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CheckCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [totalInvested, setTotalInvested] = React.useState(null);

  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('equaly_token');
        if (!token) return;
        const res = await fetch('https://api.equaly.co/api/user/portfolio-summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // For local development
        const fallbackRes = await fetch('https://api.equaly.co/api/user/portfolio-summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => res); // try local if prod fails, or just use localhost

        // Let's just use localhost for now to keep it working in our environment
        const useRes = await fetch('https://api.equaly.co/api/user/portfolio-summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await useRes.json();
        if (data.success) {
          setTotalInvested(data.totalInvested);
        }
      } catch (err) {
        console.error("Error fetching portfolio summary", err);
      }
    };
    fetchSummary();
  }, [location.pathname]); // Refresh on route change

  const mainMenu = [
    { icon: <Squares2X2Icon className="w-5 h-5" />, name: 'Tablero', path: '/' },
    { icon: <ClipboardDocumentListIcon className="w-5 h-5" />, name: 'Mis Planes', path: '/plans' },
  ];
  const marketsMenu = [
    { icon: <ChartBarIcon className="w-5 h-5" />, name: 'Acciones', path: '/acciones' },
    { icon: <CurrencyDollarIcon className="w-5 h-5" />, name: 'Divisas', path: '/divisas' },
    { icon: <BanknotesIcon className="w-5 h-5" />, name: 'Criptomonedas', path: '/criptos' },
  ];
  const accountMenu = [
    { icon: <UserIcon className="w-5 h-5" />, name: 'Perfil', path: '/profile' },
    { icon: <UsersIcon className="w-5 h-5" />, name: 'Referidos', path: '/referrals' },
    { icon: <WalletIcon className="w-5 h-5" />, name: 'Billetera', path: '/wallet' },
    { icon: <Cog6ToothIcon className="w-5 h-5" />, name: 'Configuración', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface h-full flex flex-col border-r border-borderC shrink-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => setIsOpen(false)}>
            <img src="/images/equaly-logo.png" alt="Equaly Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold uppercase tracking-wide">Equaly</span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4 space-y-8">
          <div>
            <ul className="space-y-2">
              {mainMenu.map((item, i) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={i}>
                    <Link to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Mercados</h4>
            <ul className="space-y-1">
              {marketsMenu.map((item, i) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={i}>
                    <Link to={item.path} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-accent/10 border border-accent/20 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Cuenta</h4>
            <ul className="space-y-1">
              {accountMenu.map((item, i) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={i}>
                    <Link to={item.path} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-accent/10 border border-accent/20 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="bg-card border border-borderC rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-1">Balance Invertido (USD)</p>
            <h3 className="text-2xl font-bold text-white mb-3">
              {totalInvested !== null ? `$${Number(totalInvested).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '...'}
            </h3>
            <button className="w-full bg-accent hover:bg-accentHover text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-accent/20">
              DEPOSITAR
            </button>
          </div>

          <button
            onClick={() => { localStorage.removeItem('equaly_token'); window.location.href = '/login'; }}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-2.5 rounded-xl text-sm transition-colors border border-red-500/20"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div >
    </>
  );
}

function Topbar({ toggleSidebar }) {
  return (
    <div className="h-20 bg-background flex flex-col justify-center px-4 md:px-10 border-b border-borderC shrink-0">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-sm hidden sm:block">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar mercados, activos..."
              className="w-full bg-surface border border-borderC rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full"></span>
          </button>

          <div className="h-8 w-px bg-borderC"></div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-white leading-none">Pedro Perez</p>
              <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full font-bold">PLAN BRONCE</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold border-2 border-borderC">
              PP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartArea() {
  const data = [
    { name: 'W1', value: 30 },
    { name: 'W2', value: 45 },
    { name: 'W3', value: 25 },
    { name: 'W4', value: 65 },
    { name: 'W5', value: 50 },
    { name: 'W6', value: 85 },
    { name: 'W7', value: 45 },
    { name: 'W8', value: 110 },
    { name: 'W9', value: 75 },
    { name: 'W10', value: 95 },
    { name: 'W11', value: 65 },
    { name: 'W12', value: 85 }
  ];

  return (
    <div className="bg-surface border border-borderC rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Resumen de Portafolio</h3>
          <p className="text-gray-400 text-sm">Crecimiento de ganancias netas en los últimos 30 días</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg text-xs font-bold bg-surface border border-borderC text-gray-400 hover:text-white">1S</button>
          <button className="px-3 py-1 rounded-lg text-xs font-bold bg-accent text-white">1M</button>
          <button className="px-3 py-1 rounded-lg text-xs font-bold bg-surface border border-borderC text-gray-400 hover:text-white">1A</button>
        </div>
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Tooltip
              cursor={{ fill: '#1e293b' }}
              contentStyle={{ backgroundColor: '#0b0f19', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Plans() {
  const [loadingPlan, setLoadingPlan] = React.useState(null);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = React.useState(null);
  const [investmentAmount, setInvestmentAmount] = React.useState('');

  const handleComprarClick = (planId) => {
    setSelectedPlanForPurchase(planId);
    setInvestmentAmount('');
  };

  const startCheckout = async (planId) => {
    if (!investmentAmount || isNaN(investmentAmount) || Number(investmentAmount) <= 0) {
      alert("Por favor ingrese un monto válido mayor a 0.");
      return;
    }

    setLoadingPlan(planId);
    try {
      const response = await fetch('https://api.equaly.co/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('equaly_token')}`
        },
        body: JSON.stringify({ planId, amount: Number(investmentAmount) })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo iniciar el proceso de compra.');
      }

      // Stripe genera una url a la cual debemos redireccionar directamente:
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Error: " + err.message);
      setLoadingPlan(null);
    }
  };

  const renderActionButton = (planId, btnText, isPrimary) => {
    if (selectedPlanForPurchase === planId) {
      return (
        <div className="flex flex-col gap-2 relative z-10 w-full mt-auto">
          <input
            type="number"
            min="1"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="w-full bg-[#0b0f19] border border-[#1e293b] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent shadow-inner outline-none focus:ring-1 focus:ring-accent"
            placeholder="Ingrese monto USD"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPlanForPurchase(null)}
              className="flex-1 py-2.5 rounded-lg border border-borderC text-gray-400 text-xs font-bold hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => startCheckout(planId)}
              disabled={loadingPlan === planId}
              className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accentHover text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              {loadingPlan === planId ? '...' : 'Confirmar'}
            </button>
          </div>
        </div>
      );
    }

    const btnClass = isPrimary
      ? "w-full bg-accent hover:bg-accentHover shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white py-3 rounded-xl font-bold transition-colors relative z-10 disabled:opacity-50 mt-auto"
      : "w-full py-3 rounded-xl border border-accent text-accent font-bold hover:bg-accent/10 transition-colors disabled:opacity-50 mt-auto";

    return (
      <button
        onClick={() => handleComprarClick(planId)}
        className={btnClass}
      >
        {btnText}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-surface border border-borderC rounded-2xl p-6 flex flex-col">
        <span className="text-orange-400 text-[10px] font-bold tracking-wider uppercase mb-1">Básico</span>
        <h3 className="text-2xl font-bold text-white mb-4">Bronce</h3>
        <div className="mb-6">
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider font-bold">Inversión a tu medida</p>
          <span className="text-2xl font-extrabold text-accent">Personalizada</span>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-emerald-400" /> 4% ROI Diario</li>
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-emerald-400" /> Soporte de Comunidad</li>
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-emerald-400" /> Rastreo Básico</li>
        </ul>
        {renderActionButton('bronze', 'Elegir Bronce', false)}
      </div>

      <div className="bg-card border border-borderC rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mb-1">Profesional</span>
        <h3 className="text-2xl font-bold text-white mb-4">Plata</h3>
        <div className="mb-6">
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider font-bold">Inversión a tu medida</p>
          <span className="text-2xl font-extrabold text-accent">Personalizada</span>
        </div>
        <ul className="space-y-3 mb-8 flex-1 relative z-10">
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-emerald-400" /> 7% ROI Diario</li>
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-emerald-400" /> Soporte Estándar</li>
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-emerald-400" /> Insights de Mercado</li>
        </ul>
        {renderActionButton('silver', 'Elegir Plata', true)}
      </div>

      <div className="bg-surface border border-borderC rounded-2xl p-6 flex flex-col relative">
        <div className="flex justify-between items-start mb-1">
          <span className="text-accent text-[10px] font-bold tracking-wider uppercase">Empresarial</span>
          <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MÁS POPULAR</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Oro</h3>
        <div className="mb-6">
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider font-bold">Inversión a tu medida</p>
          <span className="text-2xl font-extrabold text-accent">Personalizada</span>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-accent" /> 10% ROI Diario</li>
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-accent" /> Soporte Prioritario</li>
          <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircleIcon className="w-5 h-5 text-accent" /> Analíticas Avanzadas</li>
        </ul>
        {renderActionButton('gold', 'Elegir Oro', true)}
      </div>
    </div>
  );
}

function LiveMarkets() {
  const markets = [
    { icon: "🍎", symbol: "AAPL", name: "Apple Inc.", price: "$189.43", change: "+1.24%", up: true },
    { icon: "🚗", symbol: "TSLA", name: "Tesla, Inc.", price: "$175.22", change: "-0.85%", up: false },
    { icon: "💶", symbol: "EUR/USD", name: "Divisas", price: "1.0842", change: "+0.12%", up: true },
    { icon: "₿", symbol: "BTC", name: "Bitcoin", price: "$64,120", change: "+3.5%", up: true },
  ];

  return (
    <div className="bg-surface border border-borderC rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6">Mercados en Vivo</h3>
      <div className="space-y-4 flex-1">
        {markets.map((m, i) => (
          <div key={i} className="flex justify-between items-center group cursor-pointer p-2 hover:bg-card rounded-xl transition-colors -mx-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-card border border-borderC rounded-xl flex items-center justify-center text-lg">
                {m.icon}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-none">{m.symbol}</h4>
                <p className="text-gray-500 text-xs mt-1">{m.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-sm leading-none">{m.price}</p>
              <p className={`text-xs mt-1 font-medium ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {m.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full text-center text-gray-400 text-sm font-bold pt-4 mt-2 border-t border-borderC hover:text-white transition-colors">
        Ver Todos los Mercados
      </button>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Planes de Inversión</h1>
        </div>
        <a href="#" className="text-accent text-sm font-bold hover:text-accentHover transition-colors">
          Comparar todos los planes
        </a>
      </div>

      <Plans />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <ChartArea />
        </div>
        <div className="col-span-1 border-l-0 lg:border-l border-borderC pl-0 lg:pl-6 -ml-6 lg:ml-0">
          <LiveMarkets />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  React.useEffect(() => {
    // 1. Revisar si viene un token mágico por la URL (desde equaly.co/login) (Mantenemos por compatibilidad temporal)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('equaly_token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Validar localStorage
    const token = localStorage.getItem('equaly_token');

    if (isAuthRoute) {
      // Si estamos en login o register y el usuario ya está autenticado
      if (token) {
        window.location.href = '/';
      } else {
        setLoading(false);
      }
      return;
    }

    if (!token) {
      // Forzamos redirección interna a la ruta /login de dashboard.equaly.co
      window.location.href = '/login';
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [location.pathname, isAuthRoute]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  // Si está en la ruta de autenticación, renderizar solo las rutas sin marco (Sidebar/Topbar)
  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden font-sans relative">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <Topbar toggleSidebar={() => setSidebarOpen(true)} />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/plans" element={<MyPlans />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/referrals" element={<Referidos />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/acciones" element={<Acciones />} />
          <Route path="/divisas" element={<Divisas />} />
          <Route path="/criptos" element={<Criptos />} />
        </Routes>
      </div>
    </div>
  );
}
