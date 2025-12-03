import { Route, Routes } from "react-router-dom";
import LayoutLogin from "./components/layouts/layoutLogin";
import LayoutMain from "./components/layouts/layoutMain";

import Login from "./pages/User/login";
import CadastrarUsuario from "./pages/User/cadastrarUsuario";
import RecuperarSenha from "./pages/User/recuperarSenha"; 
import ResetarSenha from "./pages/User/resetarSenha"; 

// Telas do BOLT
import Dashboard from "./pages/Admin/dashboard";
import CadastroAluno from "./pages/Admin/aluno/formulario";
import CadastroOnibus from "./pages/Admin/onibus/formulario"; // O arquivo criado acima
import ListaOnibus from "./pages/Admin/onibus/lista"; 
import ModuloPorta from "./pages/Admin/moduloPorta";
import ModuloRefeitorio from "./pages/Admin/refeitorio";
import ModuloCoordenadoraOnibus from "./pages/User/controleOnibus";
import ListaUsuarios from "./pages/Admin/usuarios/lista";
import FormularioUsuario from "./pages/Admin/usuarios/formulario";

export default function AppRoutes() {
    return (
       <Routes>
          <Route element={<LayoutLogin />}>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<CadastrarUsuario />} />
            <Route path="/recuperarSenha" element={<RecuperarSenha />} />
            <Route path="/registrarNovaSenha" element={<ResetarSenha />} />
          </Route>

          <Route element={<LayoutMain />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/onibus" element={<ListaOnibus />} />
            <Route path="/onibus/novo" element={<CadastroOnibus />} />
            <Route path="/onibus/:id/editar" element={<CadastroOnibus />} />

            <Route path="/alunos/cadastro" element={<CadastroAluno />} />
            
            <Route path="/modulo-porta" element={<ModuloPorta />} />
            <Route path="/refeitorio" element={<ModuloRefeitorio />} />
            <Route path="/coordenadora-onibus" element={<ModuloCoordenadoraOnibus />} />
            
            <Route path="/usuarios" element={<ListaUsuarios />} />
            <Route path="/usuarios/novo" element={<FormularioUsuario />} />
            <Route path="/usuarios/:id/editar" element={<FormularioUsuario />} />
          </Route>
       </Routes>
    );
}