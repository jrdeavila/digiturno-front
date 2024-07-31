export interface Perfil {
  id: number;
  name: string;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
}

export interface Cliente {
  id: number;
  name: string;
  dni: string;
  client_type: string;
  is_deleted: boolean;
}

export interface Sala {
  id: number;
  name: string;
  branch_id: number;
}

export interface Modulo {
  id: number;
  name: string;
  room: Sala;
  ip_address: string;
  type: string;
  attention_profile_id: number;
  status: string;
  enabled: boolean;
  module_type_id: number;
}

export interface Turno {
  id: number;
  room: string;
  attention_profile: string;
  client: Cliente;
  state: string;
  created_at: string;
  updated_at: string;
}
