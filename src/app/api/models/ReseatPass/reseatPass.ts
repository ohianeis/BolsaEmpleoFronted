// Datos que devuelve el Admin al resetear una clave
export interface ResetPassAdminData {
    pass_temporal: string;
    usuario: string;
    email: string;
    change_pass: boolean;
}

// Datos que devuelve el Usuario al actualizar su propia clave
export interface ChangePassUserData {
    status: string;
    user_id: number;
}