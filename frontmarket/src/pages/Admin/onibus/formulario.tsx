import { useState, useEffect } from 'react';
import { Bus, Save, X, Plus, Trash2, MapPin, Edit } from 'lucide-react';
import type { OnibusRequest, ParadaDetalheRequest } from '../../../types/bolt';
import { salvarOnibus, buscarOnibusPorId, buscarRotasDoOnibus } from '../../../services/onibusService';
import { useNavigate, useParams } from 'react-router-dom';

const FormularioOnibus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(true);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  const [onibus, setOnibus] = useState<Omit<OnibusRequest, 'rota'>>({
    idString: '',
    nome: '',
    motorista: '',
    placa: '',
    cor: 'Azul',
    capacidadeMaxima: 20,
    suporteDeficiencia: false,
  });

  const [rota, setRota] = useState<ParadaDetalheRequest[]>([]);
  const [paradaTemp, setParadaTemp] = useState<Partial<ParadaDetalheRequest>>({
    nome: '', endereco: '', latitude: undefined, longitude: undefined
  });
  const cores = ['Azul', 'Verde', 'Amarelo', 'Vermelho', 'Branco', 'Laranja', 'Rosa', 'Roxo'];
  
  useEffect(() => {
    setLoading(true);
    if (isEditing) {
      buscarOnibusPorId(id!).then(async (data) => {
          setOnibus({
            idString: data.idString, nome: data.nome, motorista: data.motorista,
            placa: data.placa, cor: data.cor, capacidadeMaxima: data.capacidadeMaxima,
            suporteDeficiencia: data.suporteDeficiencia,
          });
          const rotaData = await buscarRotasDoOnibus(data.id);
          setRota(rotaData.map(p => ({ nome: p.nome, endereco: p.endereco, latitude: p.latitude, longitude: p.longitude })));
        }).catch(() => navigate('/onibus')).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [id, isEditing, navigate]);

  const handleOnibusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOnibus(prev => ({...prev, [name]: (name === 'capacidadeMaxima' ? parseInt(value) : value) }));
  };

  const handleParadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParadaTemp(prev => ({ ...prev, [name]: (name === 'latitude' || name === 'longitude' ? parseFloat(value) : value) }));
  };

  const adicionarParada = () => {
    if (paradaTemp.nome && paradaTemp.endereco) {
      setRota(prev => [...prev, paradaTemp as ParadaDetalheRequest]);
      setParadaTemp({ nome: '', endereco: '', latitude: undefined, longitude: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rota.length === 0) return alert("Adicione paradas!");
    setLoading(true);
    try {
      await salvarOnibus({ ...onibus, rota }, isEditing ? Number(id) : undefined);
      setMostrarSucesso(true);
      setTimeout(() => { setMostrarSucesso(false); navigate('/onibus'); }, 2000);
    } catch { alert("Erro ao salvar."); setLoading(false); }
  };

  if (loading && isEditing) return <div>Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card border-0 shadow-sm rounded p-6">
        <div className="d-flex align-items-center space-x-3 mb-4 border-bottom pb-3">
          <Bus className="w-6 h-6 text-success" />
          <h1 className="text-2xl fw-bold text-dark mb-0">{isEditing ? "Editar Ônibus" : "Cadastro de Ônibus"}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label fw-bold small">Nome</label><input name="nome" value={onibus.nome} onChange={handleOnibusChange} className="form-control" required /></div>
            <div className="col-md-6"><label className="form-label fw-bold small">Motorista</label><input name="motorista" value={onibus.motorista} onChange={handleOnibusChange} className="form-control" required /></div>
            <div className="col-md-6"><label className="form-label fw-bold small">Placa</label><input name="placa" value={onibus.placa} onChange={handleOnibusChange} className="form-control" required /></div>
            <div className="col-md-6"><label className="form-label fw-bold small">Cor</label><select name="cor" value={onibus.cor} onChange={handleOnibusChange} className="form-select">{cores.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="col-md-6"><label className="form-label fw-bold small">Capacidade</label><input type="number" name="capacidadeMaxima" value={onibus.capacidadeMaxima} onChange={handleOnibusChange} className="form-control" required /></div>
          </div>
          <div className="border-top pt-4">
            <h4 className="fw-bold mb-3"><MapPin size={18}/> Rota</h4>
            <div className="row g-3 bg-light p-3 rounded border">
                <div className="col-12"><input name="nome" value={paradaTemp.nome} onChange={handleParadaChange} className="form-control" placeholder="Nome da Parada" /></div>
                <div className="col-12"><input name="endereco" value={paradaTemp.endereco} onChange={handleParadaChange} className="form-control" placeholder="Endereço" /></div>
                <div className="col-6"><input name="latitude" value={paradaTemp.latitude || ''} onChange={handleParadaChange} className="form-control" placeholder="Lat" /></div>
                <div className="col-6"><input name="longitude" value={paradaTemp.longitude || ''} onChange={handleParadaChange} className="form-control" placeholder="Long" /></div>
                <button type="button" onClick={adicionarParada} className="btn btn-secondary w-100 mt-2"><Plus size={16} /> Adicionar</button>
            </div>
            {rota.length > 0 && <ul className="list-group mt-3">{rota.map((p, i) => (<li key={i} className="list-group-item d-flex justify-content-between"><span>{i+1}. {p.nome}</span><button type="button" onClick={() => setRota(prev => prev.filter((_, idx) => idx !== i))} className="btn btn-sm btn-danger"><Trash2 size={14}/></button></li>))}</ul>}
          </div>
          <div className="d-flex gap-2 pt-3 border-top">
              <button type="button" onClick={() => navigate('/onibus')} className="btn btn-light"><X size={16} /> Cancelar</button>
              <button type="submit" disabled={loading} className="btn btn-success flex-grow-1">
                 {isEditing ? <Edit size={16} className="me-1" /> : <Save size={16} className="me-1"/>} Salvar
              </button>
          </div>
        </form>
        {mostrarSucesso && <div className="alert alert-success mt-3">Sucesso!</div>}
      </div>
    </div>
  );
};
export default FormularioOnibus;