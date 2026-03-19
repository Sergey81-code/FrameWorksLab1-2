export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  phone?: string
  birth_date?: string
  created_at: string
  updated_at: string
}

export interface CreateUserDto {
  id: string
  name: string
  email: string
  passwordHash: string

}

export interface UpdateUserDto {
  name?: string
  phone?: string
  birth_date?: string
}