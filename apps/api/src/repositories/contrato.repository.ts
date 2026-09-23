import { ContratoDTO, MedioPagoXContratoDTO, MedioPagoDTO } from '../dtos';
import { lookupRepository } from './lookup.repository';

export interface IContratoRepository {
  findById(id: number): Promise<ContratoDTO | null>;
  findByInmuebleId(inmuebleId: number): Promise<ContratoDTO | null>;
  create(data: Omit<ContratoDTO, 'id'>, mediosPagoIds: number[]): Promise<ContratoDTO>;
  getMediosPagoByContratoId(contratoId: number): Promise<MedioPagoDTO[]>;
  delete(id: number): Promise<boolean>;
  deleteByInmuebleId(inmuebleId: number): Promise<boolean>;
}

export class ContratoRepository implements IContratoRepository {
  private nextId = 10;
  private nextMedioPagoXContratoId = 10;

  private contratos: ContratoDTO[] = [
    {
      id: 1,
      id_inmueble: 1,
      monto_alquiler: 350000.0,
      expensas: 45000.0,
      indice_aumento: 1,
      frecuencia_ajuste: 'Semestral',
      duracion_meses: 24,
      deposito: 350000.0,
      interes_por_dia: 0.5,
      dias_gracia: 5,
      fecha_inicio_contrato: '2026-10-01',
      fecha_fin_contrato: '2028-09-30',
      estado: 1
    },
    {
      id: 2,
      id_inmueble: 2,
      monto_alquiler: 290000.0,
      expensas: 38000.0,
      indice_aumento: 1,
      frecuencia_ajuste: 'Anual',
      duracion_meses: 24,
      deposito: 290000.0,
      interes_por_dia: 0.5,
      dias_gracia: 3,
      fecha_inicio_contrato: '2026-03-01',
      fecha_fin_contrato: '2028-02-28',
      estado: 2
    }
  ];

  private mediosPagoXContratos: MedioPagoXContratoDTO[] = [
    { id: 1, id_contrato: 1, id_medio_pago: 1 }, // Transferencia
    { id: 2, id_contrato: 1, id_medio_pago: 3 }, // Mercado Pago
    { id: 3, id_contrato: 2, id_medio_pago: 1 }  // Transferencia
  ];

  async findById(id: number): Promise<ContratoDTO | null> {
    const contrato = this.contratos.find(c => c.id === id);
    return contrato ? { ...contrato } : null;
  }

  async findByInmuebleId(inmuebleId: number): Promise<ContratoDTO | null> {
    const contrato = this.contratos.find(c => c.id_inmueble === inmuebleId);
    return contrato ? { ...contrato } : null;
  }

  async create(
    data: Omit<ContratoDTO, 'id'>,
    mediosPagoIds: number[]
  ): Promise<ContratoDTO> {
    const nuevoId = ++this.nextId;
    const nuevoContrato: ContratoDTO = {
      ...data,
      id: nuevoId
    };
    this.contratos.push(nuevoContrato);

    // Asociar medios de pago
    for (const idMedio of mediosPagoIds) {
      this.mediosPagoXContratos.push({
        id: ++this.nextMedioPagoXContratoId,
        id_contrato: nuevoId,
        id_medio_pago: idMedio
      });
    }

    return { ...nuevoContrato };
  }

  async getMediosPagoByContratoId(contratoId: number): Promise<MedioPagoDTO[]> {
    const rels = this.mediosPagoXContratos.filter(r => r.id_contrato === contratoId);
    const resultado: MedioPagoDTO[] = [];
    for (const r of rels) {
      const mp = await lookupRepository.getMedioPagoById(r.id_medio_pago);
      if (mp) resultado.push(mp);
    }
    return resultado;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.contratos.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.contratos.splice(index, 1);
    this.mediosPagoXContratos = this.mediosPagoXContratos.filter(r => r.id_contrato !== id);
    return true;
  }

  async deleteByInmuebleId(inmuebleId: number): Promise<boolean> {
    const contrato = this.contratos.find(c => c.id_inmueble === inmuebleId);
    if (!contrato) return false;
    return this.delete(contrato.id);
  }
}

export const contratoRepository = new ContratoRepository();
