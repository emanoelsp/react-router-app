import axios from "axios"

export interface Usuario {
  nome: string
  sobrenome: string
  email: string
  cpf: string
  id?: string | number
}

const API_URL = "http://localhost:5000/usuarios"

export const getUsuarios = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const addUsuario = async (usuario: Usuario) => {
  const response = await axios.post(API_URL, usuario)
  return response.data
}

export const updateUsuario = async (id: string | number, usuario: Usuario) => {
  const response = await axios.put(`${API_URL}/${id}`, usuario)
  return response.data
}

export const deleteUsuario = async (id: string | number) => {
  await axios.delete(`${API_URL}/${id}`)
}

