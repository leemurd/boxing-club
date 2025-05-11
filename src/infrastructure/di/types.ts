export const TYPES = {
  IPunchRepository: Symbol.for('IPunchRepository'),
  GetPunchesUseCase: Symbol.for('GetPunchesUseCase'),
  FirebaseApp: Symbol.for('FirebaseApp'),
  IAuthRepository: Symbol.for('IAuthRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  ExerciseRepository: Symbol.for('ExerciseRepository'),
  LogExerciseUseCase: Symbol.for('LogExerciseUseCase'),
  GetUserStatsUseCase: Symbol.for('GetUserStatsUseCase'),
  GetExerciseHistoryUseCase: Symbol.for('GetExerciseHistoryUseCase'),
  ManageFavoriteExercisesUseCase: Symbol.for('ManageFavoriteExercisesUseCase'),

  // combos
  CombinationRepository: Symbol.for('CombinationRepository'),
  GetCombinationsUseCase: Symbol.for('GetCombinationsUseCase'),
  SaveCombinationUseCase: Symbol.for('SaveCombinationUseCase'),
  UpdateCombinationUseCase: Symbol.for('UpdateCombinationUseCase'),
  DeleteCombinationUseCase: Symbol.for('DeleteCombinationUseCase'),
  ICategoryRepository: Symbol.for('ICategoryRepository')
  // categories
}
