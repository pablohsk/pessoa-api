export interface Pessoa {
  id?: number;
  nome: string;
  cpf: string;
  data_nasc: string;
  sexo: 'M' | 'F';
  altura: number;
  peso: number;
  peso_ideal?: number;
  status?: string;
  status_peso?: 'adequado' | 'acima' | 'abaixo';
}

export interface FiltroPessoa {
  nome?: string;
  cpf?: string;
  altura?: number;
  peso?: number;
} 