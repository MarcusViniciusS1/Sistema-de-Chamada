import React, { useState, useEffect } from 'react';
import { Bus, Save, X, Plus, Trash2, MapPin, Edit } from 'lucide-react';
import { Onibus, OnibusRequest, Parada, ParadaDetalheRequest } from '../../../types/bolt';
import { salvarOnibus, buscarOnibusPorId, buscarRotasDoOnibus } from '../../../services/onibusService';
import { useNavigate, useParams } from 'react-router-dom';

const FormularioOnibus: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para edição
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
    nome: '',
    endereco: '',
    latitude: undefined,
    longitude: undefined
  });

  const cores = ['Azul', 'Verde', 'Amarelo', 'Vermelho', 'Branco', 'Laranja', 'Rosa', 'Roxo'];
  
  useEffect(() => {
    setLoading(true);
    if (isEditing) {
      buscarOnibusPorId(id)
        .then(async (data: Onibus) => {
          // Carrega dados básicos do ônibus
          setOnibus({
            idString: data.idString,
            nome: data.nome,
            motorista: data.motorista,
            placa: data.placa,
            cor: data.cor,
            capacidadeMaxima: data.capacidadeMaxima,
            suporteDeficiencia: data.suporteDeficiencia,
          });

          // Carrega a rota do ônibus separadamente
          const rotaData = await buscarRotasDoOnibus(data.id);
          setRota(rotaData.map(p => ({
            nome: p.nome,
            endereco: p.endereco,
            latitude: p.latitude,
            longitude: p.longitude
          })));

        })
        .catch(error => {
          console.error("Erro ao carregar ônibus para edição:", error);
          alert("Erro ao carregar dados do ônibus.");
          navigate('/onibus');
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [id, isEditing, navigate]);

  const handleOnibusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOnibus(prev => ({...prev, [name]: (name === 'capacidadeMaxima' ? parseInt(value) : value) as any }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnibus(prev => ({...prev, suporteDeficiencia: e.target.checked }));
  };

  const handleParadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParadaTemp(prev => ({
        ...prev, 
        [name]: (name === 'latitude' || name === 'longitude' ? (value ? parseFloat(value) : undefined) : value) as any
    }));
  };

  const adicionarParada = () => {
    if (paradaTemp.nome && paradaTemp.endereco && paradaTemp.latitude !== undefined && paradaTemp.longitude !== undefined) {
      const novaParada: ParadaDetalheRequest = {
        nome: paradaTemp.nome,
        endereco: paradaTemp.endereco,
        latitude: paradaTemp.latitude,
        longitude: paradaTemp.longitude
      };

      setRota(prev => [...prev, novaParada]);

      setParadaTemp({
        nome: '',
        endereco: '',
        latitude: undefined,
        longitude: undefined
      });
    }
  };

  const removerParada = (index: number) => {
    setRota(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rota.length === 0) {
        alert("A rota deve conter pelo menos uma parada!");
        return;
    }
    
    setLoading(true);

    try {
      const payload: OnibusRequest = {
        ...onibus,
        rota: rota
      };
      
      await salvarOnibus(payload, isEditing ? Number(id) : undefined);
      
      setMostrarSucesso(true);
      setTimeout(() => {
        setMostrarSucesso(false);
        navigate('/onibus');
      }, 2000);
      
    } catch (error: any) {
        console.error("Erro ao salvar ônibus:", error);
        const msg = error.response?.data?.message || "Erro ao salvar ônibus. Verifique os dados.";
        alert(msg);
        setLoading(false);
    }
  };

  if (loading && isEditing) {
      return <div className="text-center p-5">Carregando dados do ônibus...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card border-0 shadow-sm rounded p-6">
        <div className="d-flex align-items-center space-x-3 mb-4 border-bottom pb-3">
          <div className="p-2 bg-success rounded">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl fw-bold text-dark mb-0">
                {isEditing ? "Editar Ônibus" : "Cadastro de Ônibus"}
            </h1>
            <p className="text-sm text-muted mb-0">Configure o veículo e sua rota de embarque</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Nome do Ônibus *</label>
              <input
                type="text"
                name="nome"
                value={onibus.nome}
                onChange={handleOnibusChange}
                className="form-control"
                placeholder="Ex: Ônibus Esperança"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Nome do Motorista *</label>
              <input
                type="text"
                name="motorista"
                value={onibus.motorista}
                onChange={handleOnibusChange}
                className="form-control"
                placeholder="Ex: João Silva"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Placa *</label>
              <input
                type="text"
                name="placa"
                value={onibus.placa}
                onChange={handleOnibusChange}
                className="form-control"
                placeholder="Ex: ABC-1234"
                maxLength={8}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Cor *</label>
              <select
                name="cor"
                value={onibus.cor}
                onChange={handleOnibusChange}
                className="form-select"
                required
              >
                {cores.map(cor => (
                  <option key={cor} value={cor}>{cor}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold text-dark small">Capacidade Máxima *</label>
              <input
                type="number"
                name="capacidadeMaxima"
                min="10"
                max="50"
                value={onibus.capacidadeMaxima}
                onChange={handleOnibusChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 d-flex align-items-center mt-4 pt-2">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="suporteDeficiencia"
                  name="suporteDeficiencia"
                  checked={onibus.suporteDeficiencia}
                  onChange={handleCheckboxChange}
                  className="form-check-input"
                />
                <label htmlFor="suporteDeficiencia" className="form-check-label fw-bold text-dark">
                  Suporte a pessoas com deficiência
                </label>
              </div>
            </div>
          </div>

          <div className="border-top pt-4">
            <h3 className="text-base fw-bold text-dark mb-3 d-flex align-items-center">
              <MapPin className="w-5 h-5 me-2" size={18} />
              Configuração da Rota
            </h3>

            {/* Formulário para Adicionar Parada */}
            <div className="bg-light border-2 border-secondary rounded p-4 mb-4">
              <h4 className="fw-bold text-dark mb-3 small">Adicionar Nova Parada</h4>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-bold text-dark small">Nome da Parada *</label>
                  <input
                    type="text"
                    name="nome"
                    value={paradaTemp.nome}
                    onChange={handleParadaChange}
                    className="form-control"
                    placeholder="Ex: Centro da Cidade"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold text-dark small">Endereço *</label>
                  <input
                    type="text"
                    name="endereco"
                    value={paradaTemp.endereco}
                    onChange={handleParadaChange}
                    className="form-control"
                    placeholder="Ex: Rua Principal, 123"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark small">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={paradaTemp.latitude || ''}
                    onChange={handleParadaChange}
                    className="form-control"
                    placeholder="Ex: -23.550520"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark small">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={paradaTemp.longitude || ''}
                    onChange={handleParadaChange}
                    className="form-control"
                    placeholder="Ex: -46.633308"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={adicionarParada}
                disabled={!paradaTemp.nome || !paradaTemp.endereco || paradaTemp.latitude === undefined || paradaTemp.longitude === undefined}
                className="btn btn-secondary w-100 mt-3 d-flex align-items-center justify-content-center fw-bold"
              >
                <Plus className="w-4 h-4 me-2" size={16} />
                <span>Adicionar Parada</span>
              </button>
            </div>

            {/* Lista de Paradas na Rota */}
            {rota.length > 0 && (
              <div className="bg-light border-2 border-secondary rounded p-4">
                <h4 className="fw-bold text-dark mb-3">
                  Rota Configurada ({rota.length} paradas)
                </h4>
                <div className="space-y-2">
                  {rota.map((parada, index) => (
                    <div key={index} className="d-flex align-items-start justify-content-between p-3 bg-white border-2 border-secondary rounded">
                      <div className="d-flex align-items-start gap-3 flex-grow-1">
                        <span className="d-flex align-items-center justify-content-center w-7 h-7 bg-primary text-white rounded-circle fw-bold shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <p className="fw-bold text-dark mb-0">{parada.nome}</p>
                          <p className="text-sm text-muted mb-1">{parada.endereco}</p>
                          <div className="d-flex gap-4 text-xs text-muted">
                            <span>Lat: {parada.latitude?.toFixed(6)}</span>
                            <span>Long: {parada.longitude?.toFixed(6)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerParada(index)}
                        className="btn btn-sm btn-outline-danger p-1 ms-3 shrink-0"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="d-flex gap-3 pt-4 border-top">
            <button
              type="button"
              onClick={() => navigate('/onibus')}
              className="btn btn-light border"
            >
              <X className="w-4 h-4 me-1" size={16} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || rota.length === 0}
              className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center fw-bold"
            >
              {isEditing ? (
                  <> <Edit size={16} className="me-1" /> {loading ? "Atualizando..." : "Salvar Alterações"} </>
              ) : (
                  <> <Save size={16} className="me-1" /> {loading ? "Cadastrando..." : "Cadastrar Ônibus"} </>
              )}
            </button>
          </div>
        </form>

        {mostrarSucesso && (
          <div className="modal d-block bg-black bg-opacity-50" tabIndex={-1}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <div className="w-14 h-14 bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '50px', height: '50px'}}>
                    <Bus className="w-7 h-7 text-white" size={24} />
                  </div>
                  <h3 className="text-lg fw-bold text-dark mb-2">Sucesso!</h3>
                  <p className="text-sm text-muted">O ônibus foi salvo com sucesso.</p>
                  <button type="button" className="btn btn-success mt-3" onClick={() => navigate('/onibus')}>Fechar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioOnibus;