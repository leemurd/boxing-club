export const TYPES = {
  FirebaseApp: Symbol.for('FirebaseApp'),
  // punches
  IPunchRepository: Symbol.for('IPunchRepository'),
  GetPunchesUseCase: Symbol.for('GetPunchesUseCase'),
  // user
  IAuthRepository: Symbol.for('IAuthRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  // exercise
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
  ICategoryRepository: Symbol.for('ICategoryRepository'),
  // categories
  CategoryRepository: Symbol.for('CategoryRepository'),
  GetCategoriesUseCase: Symbol.for('GetCategoriesUseCase'),
  CreateCategoryUseCase: Symbol.for('CreateCategoryUseCase'),
  UpdateCategoryUseCase: Symbol.for('UpdateCategoryUseCase'),
  DeleteCategoryUseCase: Symbol.for('DeleteCategoryUseCase'),
  GetCategoryByIdUseCase: Symbol.for('GetCategoryByIdUseCase'),
  // tags
  ITagRepository: Symbol.for('ITagRepository'),
  GetTagsUseCase: Symbol.for('GetTagsUseCase'),
  GetTagByIdUseCase: Symbol.for('GetTagByIdUseCase'),
  CreateTagUseCase: Symbol.for('CreateTagUseCase'),
  UpdateTagUseCase: Symbol.for('UpdateTagUseCase'),
  DeleteTagUseCase: Symbol.for('DeleteTagUseCase')
}
