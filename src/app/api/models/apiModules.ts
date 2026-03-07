export interface Login {
    mensaje:    boolean;
    usuario:    string;
    rol:        string;
    token:      string;
    token_type: string;
}

export interface Roles {
    id:  number;
    rol: string;
}
export interface UserProfileResponse {
  usuario: string;
  rol: 'administrador' | 'empresa' | 'demandante' | 'invitado';
  email: string;
}

