export const TYPES = {
  FirebaseApp: Symbol.for('FirebaseApp'),
  // punches
  IPunchRepository: Symbol.for('IPunchRepository'),
  GetPunchesUseCase: Symbol.for('GetPunchesUseCase'),
  // user
  IAuthRepository: Symbol.for('IAuthRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  // progress and records
  ITrainingRepository: Symbol.for('ITrainingRepository'),
  LogExerciseUseCase: Symbol.for('LogExerciseUseCase'),
  GetRecordsUseCase: Symbol.for('GetRecordsUseCase'),
  GetDailyTotalsUseCase: Symbol.for('GetDailyTotalsUseCase'),
  GetTotalsByCategoryUseCase: Symbol.for('GetTotalsByCategoryUseCase'),
  GetTotalsByTagUseCase: Symbol.for('GetTotalsByTagUseCase'),
  DeleteRecordUseCase: Symbol.for('DeleteRecordUseCase'),
  // exercise
  IExerciseRepository: Symbol.for('IExerciseRepository'),
  GetExercisesUseCase: Symbol.for('GetExercisesUseCase'),
  GetExerciseByIdUseCase: Symbol.for('GetExerciseByIdUseCase'),
  CreateExerciseUseCase: Symbol.for('CreateExerciseUseCase'),
  UpdateExerciseUseCase: Symbol.for('UpdateExerciseUseCase'),
  DeleteExerciseUseCase: Symbol.for('DeleteExerciseUseCase'),

  // combos
  CombinationRepository: Symbol.for('CombinationRepository'),
  GetCombinationsUseCase: Symbol.for('GetCombinationsUseCase'),
  SaveCombinationUseCase: Symbol.for('SaveCombinationUseCase'),
  UpdateCombinationUseCase: Symbol.for('UpdateCombinationUseCase'),
  DeleteCombinationUseCase: Symbol.for('DeleteCombinationUseCase'),
  GetCombinationByIdUseCase: Symbol.for('GetCombinationByIdUseCase'),
  // categories
  ICategoryRepository: Symbol.for('ICategoryRepository'),
  // CategoryRepository: Symbol.for('CategoryRepository'),
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
