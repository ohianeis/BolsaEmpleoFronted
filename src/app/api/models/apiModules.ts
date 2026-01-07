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

