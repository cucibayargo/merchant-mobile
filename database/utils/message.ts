export interface UnauthorizedMessageType {
  success: boolean;
  message: string;
}

export const unauthorizedMessage: UnauthorizedMessageType = {
  success: false,
  message: "Akses ditolak. Silakan login kembali.",
}