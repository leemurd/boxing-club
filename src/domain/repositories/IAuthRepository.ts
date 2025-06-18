export interface IAuthRepository {
  signUp(email: string, password: string): Promise<any>
  signIn(email: string, password: string): Promise<any>
  signOut(): Promise<void>
}
