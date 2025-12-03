// frontmarket/src/components/sidebar/index.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useState } from "react";
import type { RootState } from "../../redux/store";
import { Bus, Users, Shield, ChefHat, Heart } from "lucide-react"; // <-- ESTE IMPORT FUNCIONARÁ APÓS npm install

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = useSelector((state: RootState) => state.auth.usuario);
  const userRole = user?.role;

  const isAdmin = userRole === 'ADMIN';
  const isCoordenadora = userRole === 'COORDENADORA';
  const isRefeitorio = userRole === 'REFEITORIO';
  const isPorta = userRole === 'COORDENADOR_PORTA';

  const isActive = (path: string) => 
    location.pathname.startsWith(path) 
      ? "bg-white text-primary fw-bold shadow-sm border border-white" 
      : "text-white text-opacity-75 hover-white";

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const width = isCollapsed ? "80px" : "260px";

  const getRoleLabel = () => {
    if (isAdmin) return '👑 Administrador';
    if (isCoordenadora) return '🚌 Coordenadora';
    if (isRefeitorio) return '🍽️ Refeitório';
    if (isPorta) return '🛡️ Portaria';
    return '🛠️ Usuário';
  };

  return (
    <div 
      className="d-flex flex-column flex-shrink-0 p-3 text-white shadow-lg" 
      style={{ 
        width: width, 
        minHeight: "100vh", 
        transition: "width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)", 
        background: "linear-gradient(195deg, #42424a, #191919)", 
        borderRight: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden", 
        whiteSpace: "nowrap" 
      }}
    >
      <div className="d-flex flex-column mb-4">
        <div className={`d-flex w-100 align-items-center ${isCollapsed ? 'justify-content-center' : 'justify-content-between'}`}>
          
          {!isCollapsed && (
             <div className="d-flex align-items-center gap-2 fade-in">
                <Heart className="fs-3" size={24} color="#f56565" />
                <div className="d-flex flex-column">
                    <span className="fw-bold fs-5" style={{letterSpacing: '1px'}}>BOLT</span>
                    <span style={{fontSize: '0.65rem', opacity: 0.7}}>APAE</span>
                </div>
             </div>
          )}

          <button onClick={toggleSidebar} className="btn btn-link text-white p-0" style={{opacity: 0.8}}>
            {isCollapsed ? '➡️' : '⬅️'}
          </button>
        </div>
      </div>

      <hr className="border-light opacity-25 my-2" />

      <ul className="nav nav-pills flex-column mb-auto gap-2 mt-3">
        
        <li className="nav-item">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} style={{borderRadius: '12px', transition: 'all 0.2s'}}>
            <span className="fs-5">📊</span>
            {!isCollapsed && <span className="ms-3">Dashboard</span>}
          </Link>
        </li>

        {isAdmin && (
          <>
            <li>
              <Link to="/onibus" className={`nav-link ${isActive('/onibus')}`} style={{borderRadius: '12px', transition: 'all 0.2s'}}>
                <Bus size={20} className="me-3" />
                {!isCollapsed && <span className="ms-1">Ônibus</span>}
              </Link>
            </li>
            <li>
              <Link to="/alunos/cadastro" className={`nav-link ${isActive('/alunos/cadastro')}`} style={{borderRadius: '12px', transition: 'all 0.2s'}}>
                <Users size={20} className="me-3" />
                {!isCollapsed && <span className="ms-1">Alunos</span>}
              </Link>
            </li>
          </>
        )}
        
        {isCoordenadora && (
             <li>
                <Link to="/coordenadora-onibus" className={`nav-link ${isActive('/coordenadora-onibus')}`} style={{borderRadius: '12px', transition: 'all 0.2s'}}>
                    <Bus size={20} className="me-3" />
                    {!isCollapsed && <span className="ms-1">Controle Ônibus</span>}
                </Link>
            </li>
        )}

        {isPorta && (
             <li>
                <Link to="/modulo-porta" className={`nav-link ${isActive('/modulo-porta')}`} style={{borderRadius: '12px', transition: 'all 0.2s'}}>
                    <Shield size={20} className="me-3" />
                    {!isCollapsed && <span className="ms-1">Módulo Porta</span>}
                </Link>
            </li>
        )}
        
        {isRefeitorio && (
             <li>
                <Link to="/refeitorio" className={`nav-link ${isActive('/refeitorio')}`} style={{borderRadius: '12px', transition: 'all 0.2s'}}>
                    <ChefHat size={20} className="me-3" />
                    {!isCollapsed && <span className="ms-1">Módulo Refeitório</span>}
                </Link>
            </li>
        )}

        {(isAdmin || isCoordenadora) && (
             <li>
                <Link to="/usuarios" className={`nav-link ${isActive('/usuarios')}`} style={{borderRadius: '12px', transition: 'all 0.2s'}}>
                    <span className="fs-5">👥</span>
                    {!isCollapsed && <span className="ms-3">Equipe</span>}
                </Link>
            </li>
        )}
      </ul>

      <div className="mt-auto">
        {!isCollapsed && (
            <div className="p-3 rounded-3 mb-3 bg-black bg-opacity-25 border border-white border-opacity-10">
                <small className="text-white-50 d-block mb-1" style={{fontSize: '0.65rem'}}>CONECTADO COMO</small>
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: 30, height: 30, fontSize: '0.8rem'}}>
                        {user?.nome?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <div className="fw-bold text-truncate" style={{fontSize: '0.9rem'}}>{user?.nome}</div>
                        <div className="text-white-50" style={{fontSize: '0.7rem'}}>{getRoleLabel()}</div>
                    </div>
                </div>
            </div>
        )}

        <button 
            onClick={handleLogout} 
            className={`btn w-100 d-flex align-items-center ${isCollapsed ? 'justify-content-center' : 'justify-content-start px-3'}`}
            style={{
                backgroundColor: 'rgba(220, 53, 69, 0.15)',
                color: '#ff878d',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                borderRadius: '12px',
                height: '45px',
                transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.15)'}
        >
            <span className="fs-5">🚪</span>
            {!isCollapsed && <span className="ms-3 fw-bold">Sair</span>}
        </button>
      </div>
    </div>
  );
}