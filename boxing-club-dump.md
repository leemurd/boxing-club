### src/App.vue
```ts
<template>
  <div class="d-flex flex-column h-100">
    <header-main />
    <div
      class="container main-container"
      :class="{
        'main-container--timer-expanded': isTimerExpanded,
        'main-container--timer-visible': isTimerVisible
      }"
    >
      <h1 class="text-center mb-2">{{ $route.meta.name }}</h1>
      <router-view />
      <modal-container />
    </div>
    <footer-main/>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderMain from '@/presentation/components/layout/header/HeaderMain.vue'
import ModalContainer from '@/presentation/components/modals/ModalContainer.vue'
import FooterMain from '@/presentation/components/layout/footer/FooterMain.vue'
import { useTimerStore } from '@/presentation/stores/timerStore.ts'
import { storeToRefs } from 'pinia'

const timerStore = useTimerStore()
const { isTimerVisible, isTimerExpanded } = storeToRefs(timerStore)
</script>

<style scoped lang="scss">
$headerHeight: 55px;

.main-container {
  padding-top: 16px;
  padding-bottom: 12px;
  flex-grow: 1;
  transition: $transition-base;
  margin-top: $headerHeight;
  &--timer-visible {
    margin-top: calc($timerCollapsedHeight + $headerHeight);
    @media (min-width: 992px) {
      margin-top: calc($timerCollapsedHeight + $headerHeight + 10px);
    }
  }
  &--timer-expanded {
    margin-top: calc($timerExpandedHeight + $headerHeight)!important;
  }
}
</style>
```

### src/main.ts
```ts
import '@/presentation/styles/main.scss'
// import * as Popper from "@popperjs/core"
// import all as bootstrap from 'bootstrap'
import 'bootstrap/dist/js/bootstrap.min.js'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import { useAuthStore } from '@/presentation/stores/authStore'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './presentation/router'
import { useThemeStore } from '@/presentation/stores/themeStore'

const app = createApp(App)

const toastOptions: PluginOptions = {
  position: POSITION.TOP_CENTER,
  transition: 'fade',
  timeout: 2048 * 1.5,
  // timeout: false,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.65,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: false,
  rtl: false,
  maxToasts: 3
}

app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

app.mount('#app')

const authStore = useAuthStore()
authStore.init()
useThemeStore()
```

### src/application/useCases/ManageFavoriteExercisesUseCase.ts
```ts
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'

export class ManageFavoriteExercisesUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async getFavorites(userId: string): Promise<string[]> {
    return await this.exerciseRepo.getFavoriteExercises(userId)
  }

  async updateFavorites(userId: string, favorites: string[]): Promise<void> {
    await this.exerciseRepo.updateFavoriteExercises(userId, favorites)
  }
}
```

### src/application/useCases/GetExerciseHistoryUseCase.ts
```ts
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'

export class GetExerciseHistoryUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async execute(userId: string, days: number): Promise<TrainingRecord[]> {
    return await this.exerciseRepo.getExerciseHistory(userId, days)
  }
}
```

### src/application/useCases/generateRandomCombo.ts
```ts
import { type BoxingAction, BoxingActionType } from '@/domain/entities/BoxingAction'
import { getNextActions } from './getNextActions'
import { BoxingActionCategory } from '@/domain/entities/BoxingAction'

export function generateRandomCombo(allActions: BoxingAction[], counter: number = 5): BoxingAction[] {
  const combo: BoxingAction[] = []

  // Начинаем с джеба
  const jab = allActions.find(a => a.type === BoxingActionType.Jab)
  if (!jab) return combo

  combo.push(jab)
  let lastAction = jab

  // Счётчик промежуточных действий (movement/defense) с момента последнего удара
  let nonPunchCount = 0

  for (let i = 0; i < counter - 1; i++) {
    const rawNext = getNextActions(lastAction, allActions)

    // Отфильтруем кандидатов с учётом «не более 1 движения/защиты» между ударами
    const possibleNext = rawNext.filter(a => {
      // Если уже есть 1 nonPunch подряд, то следующий шаг должен быть удар
      if (nonPunchCount >= 1 && a.category !== BoxingActionCategory.PUNCH) {
        return false
      }
      return true
    })

    if (possibleNext.length === 0) break

    const randomIndex = Math.floor(Math.random() * possibleNext.length)
    const chosen = possibleNext[randomIndex]
    combo.push(chosen)

    // Обновляем lastAction
    lastAction = chosen

    // Если выбрали Punch, сбрасываем счётчик. Если Movement/Defense, увеличиваем
    if (chosen.category === BoxingActionCategory.PUNCH) {
      nonPunchCount = 0
    } else {
      nonPunchCount++
    }
  }

  return combo
}
```

### src/application/useCases/GetUserStatsUseCase.ts
```ts
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'

export class GetUserStatsUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async execute(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }> {
    return await this.exerciseRepo.getUserStats(userId)
  }
}
```

### src/application/useCases/CreateCombinationUseCase.ts
```ts
import { CombinationBuilder } from '@/domain/services/CombinationBuilder.ts'
import { Combination } from '@/domain/entities/Combination.ts'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

export class CreateCombinationUseCase {
  private builder: CombinationBuilder

  constructor(builder: CombinationBuilder) {
    this.builder = builder
  }

  addAction(action: BoxingAction) {
    this.builder.addAction(action)
  }

  buildCombination(title: string): Combination {
    return this.builder.build(title)
  }
}
```

### src/application/useCases/RegisterUserUseCase.ts
```ts
import { injectable, inject } from 'inversify'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(user: User): Promise<void> {
    await this.userRepository.createUser(user)
  }
}
```

### src/application/useCases/LogExerciseUseCase.ts
```ts
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'

export class LogExerciseUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async execute(userId: string, exerciseId: string, amount: number, unit: 'minutes' | 'repetitions'): Promise<void> {
    await this.exerciseRepo.logExercise(userId, exerciseId, amount, unit)
  }
}
```

### src/application/useCases/getNextActions.ts
```ts
import {
  type BoxingAction,
  BoxingActionCategory,
  BoxingActionSide,
  BoxingActionType
} from '@/domain/entities/BoxingAction'

export function getNextActions(lastAction: BoxingAction, all: BoxingAction[]): BoxingAction[] {
  // Особый случай для джеба (как раньше)
  if (lastAction.category === BoxingActionCategory.PUNCH && lastAction.type === BoxingActionType.Jab) {
    return all
  }

  // Разделяем логику по категориям:
  // Если последний action был PUNCH, то следующий PUNCH идёт другой рукой,
  // но следующий MOVEMENT/DEFENSE идёт той же рукой
  if (lastAction.category === BoxingActionCategory.PUNCH) {
    return all.filter(action => {
      if (action.category === BoxingActionCategory.PUNCH || action.category === BoxingActionCategory.DEFENSE) {
        if (lastAction.side === BoxingActionSide.LEAD) {
          return action.side === BoxingActionSide.REAR || action.side === BoxingActionSide.ANY
        }
        return action.side === BoxingActionSide.LEAD || action.side === BoxingActionSide.ANY
      }
      if (action.category === BoxingActionCategory.MOVEMENT) {
        return action.side === lastAction.side || action.side === BoxingActionSide.ANY
      }
      return false
    })
  }

  // Если последний action был MOVEMENT или DEFENSE,
  // то следующий PUNCH должен быть «противоположной» рукой,
  // а следующий MOVEMENT/DEFENSE остаётся на той же стороне
  if (lastAction.category === BoxingActionCategory.MOVEMENT || lastAction.category === BoxingActionCategory.DEFENSE) {
    return all.filter(action => {
      if (action.category === BoxingActionCategory.PUNCH) {
        // if slip next punch from the same side
        if (lastAction.type === BoxingActionType.Slip) {
          return action.side === lastAction.side || action.side === BoxingActionSide.ANY
        }
        // if block next punch from the same side
        if (lastAction.type === BoxingActionType.Block) {
          return action.side !== lastAction.side || action.side === BoxingActionSide.ANY
        }
        if (lastAction.side === BoxingActionSide.LEAD) { // if lastAction is left
          return action.side === BoxingActionSide.REAR || action.side === BoxingActionSide.ANY
        }
        if (lastAction.side === BoxingActionSide.REAR) { // if lastAction is right
          return action.side === BoxingActionSide.LEAD || action.side === BoxingActionSide.ANY
        }
        return true
      }
      if (action.category === BoxingActionCategory.MOVEMENT || action.category === BoxingActionCategory.DEFENSE) {
        return action.side === lastAction.side || action.side === BoxingActionSide.ANY
      }
      return false
    })
  }

  return all
}

```

### src/application/useCases/GetPunchesUseCase.ts
```ts
import { inject, injectable } from 'inversify';
import { type IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository.ts';
import { TYPES } from '@/infrastructure/di/types.ts';
import { type BoxingAction } from '@/domain/entities/BoxingAction';

@injectable()
export class GetPunchesUseCase {
  constructor(
    @inject(TYPES.IPunchRepository) private punchRepository: IBoxingActionRepository
  ) {}

  async execute(): Promise<BoxingAction[]> {
    return this.punchRepository.getAllActions();
  }

  async getPunchById(id: number): Promise<BoxingAction | null> {
    return this.punchRepository.getActionById(id);
  }
}
```

### src/application/useCases/getEnemyCard.ts
```ts
export enum BodyRelation {
  I_AM_BIGGER = 'i_am_bigger',
  I_AM_SMALLER = 'i_am_smaller',
  EQUAL = 'equal'
}

export type StanceSide =  'orthodox' | 'southpaw'
export type BoxerStyle =  'gamer' | 'puncher' | 'technician' | 'counterpuncher'
export type BoxerGuard =  'closed' | 'classical' | 'handsDown'

export interface FightOptions {
  heightRelation: BodyRelation
  weightRelation: BodyRelation
  myHandedness: StanceSide
  oppHandedness: StanceSide
  myStyle: BoxerStyle
  oppStyle: BoxerStyle
  myGuard: BoxerGuard
  oppGuard: BoxerGuard
}

export function getExtendedFightStrategy(opts: FightOptions): string[] {
  const parts: string[] = []

  // Анализ роста
  if (opts.heightRelation === BodyRelation.I_AM_BIGGER) {
    parts.push('Вы выше соперника, используйте дальнюю дистанцию и контроль ринга.')
  } else if (opts.heightRelation === BodyRelation.I_AM_SMALLER) {
    parts.push('Вы ниже соперника, действуйте за счёт скорости и поиска моментов на ближней дистанции.')
  } else {
    parts.push('У вас одинаковый рост, поэтому решающими факторами станут техника и тактика.')
  }
  // Анализ веса
  if (opts.weightRelation === BodyRelation.I_AM_BIGGER) {
    parts.push('У вас преимущество в массе, что помогает при прессинге и клинче.')
  } else if (opts.weightRelation === BodyRelation.I_AM_SMALLER) {
    parts.push('Соперник тяжелее, значит вам стоит опираться на подвижность и неожиданные атаки.')
  } else {
    parts.push('Вес примерно равный, здесь всё будет зависеть от навыков и стратегии боя.')
  }
  // Ориентация (правша/левша)
  if (opts.myHandedness !== opts.oppHandedness) {
    parts.push('Ваши стойки противоположны, значит, углы атак будут отличаться от классических.')
    parts.push('Тщательно отслеживайте позицию ведущей ноги, чтобы не пропустить встречный удар с неожиданных направлений.')
  } else {
    parts.push('У вас одинаковые стойки, что упростит чтение движений, но важнее станет техника и скорость исполнения.')
    parts.push('Ищите моменты для резких контратак, поскольку оба привыкли к классической траектории ударов.')
  }

  // Стили
  if (opts.myStyle === 'puncher' && opts.oppStyle === 'technician') {
    parts.push('Вы агрессивный панчер, соперник — технарь, значит, ему будет комфортнее вести бой с дистанции и разбирать вас по точности.')
    parts.push('Старайтесь ломать ритм, навязывая силовую борьбу, и не дайте технарю спокойно «читать» ваши атаки.')
  } else if (opts.myStyle === 'counterpuncher' && opts.oppStyle === 'puncher') {
    parts.push('Вы контрпанчер, соперник — панчер, значит, он будет стремиться взорваться серией мощных ударов.')
    parts.push('Ваша задача — выманивать его на риск и ловить в момент атаки быстрыми ответными ударами.')
  } else {
    parts.push('Анализируйте базовые сильные стороны своего стиля и старайтесь искать уязвимости в стиле соперника.')
    parts.push('Если ваш оппонент любит постоянный прессинг, отвечайте движением и точными контрвыпадами; если он осторожен, давите и поджимайте.')
  }

  // Гварды
  if (opts.myGuard === 'closed' && opts.oppGuard === 'handsDown') {
    parts.push('У вас более надёжная защита, поэтому не бойтесь идти вперёд и вынуждать соперника раскрыться.')
    parts.push('Как только видите, что его руки опущены, вбрасывайте быстрые удары, заставляя его тратить силы на блоки.')
  } else if (opts.myGuard === 'handsDown' && opts.oppGuard !== 'handsDown') {
    parts.push('Ваш стиль предполагает быстрые реакции и постоянную работу корпусом, но любая ошибка может стоить дорого.')
    parts.push('Не заигрывайтесь с «руками внизу» и ищите моменты для внезапных атак, совмещая финты и резкие выпады.')
  } else {
    parts.push('Если у вас классическая или закрытая стойка, а соперник нет, используйте стабильность защиты и работайте преимущественно первым номером.')
    parts.push('Если наоборот, будьте готовы к плотному прессингу и готовьте контрвыпады, исходя из того, где у противника слабые места.')
  }

  // Итоговый текст
  // return parts.join('<br>')
  return parts
}
```

### src/infrastructure/mocks/mockActions.ts
```ts
import {
  type BoxingAction,
  BoxingActionCategory,
  BoxingActionSide,
  BoxingActionType
} from '@/domain/entities/BoxingAction'

export const MOCK_ACTIONS: BoxingAction[] = [
  // punches
  {
    id: 1,
    name: 'Jab',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Jab
  },
  {
    id: 2,
    name: 'Cross',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Cross
  },
  {
    id: 3,
    name: 'L hook',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Hook
  },
  {
    id: 4,
    name: 'R hook',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Hook
  },
  {
    id: 5,
    name: 'L uppercut',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Uppercut
  },
  {
    id: 6,
    name: 'R uppercut',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Uppercut
  },
  // movements

  {
    id: 21,
    name: 'Slip L',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Slip
  },
  {
    id: 22,
    name: 'Slip R',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Slip
  },
  {
    id: 23,
    name: 'Roll LR',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Roll
  },
  {
    id: 24,
    name: 'Roll RL',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Roll
  },
  {
    id: 26,
    name: 'Circle L',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Pivot
  },
  {
    id: 27,
    name: 'Circle R',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Pivot
  },
  {
    id: 28,
    name: 'Shift L',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Shift
  },
  {
    id: 29,
    name: 'Shift R',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Shift
  },
  // { id: 20, name: 'Duck', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: BoxingActionType.Duck },
  {
    id: 25,
    name: 'Step back',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.ANY,
    type: BoxingActionType.Step
  },
  // defense
  {
    id: 40,
    name: 'Block L',
    category: BoxingActionCategory.DEFENSE,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Block
  },
  {
    id: 41,
    name: 'Block R',
    category: BoxingActionCategory.DEFENSE,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Block
  }
]
```

### src/infrastructure/di/container.ts
```ts
import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import type { IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository'
import { BoxingActionRepositoryMock } from '@/infrastructure/data/BoxingActionRepositoryMock'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase'
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig'
import { AuthRepositoryFirebase } from '@/infrastructure/data/AuthRepositoryFirebase'
import { UserRepositoryFirebase } from '@/infrastructure/data/UserRepositoryFirebase'

import { LogExerciseUseCase } from '@/application/useCases/LogExerciseUseCase'
import { GetUserStatsUseCase } from '@/application/useCases/GetUserStatsUseCase'
import { GetExerciseHistoryUseCase } from '@/application/useCases/GetExerciseHistoryUseCase'
import { ManageFavoriteExercisesUseCase } from '@/application/useCases/ManageFavoriteExercisesUseCase'
import { ExerciseRepositoryImpl } from '@/infrastructure/data/ExerciseRepositoryImpl'

const container = new Container()

// Регистрируем репозитории
container.bind<IBoxingActionRepository>(TYPES.IPunchRepository).to(BoxingActionRepositoryMock).inSingletonScope()
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepositoryFirebase).inSingletonScope()
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryFirebase).inSingletonScope()
container.bind(TYPES.ExerciseRepository).to(ExerciseRepositoryImpl).inSingletonScope()

// Регистрируем use case'ы для упражнений
container.bind<GetPunchesUseCase>(TYPES.GetPunchesUseCase).to(GetPunchesUseCase).inSingletonScope()

container
  .bind(TYPES.LogExerciseUseCase)
  .toDynamicValue((ctx) => new LogExerciseUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
container
  .bind(TYPES.GetUserStatsUseCase)
  .toDynamicValue((ctx) => new GetUserStatsUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
container
  .bind(TYPES.GetExerciseHistoryUseCase)
  .toDynamicValue((ctx) => new GetExerciseHistoryUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
container
  .bind(TYPES.ManageFavoriteExercisesUseCase)
  .toDynamicValue((ctx) => new ManageFavoriteExercisesUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
//
container.bind(TYPES.FirebaseApp).toConstantValue(firebaseApp)

export { container }
```

### src/infrastructure/di/types.ts
```ts
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
  ManageFavoriteExercisesUseCase: Symbol.for('ManageFavoriteExercisesUseCase')

  //

  // IAuthRepository: Symbol.for('IAuthRepository'),
  // IUserRepository: Symbol.for('IUserRepository'),
  // ExerciseRepository: Symbol.for('ExerciseRepository'),
  // LogExerciseUseCase: Symbol.for('LogExerciseUseCase'),
  // GetUserStatsUseCase: Symbol.for('GetUserStatsUseCase'),
  // GetExerciseHistoryUseCase: Symbol.for('GetExerciseHistoryUseCase'),
  // ManageFavoriteExercisesUseCase: Symbol.for('ManageFavoriteExercisesUseCase'),
  // FirebaseApp: Symbol.for('FirebaseApp')
}
```

### src/infrastructure/firebase/firebaseConfig.ts
```ts
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// При необходимости импортируйте другие сервисы (firestore, auth, storage и т.д.)

const firebaseConfig = {
  apiKey: 'AIzaSyAiu8kdIgxf1INelHF62VIuVJTaFwzIIQM',
  authDomain: 'boxing-club-e1de8.firebaseapp.com',
  projectId: 'boxing-club-e1de8',
  storageBucket: 'boxing-club-e1de8.firebasestorage.app',
  messagingSenderId: '500885425374',
  appId: '1:500885425374:web:16099d38364ccd1974864f',
  measurementId: 'G-FP306CTB77'
}

const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { firebaseApp, db, auth, analytics }
```

### src/infrastructure/data/AuthRepositoryFirebase.ts
```ts
// src/infrastructure/repositoryImpl/AuthRepositoryFirebase.ts
import { type IAuthRepository } from '@/domain/repositories/IAuthRepository'
import { auth } from '@/infrastructure/firebase/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { injectable } from 'inversify'

@injectable()
export class AuthRepositoryFirebase implements IAuthRepository {
  async signUp(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  async signIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async signOut(): Promise<void> {
    return signOut(auth)
  }
}
```

### src/infrastructure/data/UserRepositoryFirebase.ts
```ts
import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import { injectable } from 'inversify'

@injectable()
export class UserRepositoryFirebase implements IUserRepository {
  async createUser(user: User): Promise<void> {
    const userDoc = doc(db, 'users', user.id)
    await setDoc(userDoc, user, { merge: true })
  }

  async getUser(userId: string): Promise<User | null> {
    const userDoc = doc(db, 'users', userId)
    const docSnap = await getDoc(userDoc)
    if (docSnap.exists()) {
      return docSnap.data() as User
    }
    return null
  }

  async updateUser(user: User): Promise<void> {
    const userDoc = doc(db, 'users', user.id)
    await setDoc(userDoc, user, { merge: true })
  }
}
```

### src/infrastructure/data/ExerciseRepositoryImpl.ts
```ts
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ExerciseCategory, type MeasurementUnit } from '@/domain/entities/Exercise.ts'
import { EXERCISES } from '@/domain/constants/exercises.ts'

export class ExerciseRepositoryImpl implements IExerciseRepository {
  private logsCollection(userId: string) {
    return collection(db, `users/${userId}/exerciseLogs`)
  }

  private userDoc(userId: string) {
    return doc(db, 'users', userId)
  }

  async logExercise(userId: string, exerciseId: string, amount: number, unit: MeasurementUnit): Promise<void> {
    const timestamp = new Date().toISOString()
    const newRecord: Omit<TrainingRecord, 'id'> = {
      userId,
      exerciseId,
      category: EXERCISES.find((item) => item.id === exerciseId)?.category || ExerciseCategory.PHYSICS,
      measurement: unit,
      amount,
      timestamp
    }
    await setDoc(doc(this.logsCollection(userId)), newRecord)
  }

  async getUserStats(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }> {
    const logsSnapshot = await getDocs(this.logsCollection(userId))
    const stats: { [exerciseId: string]: { today: number; total: number } } = {}
    const todayStr = new Date().toDateString()

    logsSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as TrainingRecord
      const exId = data.exerciseId
      if (!stats[exId]) {
        stats[exId] = {
          today: 0,
          total: 0
        }
      }
      stats[exId].total += data.amount
      if (new Date(data.timestamp).toDateString() === todayStr) {
        stats[exId].today += data.amount
      }
    })
    return stats
  }

  async getExerciseHistory(userId: string, days: number): Promise<TrainingRecord[]> {
    const logsSnapshot = await getDocs(this.logsCollection(userId))
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const history: TrainingRecord[] = []
    logsSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as TrainingRecord
      if (new Date(data.timestamp) >= startDate) {
        history.push({
          id: docSnap.id,
          ...data
        })
      }
    })
    // Сортируем по убыванию времени
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return history
  }

  async getFavoriteExercises(userId: string): Promise<string[]> {
    const userSnap = await getDoc(this.userDoc(userId))
    return userSnap.exists() ? userSnap.data()?.favorites || [] : []
  }

  async updateFavoriteExercises(userId: string, favorites: string[]): Promise<void> {
    await setDoc(this.userDoc(userId), { favorites }, { merge: true })
  }
}
```

### src/infrastructure/data/BoxingActionRepositoryMock.ts
```ts
import { injectable } from 'inversify';
import { type IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository';
import { type BoxingAction } from '@/domain/entities/BoxingAction.ts'
import { MOCK_ACTIONS } from '../mocks/mockActions';

@injectable()
export class BoxingActionRepositoryMock implements IBoxingActionRepository {
  async getAllActions(): Promise<BoxingAction[]> {
    return MOCK_ACTIONS;
  }

  async getActionById(id: number): Promise<BoxingAction | null> {
    return MOCK_ACTIONS.find(a => a.id === id) || null;
  }
}
```

### src/domain/constants/exercises.ts
```ts
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise'

export const EXERCISES: Exercise[] = [
  // Группа "Техника"
  {
    id: '11',
    name: 'Shadow boxing',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  {
    id: '12',
    name: 'Shadow boxing with additional weight',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  {
    id: '27',
    name: 'Boxing school (technique)',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  {
    id: '16',
    name: 'Footwork drills',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  // {
  //   id: '33_t',
  //   name: 'Custom (technique)',
  //   category: ExerciseCategory.TECHNIQUE,
  //   measurement: 'minutes',
  //   isCustom: true
  // },

  // Группа "Сила и Выносливость"
  {
    id: '1',
    name: 'Push-ups',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '6',
    name: 'Squats',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '8',
    name: 'Squats with additional weight',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '34',
    name: 'Pull-ups on the horizontal bar',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '16_s',
    name: 'Jumping rope',
    category: ExerciseCategory.PHYSICS,
    measurement: 'minutes'
  },
  {
    id: '31',
    name: 'Accelerated punches with additional weight',
    category: ExerciseCategory.PHYSICS,
    measurement: 'minutes'
  },
  {
    id: '24',
    name: 'Dumbbell strength exercises',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  // {
  //   id: '22',
  //   name: 'Crunches (hooks)',
  //   category: ExerciseCategory.PHYSICS,
  //   measurement: 'repetitions'
  // },

  // Группа "Практика"
  {
    id: '28',
    name: 'Punching the bag',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  {
    id: '26',
    name: 'Work on the pads',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  {
    id: '29',
    name: 'Exercises in pairs',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  {
    id: '30',
    name: 'Sparring',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  // {
  //   id: '31_p',
  //   name: 'Кастом (практика)',
  //   category: ExerciseCategory.PRACTICE,
  //   measurement: 'minutes',
  //   isCustom: true
  // }
]
```

### src/domain/repositories/IUserRepository.ts
```ts
import type { User } from '@/domain/entities/User.ts'

export interface IUserRepository {
  createUser(user: User): Promise<void>
  getUser(userId: string): Promise<User | null>
  updateUser(user: User): Promise<void>
  // Дополнительные методы, если нужны (например, удаление)
}
```

### src/domain/repositories/IExerciseRepository.ts
```ts
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'

export interface IExerciseRepository {
  logExercise(userId: string, exerciseId: string, amount: number, unit: 'minutes' | 'repetitions'): Promise<void>

  getUserStats(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }>

  getExerciseHistory(userId: string, days: number): Promise<TrainingRecord[]>

  getFavoriteExercises(userId: string): Promise<string[]>

  updateFavoriteExercises(userId: string, favorites: string[]): Promise<void>
}
```

### src/domain/repositories/IBoxingActionRepository.ts
```ts
import { type BoxingAction } from '../entities/BoxingAction';

export interface IBoxingActionRepository {
  getAllActions(): Promise<BoxingAction[]>;
  getActionById(id: number): Promise<BoxingAction | null>;
}
```

### src/domain/repositories/IAuthRepository.ts
```ts
export interface IAuthRepository {
  signUp(email: string, password: string): Promise<any>
  signIn(email: string, password: string): Promise<any>
  signOut(): Promise<void>
  // Добавьте другие методы по необходимости (например, обновление профиля, сброс пароля и пр.)
}
```

### src/domain/services/CombinationBuilder.ts
```ts
import { Combination } from '../entities/Combination'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

export class CombinationBuilder {
  private actions: BoxingAction[] = []

  addAction(action: BoxingAction): CombinationBuilder {
    this.actions.push(action)
    return this
  }

  reset(): CombinationBuilder {
    this.actions = []
    return this
  }

  build(title: string): Combination {
    // В реальном случае тут могла бы быть логика валидации и т.д.
    return new Combination(Date.now(), title, [...this.actions])
  }
}
```

### src/domain/entities/TrainingRecord.ts
```ts
import { ExerciseCategory } from '@/domain/entities/Exercise.ts'

export interface TrainingRecord {
  id?: string // Firestore генерирует ID
  userId: string
  exerciseId: string
  category: ExerciseCategory
  measurement: 'minutes' | 'repetitions'
  amount: number
  timestamp: string // ISO строка
}
```

### src/domain/entities/BoxingAction.ts
```ts
export enum BoxingActionCategory {
  PUNCH = 'punch',
  MOVEMENT = 'movement',
  DEFENSE = 'defense'
}

export enum BoxingActionSide {
  LEAD = 'lead',
  REAR = 'rear',
  ANY = 'any'
}

export enum BoxingActionType {
  Jab = 'jab',
  Cross = 'cross',
  Hook = 'hook',
  Uppercut = 'uppercut',
  Duck = 'duck',
  Slip = 'slip',
  Roll = 'roll',
  Step = 'step',
  Pivot = 'pivot',
  Shift = 'shift',
  Block = 'block'
}

export interface BoxingAction {
  id: number
  name: string
  category: BoxingActionCategory
  side: BoxingActionSide
  type: BoxingActionType
}
```

### src/domain/entities/Exercise.ts
```ts
export enum ExerciseCategory {
  TECHNIQUE = 'Technique',
  PHYSICS = 'Physics',
  PRACTICE = 'Practice'
}

export type MeasurementUnit = 'minutes' | 'repetitions'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  measurement: MeasurementUnit
  isCustom?: boolean // true, если упражнение создано пользователем
}
```

### src/domain/entities/Combination.ts
```ts
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

/**
 * Модель «Комбинация ударов» (связка)
 */
export class Combination {
  constructor(
    public id: number,
    public title: string,
    public punches: BoxingAction[] = []
  ) {}
}
```

### src/domain/entities/User.ts
```ts
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  nickname: string
  role?: string
}
```

### src/presentation/stores/timerStore.ts
```ts
import { defineStore } from 'pinia'
import { computed, reactive, ref, type ComputedRef } from 'vue'

type TimerMode = 'countdown' | 'stopwatch'
type TimerUnit = 'seconds' | 'minutes'

interface TimerState {
  timerState: ComputedRef
  timerValue: ComputedRef<number>
  formattedTime: ComputedRef<string>
  isTimerExpanded: ComputedRef
  isTimerRunning: ComputedRef
  isTimerVisible: ComputedRef
  timerMode: ComputedRef<TimerMode>
  timerUnit: ComputedRef<TimerUnit>
  initialInput: ComputedRef<number>
  toggleExpandTimer: () => void
  toggleRunTimer: () => void
  toggleTimerVisible: () => void
  closeTimer: () => void
  resetTimer: () => void
  setMode: (mode: TimerMode) => void
  setInitialInput: (value: number) => void
  setUnit: (unit: TimerUnit) => void
}

export const useTimerStore = defineStore('timer', (): TimerState => {
  const timerState = reactive({
    isVisible: true,
    isExpanded: false,
    isRunning: false,
    mode: 'stopwatch' as TimerMode,
    unit: 'seconds' as TimerUnit,
    initialInput: 180
  })

  const time = ref(timerState.mode === 'stopwatch' ? 0 : timerState.initialInput)
  const intervalId = ref<number | null>(null)

  const formattedTime = computed(() => {
    const minutes = Math.floor(time.value / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (time.value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  const startTimer = () => {
    if (intervalId.value !== null) return
    intervalId.value = setInterval(() => {
      if (timerState.mode === 'countdown') {
        if (time.value > 0) {
          time.value--
        } else {
          stopTimer()
        }
      } else {
        time.value++
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    time.value = timerState.mode === 'countdown'
      ? timerState.unit === 'minutes' ? timerState.initialInput * 60 : timerState.initialInput
      : 0
    timerState.isRunning = false
  }

  const toggleExpandTimer = () => {
    timerState.isExpanded = !timerState.isExpanded
  }

  const toggleRunTimer = () => {
    timerState.isRunning = !timerState.isRunning
    if (timerState.isRunning) startTimer()
    else stopTimer()
  }

  const toggleTimerVisible = () => {
    timerState.isVisible = !timerState.isVisible
    if (!timerState.isVisible) {
      closeTimer()
    }
  }

  const closeTimer = () => {
    timerState.isVisible = false
    timerState.isExpanded = false
    timerState.isRunning = false
    resetTimer()
  }

  const setMode = (mode: TimerMode) => {
    timerState.mode = mode
    resetTimer()
  }

  const setUnit = (unit: TimerUnit) => {
    timerState.unit = unit
    resetTimer()
  }

  const setInitialInput = (value: number) => {
    timerState.initialInput = value
    if (timerState.mode === 'countdown') {
      time.value = timerState.unit === 'minutes' ? value * 60 : value
    }
  }

  return {
    timerState: computed(() => timerState),
    timerValue: computed(() => time.value),
    formattedTime,
    isTimerVisible: computed(() => timerState.isVisible),
    isTimerExpanded: computed(() => timerState.isExpanded),
    isTimerRunning: computed(() => timerState.isRunning),
    timerMode: computed(() => timerState.mode),
    timerUnit: computed(() => timerState.unit),
    initialInput: computed(() => timerState.initialInput),
    toggleExpandTimer,
    toggleRunTimer,
    toggleTimerVisible,
    closeTimer,
    resetTimer,
    setMode,
    setInitialInput,
    setUnit
  }
})
```

### src/presentation/stores/authStore.ts
```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import { useThemeStore } from '@/presentation/stores/themeStore.ts'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(true)
  const error = ref('')

  const authRepo = container.get<IAuthRepository>(TYPES.IAuthRepository)
  const userRepo = container.get<IUserRepository>(TYPES.IUserRepository)
  const auth = getAuth()
  const exerciseStore = useExerciseStore()

  function init() {
    onAuthStateChanged(auth, async (user) => {
      loading.value = false
      if (user) {
        isLoggedIn.value = true
        currentUser.value = await userRepo.getUser(user.uid)
        const themeStore = useThemeStore()
        await themeStore.loadThemeFromFirebase()
      } else {
        isLoggedIn.value = false
        currentUser.value = null
      }
    })
  }

  async function login(email: string, password: string) {
    try {
      await authRepo.signIn(email, password)
      error.value = ''
      isLoggedIn.value = true
    } catch (err: any) {
      error.value = err.message
      isLoggedIn.value = false
    }
  }

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    nickname: string
  ) {
    try {
      const result = await authRepo.signUp(email, password)
      const { uid } = result.user
      const newUser: User = {
        id: uid,
        email,
        firstName,
        lastName,
        nickname,
        role: 'user'
      }
      await userRepo.createUser(newUser)
      error.value = ''
    } catch (err: any) {
      error.value = err.message
    }
  }

  async function logout() {
    try {
      await authRepo.signOut()
      error.value = ''
      isLoggedIn.value = false
      exerciseStore.clearStats()
    } catch (err: any) {
      error.value = err.message
    }
  }

  return {
    currentUser,
    isLoggedIn,
    loading,
    error,
    init,
    login,
    register,
    logout
  }
})
```

### src/presentation/stores/exerciseStore.ts
```ts
import { defineStore } from 'pinia'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import { useAuthStore } from '@/presentation/stores/authStore'
import type { LogExerciseUseCase } from '@/application/useCases/LogExerciseUseCase.ts'
import type { GetUserStatsUseCase } from '@/application/useCases/GetUserStatsUseCase.ts'
import type { GetExerciseHistoryUseCase } from '@/application/useCases/GetExerciseHistoryUseCase.ts'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import type { ManageFavoriteExercisesUseCase } from '@/application/useCases/ManageFavoriteExercisesUseCase.ts'
import { ref } from 'vue'
import type { Exercise } from '@/domain/entities/Exercise.ts'
import { TimeRange } from '@/presentation/components/shared/types.ts'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useExerciseStore = defineStore('exercise', () => {
  const stats = ref()
  const history = ref<TrainingRecord[]>([])
  const favorites = ref<string[]>([])
  const exercises = ref<Exercise[]>([])
  const authStore = useAuthStore()

  async function logExercise(exerciseId: string, amount: number, unit: 'minutes' | 'repetitions') {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      await container.get<LogExerciseUseCase>(TYPES.LogExerciseUseCase).execute(userId, exerciseId, amount, unit)
      await loadStats()
    } catch (err) {
      toast.error(err)
    }
  }
  async function loadStats() {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      stats.value = await container.get<GetUserStatsUseCase>(TYPES.GetUserStatsUseCase).execute(userId)
    } catch (err) {
      toast.error(err)
    }
  }
  async function loadHistory(days: number) {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      history.value = await container.get<GetExerciseHistoryUseCase>(TYPES.GetExerciseHistoryUseCase).execute(userId, days)
    } catch (err) {
      toast.error(err)
    }
  }
  async function loadFavorites() {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      favorites.value = await container
        .get<ManageFavoriteExercisesUseCase>(TYPES.ManageFavoriteExercisesUseCase)
        .getFavorites(userId)
    } catch (err) {
      toast.error(err)
    }
  }
  async function updateFavorites(favs: string[]) {
    const userId = authStore.currentUser?.id
    if (!userId) return
    try {
      await container.get<ManageFavoriteExercisesUseCase>(TYPES.ManageFavoriteExercisesUseCase).updateFavorites(userId, favs)
      favorites.value = favs
    } catch (err) {
      toast.error(err)
    }
  }
  function getStatsForPeriod(exerciseId: string, timeRange: TimeRange): number {
    if (!stats.value) return 0
    const stat = stats.value[exerciseId]
    if (!stat) return 0
    return timeRange === 'today' ? stat.today : stat.total
  }
  async function loadExercises() {
    const { EXERCISES } = await import('@/domain/constants/exercises')
    exercises.value = EXERCISES
  }

  function clearStats() {
    stats.value = undefined
    history.value = []
    favorites.value = []
    exercises.value = []
  }

  return {
    stats,
    history,
    favorites,
    exercises,
    logExercise,
    loadStats,
    loadHistory,
    loadFavorites,
    updateFavorites,
    getStatsForPeriod,
    loadExercises,
    clearStats
  }
})
```

### src/presentation/stores/themeStore.ts
```ts
// src/stores/themeStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/infrastructure/firebase/firebaseConfig'

export const useThemeStore = defineStore('theme', () => {
  const isDarkTheme = ref(false)
  // Загрузка из localStorage при инициализации
  const storedTheme = localStorage.getItem('darkTheme')
  if (storedTheme !== null) {
    isDarkTheme.value = storedTheme === 'true'
  }

  // Следим за изменениями и обновляем атрибут, localStorage и Firebase
  watch(
    isDarkTheme,
    (newVal) => {
      document.documentElement.setAttribute('data-bs-theme', newVal ? 'dark' : 'light')
      localStorage.setItem('darkTheme', newVal.toString())
      saveThemeToFirebase(newVal)
    },
    { immediate: true }
  )

  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value
  }

  async function loadThemeFromFirebase() {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      const prefDoc = doc(db, 'preferences', user.uid)
      const snap = await getDoc(prefDoc)
      if (snap.exists()) {
        const data = snap.data()
        if (typeof data.darkTheme === 'boolean') {
          isDarkTheme.value = data.darkTheme
        }
      }
    }
  }

  async function saveThemeToFirebase(theme: boolean) {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      const prefDoc = doc(db, 'preferences', user.uid)
      await setDoc(prefDoc, { darkTheme: theme }, { merge: true })
    }
  }

  return {
    isDarkTheme,
    toggleTheme,
    loadThemeFromFirebase
  }
})
```

### src/presentation/modals/modalMap.ts
```ts
import { type Component, markRaw } from 'vue'
import ConfirmationModal from '@/presentation/components/modals/ConfirmationModal.vue'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import BaseModal from '@/presentation/components/modals/BaseModal.vue'

export const modalMap: Record<ModalKey, Component> = {
  [ModalKey.BASE_MODAL]: markRaw(BaseModal),
  [ModalKey.CONFIRMATION]: markRaw(ConfirmationModal)
}
```

### src/presentation/modals/modalKeys.ts
```ts
export enum ModalKey {
  CONFIRMATION = 'confirmation',
  BASE_MODAL = 'baseModal'
}
```

### src/presentation/utils/onUserLoaded.ts
```ts
import { watch } from 'vue'
import { useAuthStore } from '@/presentation/stores/authStore'

export function onUserLoaded(callback: () => void): void {
  const authStore = useAuthStore()
  if (authStore.currentUser) {
    callback()
  } else {
    const stop = watch(
      () => authStore.currentUser,
      (newUser) => {
        if (newUser) {
          callback()
          stop() // прекращаем наблюдение после загрузки пользователя
        }
      }
    )
  }
}
```

### src/presentation/composition/useModalService.ts
```ts
import { reactive } from 'vue'
import type { Component } from 'vue'
import { ModalKey } from '@/presentation/modals/modalKeys'
import { modalMap } from '@/presentation/modals/modalMap'

export interface ModalState {
  isOpen: boolean
  component: Component | null
  props: Record<string, any>
}

const modalState = reactive<ModalState>({
  isOpen: false,
  component: null,
  props: {}
})

export function openModalByKey(key: ModalKey, props: Record<string, any> = {}): void {
  const component = modalMap[key]
  if (component) {
    modalState.component = component
    modalState.props = props
    modalState.isOpen = true
  } else {
    console.error(`Modal with key "${key}" not found.`)
  }
}

export function closeModal(): void {
  modalState.isOpen = false
  modalState.component = null
  modalState.props = {}
}

export function useModalService() {
  return {
    modalState,
    openModalByKey,
    closeModal
  }
}
```

### src/presentation/components/trainings/ExerciseLogger.vue
```ts
<template>
  <div class="exercise-logger">
    <h6 class="text-center mb-3">{{ selectedExercise?.name }}</h6>
    <div class="small text-center text-muted">Add {{ selectedExercise?.measurement }}</div>

    <div class="d-flex gap-2 mb-2">
      <div class="col">
        <b-button
          color="secondary"
          outline
          class="px-3 w-100"
          @click="numOfRepetitions--"
        >-</b-button>
      </div>
      <div class="col">
        <b-input
          v-model="numOfRepetitions"
          type="number"
          placeholder="Count"
          class="text-center"
        />
      </div>
      <div class="col">
        <b-button
          color="secondary"
          outline
          class="px-3 w-100"
          @click="numOfRepetitions++"
        >+</b-button>
      </div>
    </div>

    <b-button
      color="primary"
      class="w-100"
      @click="logRepetitions(numOfRepetitions)"
    >
      Add progress
    </b-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import type { Exercise } from '@/domain/entities/Exercise'
import BInput from '@/presentation/components/shared/BInput.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useToast } from "vue-toastification"

const props = defineProps<{ selectedExercise: Exercise | null }>()
const store = useExerciseStore()
const toast = useToast()
const numOfRepetitions = ref<number>(10)

// Повторения
const logRepetitions = async (amount: number) => {
  if (props.selectedExercise) {
    try {
      await store.logExercise(props.selectedExercise.id, amount, 'repetitions')
      toast.success(
        `${numOfRepetitions.value} ${props.selectedExercise?.measurement} of ${props.selectedExercise?.name} added successfully`
      )
    } catch (e) {
      toast.error(e)
    }
  }
}

</script>

<style lang="scss" scoped>
.max-w50pr {
  max-width: 50%;
}
</style>
```

### src/presentation/components/layout/footer/FooterMain.vue
```ts
<template>
  <div
    v-if="!isLoading"
    class="footer navbar navbar-expand-lg bg-secondary-subtle"
  >
    <ul class="navbar-nav align-items-center w-100 mb-2 mb-lg-0">
      <li
        v-for="(route, index) in visibleRoutes"
        :key="index"
        class="nav-item"
        :class="[index === visibleRoutes.length - 1 ? 'ms-lg-auto' : '']"
      >
        <router-link
          class="nav-link"
          :to="route.path"
          active-class="active fw-semibold"
        >
          {{ route.meta.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const routes = router.getRoutes()
const isLoading = computed(() => authStore.loading)

const userRoutes = computed(() => routes.filter((route) => route.meta?.tags?.includes('userRoute')))
const authRoutes = computed(() => routes.filter((route) => route.meta?.tags?.includes('authRoute')))
const visibleRoutes = computed(() => {
  if (isLoading.value) {
    return []
  } else {
    return authStore.isLoggedIn ? userRoutes.value : authRoutes.value
  }
})
</script>

<style scoped lang="scss">
@import '@/presentation/styles/mixins';

.footer {
  .nav-link {
    @include slabFont;
  }
}
</style>
```

### src/presentation/components/layout/header/BcTimer.vue
```ts
<template>
  <div
    ref="timerEl"
    class="bc-timer"
    :class="{ 'bc-timer--expanded': isTimerExpanded }"
    @click="toggleExpandTimer"
  >
    <div class="bc-timer-header">
      <div class="bc-timer-counter">{{ formattedTime }}</div>
      <div
        class="bc-timer-btns"
        @click.stop.prevent
      >
        <i
          v-if="isTimerRunning"
          class="bi bi-stop-fill bc-timer-btns__item"
          @click="resetTimer"
        />
        <i
          :class="[`bi bi-${isTimerRunning ? 'pause' : 'play'}-fill bc-timer-btns__item`]"
          @click="toggleRunTimer"
        />
        <i
          class="bi bi-x bc-timer-btns__item"
          @click="closeTimer"
        />
      </div>
    </div>

    <div
      class="bc-timer-body"
      @click.stop
    >
      <div class="mt-3"/>
      <b-button-group
        v-model="modelTimerMode"
        :items="['stopwatch', 'countdown']"
        :disabled="isTimerRunning"
        class="w-100"
        color="light"
        outline
      >
        <template #default="{ item }">
          <span class="text-capitalize">{{ item }}</span>
        </template>
      </b-button-group>

      <div
        v-if="timerMode === 'countdown'"
        class="mt-3"
      >
        <div class="input-group mb-3">
          <select
            v-model="selectedUnit"
            class="form-select"
            :disabled="isTimerRunning"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
          </select>

          <b-input
            id="secondsInput"
            v-model.number="inputValue"
            type="number"
            min="1"
            :disabled="isTimerRunning"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimerStore } from '@/presentation/stores/timerStore'
import { storeToRefs } from 'pinia'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import BInput from '@/presentation/components/shared/BInput.vue'

const timerEl = ref()
const timerStore = useTimerStore()

const {
  isTimerExpanded,
  isTimerRunning,
  formattedTime,
  timerMode,
  timerUnit,
  initialInput
} = storeToRefs(timerStore)

const {
  toggleExpandTimer,
  toggleRunTimer,
  closeTimer,
  resetTimer,
  setMode,
  setInitialInput,
  setUnit
} = timerStore

const modelTimerMode = computed({
  get: () => timerMode.value,
  set: (val: 'countdown' | 'stopwatch') => setMode(val)
})

const selectedUnit = computed({
  get: () => timerUnit.value,
  set: (val: 'seconds' | 'minutes') => setUnit(val)
})

const inputValue = computed({
  get: () => initialInput.value,
  set: (val: number) => setInitialInput(val)
})
</script>

<style scoped lang="scss">
@import "@/presentation/styles/mixins";



.bc-timer {
  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  background: $blue-700;
  transition: $transition-base;
  padding: 10px 20px;
  color: $white;
  min-height: $timerCollapsedHeight;
  cursor: pointer;
  &--expanded {
    .bc-timer-body {
      min-height: $timerBodyHeight;
      max-height: $timerBodyHeight;
    }
  }
  &-header {
    display: flex;
    justify-content: space-between;
  }
  &-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    letter-spacing: 1px;
  }
  &-btns {
    display: flex;
    align-items: center;
    gap: 12px;
    &__item {
      font-size: 25px;
    }
  }
  &-body {
    min-height: 0;
    max-height: 0;
    transition: $transition-base;
    overflow: hidden;
  }
}
</style>
```

### src/presentation/components/layout/header/HeaderMain.vue
```ts
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <router-link
        class="navbar-brand d-flex align-items-center"
        to="/"
      >
        <img
          class="navbar-brand-logo"
          :src="logo"
          alt="My Boxing Logo"
        >
        My Boxing {{ route.meta.name }}
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        @click="toggleOffcanvas"
      >
        <span class="navbar-toggler-icon"/>
      </button>

      <!-- Offcanvas -->
      <div
        id="offcanvasNavbar"
        ref="offcanvasEl"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <router-link
            class="navbar-brand d-flex align-items-center"
            to="/"
          >
            <img
              class="navbar-brand-logo"
              :src="logo"
              alt="My Boxing Logo"
            >
            My Boxing {{ route.meta.name }}
          </router-link>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeOffcanvas"
          />
        </div>

        <div class="offcanvas-body">
          <ul
            v-if="!isLoading"
            class="navbar-nav flex-grow-1 pe-3"
          >
            <li
              v-for="(routeItem, index) in visibleRoutes"
              :key="index"
              class="nav-item"
            >
              <router-link
                class="nav-link"
                :to="routeItem.path"
                @click="closeOffcanvas"
              >
                {{ routeItem.meta.name }}
              </router-link>
            </li>
          </ul>

          <ul class="navbar-nav flex-grow-1">
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                @click.stop.prevent="toggleTimerFunc(toggleTimerVisible)"
              >
                {{ isTimerVisible ? 'Hide' : 'Show' }} timer
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <bc-timer v-if="isTimerVisible"/>
  </nav>
</template>

<script setup lang="ts">
import logo from '@/presentation/assets/app-logo3.png'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { computed, onMounted, watch, ref } from 'vue'
import { Offcanvas } from 'bootstrap'
import BcTimer from '@/presentation/components/layout/header/BcTimer.vue'
import { useTimerStore } from '@/presentation/stores/timerStore.ts'
import { storeToRefs } from 'pinia'

// timer
const timerStore = useTimerStore()
const { isTimerVisible } = storeToRefs(timerStore)
const { toggleTimerVisible } = timerStore
// /timer

const router = useRouter()
const authStore = useAuthStore()
const routes = router.getRoutes()
const route = useRoute()
const isLoading = computed(() => authStore.loading)

const userRoutes = computed(() => routes.filter((route) => route.meta?.tags?.includes('userRoute')))
const authRoutes = computed(() => routes.filter((route) => route.meta?.tags?.includes('authRoute')))
const visibleRoutes = computed(() => {
  if (isLoading.value) {
    return []
  } else {
    return authStore.isLoggedIn ? userRoutes.value : authRoutes.value
  }
})

// offCanvas
const offcanvasEl = ref<HTMLElement | null>(null)
let offcanvasInstance: Offcanvas | null = null

function toggleOffcanvas() {
  if (offcanvasInstance) offcanvasInstance.toggle()
}

function closeOffcanvas() {
  if (offcanvasInstance) offcanvasInstance.hide()
}

onMounted(() => {
  if (offcanvasEl.value) offcanvasInstance = new Offcanvas(offcanvasEl.value)
})
// end offCanvas

const toggleTimerFunc = (callback: () => void) => {
  callback()
  closeOffcanvas()
}

watch(() => route.name, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})
</script>

<style lang="scss" scoped>
@import '@/presentation/styles/mixins';

.navbar {
  &-brand {
    @include slabFont;
    font-weight: 500;
    font-size: 15px;
    &-logo {
      height: 25px;
      width: auto;
      margin-right: 8px;
      margin-bottom: -1px;
    }
    &-icon {
      height: 21px;
      margin-top: -3px;
      width: 23px;
      object-fit: cover;
      object-position: center;
    }
  }

  &-toggler {
    box-shadow: none!important;
    padding: 5px 10px;
    font-size: 15px;
  }

  &-nav {
    .nav-link {
      @include slabFont;
      font-size: 20px;
      font-weight: 500;
      transition: font-size 0.3s;
    }
  }
}
</style>
```

### src/presentation/components/layout/router/RouterViewWithSlots.vue
```ts
<template>
  <router-view v-slot="{ Component, route }">
    <component
      :is="Component"
      v-bind="route.meta?.props || {}"
      v-slot="slotProps"
    >
      <template
        v-for="(slotFn, name) in $slots"
        :key="name"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
    </component>
  </router-view>
</template>
```

### src/presentation/components/modals/BaseModal.vue
```ts
<template>
  <div
    v-if="visible"
    class="modal-overlay"
    @click.self="handleClose"
  >
    <div class="modal-container">
      <header class="modal-header">
        <slot name="header">
          <h2>{{ title }}</h2>
        </slot>
        <button
          class="close-btn"
          @click="handleClose"
        >×</button>
      </header>
      <section class="modal-body">
        <slot name="body"/>
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button
            class="btn btn-secondary me-auto"
            @click="handleClose"
          >Cancel</button>
          <button
            class="btn btn-primary"
            @click="handleApply"
          >Apply</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['close', 'apply'])

function handleClose() {
  emit('close')
}
function handleApply() {
  emit('apply')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  color: #333;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
```

### src/presentation/components/modals/ConfirmationModal.vue
```ts
<template>
  <base-modal
    :visible="visible"
    :title="title"
  >
    <template #body>
      <p>{{ message }}</p>
    </template>
  </base-modal>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Are you sure?'
  }
})
</script>
```

### src/presentation/components/modals/ModalContainer.vue
```ts
<template>
  <div
    v-if="modalState.isOpen"
    class="modal-overlay"
    @click.self="closeModal"
  >
    <component
      :is="modalState.component"
      v-bind="{ ...modalState.props, visible: modalState.isOpen }"
      @apply="combinedApply"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useModalService } from '@/presentation/composition/useModalService'
const { modalState, closeModal } = useModalService()

function combinedApply() {
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
```

### src/presentation/components/shared/BButtonGroup.vue
```ts
<template>
  <div
    v-if="localValue"
    :class="[
      `btn-group${vertical ? '-vertical' : ''}`,
      {
        [`btn-group-${BtnSizeMap[size]}`]: size !== 'medium',
      }
    ]"
    role="group"
  >
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <input
        :id="`${exclusiveName}_${getOptionValue(item)}`"
        v-model="localValue"
        type="radio"
        class="btn-check"
        :name="exclusiveName"
        :value="getOptionValue(item)"
      >
      <b-button
        :color="color"
        :outline="outline"
        tag="label"
        :for="`${exclusiveName}_${getOptionValue(item)}`"
        @click="selectItem(item)"
      >
        <slot v-bind="{ item }">
          {{ item }}
        </slot>
      </b-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import BButton from '@/presentation/components/shared/BButton.vue'
import {
  BtnSizeMap,
  type ButtonColor,
  type ButtonSize
} from '@/presentation/components/shared/types.ts'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: any,
  items: any[],
  color?: ButtonColor,
  size?: ButtonSize,
  outline?: boolean,
  vertical?: boolean,
  optionValue?: any,
}>(), {
  size: 'medium',
  color: 'dark'
})

const emit = defineEmits<{
  'update:model-value': [val: boolean]
}>()

const exclusiveName = (new Date().getMilliseconds() * Math.random()).toString().slice(0, 9)
const localValue = ref()

const getOptionValue = (item: any) => props.optionValue ? item[props.optionValue] : item

const selectItem = (item: any) => {
  emit('update:model-value', getOptionValue(item))
}

onMounted(() => {
  localValue.value = props.modelValue
})

watch(() => props.modelValue, (value) => {
  if (!value) return
  localValue.value = value
}, { immediate: true })
</script>

<style scoped lang="scss">

</style>
```

### src/presentation/components/shared/BAlert.vue
```ts
<template>
  <div
    class="alert"
    :class="{
      [`alert-${color}`]: true,
      'alert-dismissible fade show': closable
    }"
    role="alert"
  >
    {{ message }}
    <button
      ref="closeBtn"
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type AlertType = 'primary' |
  'secondary' |
  'success' |
  'danger' |
  'warning' |
  'info' |
  'light' |
  'dark'

const props = withDefaults(defineProps<{
  message: string,
  color?: AlertType,
  closable?: boolean,
  autoClose?: boolean,
}>(), {
  color: 'warning'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()



const closeBtn = ref()

const setAutoclose = () => {
  setTimeout(() => {
    closeBtn.value.click()
  }, 2000)
}

onMounted(() => {
  if (props.autoClose) {
    setAutoclose()
  }
})

</script>

```

### src/presentation/components/shared/types.ts
```ts
// buttons
export type ButtonColor = 'primary' | 'secondary' | 'blue' | 'green' | 'dark' | 'red' | 'light' | 'warning' | 'info'
export type ButtonSize = 'small' | 'medium' | 'large'
export const BtnSizeMap: Record<ButtonSize, string> = {
  small: 'sm',
  medium: '',
  large: 'lg'
}

// time, date
export enum TimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all'
}
```

### src/presentation/components/shared/BInput.vue
```ts
<template>
  <input
    v-model="localValue"
    :type="type"
    class="form-control"
    :placeholder="placeholder"
  >
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: any,
  type: 'text' | 'password' | 'email' | 'number',
  placeholder?: string,
  required?: boolean,
}>(), {
  type: 'text'
})

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (value) => {
  if (!value) return
  localValue.value = value
}, { immediate: true })

watch(() => localValue.value, (value) => {
  // if (!value) return
  emit('update:model-value', value)
}, { immediate: true })
</script>

<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number]{
  -moz-appearance: textfield;
}
</style>
```

### src/presentation/components/shared/BButton.vue
```ts
<template>
  <component
    :is="tag"
    :class="{
      'btn': true,
      [`btn-${colorMap[color]}`]: !outline,
      [`btn-${BtnSizeMap[size]}`]: size !== 'medium',
      [`btn-outline-${colorMap[color]}`]: outline,
    }"
  >
    <slot/>
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useThemeStore } from '@/presentation/stores/themeStore.ts'
import {
  BtnSizeMap,
  type ButtonColor,
  type ButtonSize
} from '@/presentation/components/shared/types.ts'

const themeStore = useThemeStore()

const BtnColorDarkMap: Record<ButtonColor, string> = {
  primary: 'light', //
  secondary: 'secondary',
  blue: 'primary',
  green: 'success',
  dark: 'light', //
  red: 'danger',
  light: 'dark', //
  info: 'info',
  warning: 'warning'
}

const BtnColorMap: Record<ButtonColor, string> = {
  primary: 'primary',
  secondary: 'secondary',
  blue: 'primary',
  green: 'success',
  dark: 'dark',
  red: 'danger',
  light: 'light',
  info: 'info',
  warning: 'warning'
}

const colorMap = computed(() => themeStore.isDarkTheme ? BtnColorDarkMap : BtnColorMap)

withDefaults(defineProps<{
  tag?: string;
  color?: ButtonColor
  size?: ButtonSize
  submit?: boolean,
  outline?: boolean,
}>(), {
  tag: 'button',
  color: 'primary',
  size: 'medium'
})

</script>

<style scoped lang="scss">

</style>
```

### src/presentation/components/profile/ThemeToggle.vue
```ts
<template>
  <div class="form-check">
    <input
      id="flexCheckDefault"
      v-model="isDarkTheme"
      class="form-check-input"
      type="checkbox"
      @change="toggleTheme"
    >
    <label
      class="form-check-label"
      for="flexCheckDefault"
    >
      Dark theme
    </label>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/presentation/stores/themeStore'
const themeStore = useThemeStore()
const { isDarkTheme, toggleTheme } = themeStore
</script>
```

### src/presentation/components/pages/PunchCounter.vue
```ts
<template>
  <div class="punch-counter">
    <!-- Ручной режим -->
    <template v-if="!recording && !timerActive">
      <div
        class="mode-controls"
      >
        <div>Free mode:</div>
        <b-button
          color="dark"
          size="large"
          @click="startManualRecording"
        >
          Record
        </b-button>
      </div>

      <hr>
    </template>


    <!-- Таймерный режим -->
    <template v-if="!recording && !timerActive">
      <div
        class="timer-controls"
      >
        <label for="intervalSelect">Record with timer:</label>
        <select
          id="intervalSelect"
          v-model.number="selectedInterval"
          class="form-select"
        >
          <option
            v-for="option in intervalOptions"
            :key="option"
            :value="option"
          >
            {{ option }} sec
          </option>
        </select>
        <b-button
          color="primary"
          size="large"
          @click="startTimerRecording"
        >
          Start recording with timer
        </b-button>
      </div>

      <hr>
    </template>

    <div
      v-if="recording"
      class="punch-counter-total mt-5 mb-5"
    >
      <h1 class="punch-counter-total__title">
        Счет ударов: {{ punchCount }}
        <div
          class="spinner-grow punch-counter-total__spinner"
          style="width: 5rem; height: 5rem;"
          role="status"
        />
      </h1>
      <p v-if="timerActive">Осталось: {{ timeLeft }} сек</p>
    </div>

    <div class="controls">
      <b-button
        v-if="recording"
        color="red"
        size="large"
        class="w-100"
        @click="resetCounter"
      >
        Reset
      </b-button>
    </div>

    <!-- Range input для порога и cooldown -->
    <b-button
      color="secondary"
      class="mt-3 font-sans"
      type="button"
      size="small"
      :outline="!isSettingsOpened"
      aria-controls="navbarSupportedContent2"
      aria-expanded="false"
      aria-label="Toggle navigation"
      @click="toggleNavbar"
    >
      microphone settings:
      <i :class="`bi-chevron-${isSettingsOpened ? 'contract' : 'expand'}`"/>
    </b-button>

    <div
      id="navbarSupportedContent2"
      class="collapse mt-3"
    >
      <div class="card card-body border-0">
        <label>
          Level: {{ threshold }}
          <input
            v-model.number="threshold"
            type="range"
            min="100"
            max="1000"
            step="10"
            class="form-range"
            @input="saveSettings"
          >
        </label>
        <label>
          Min gap between punches (мс): {{ cooldown }}
          <input
            v-model.number="cooldown"
            type="range"
            min="150"
            max="350"
            step="10"
            class="form-range"
            @input="saveSettings"
          >
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Collapse } from 'bootstrap'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const recording = ref(false)
const timerActive = ref(false)
const punchCount = ref(0)
const error = ref('')
const timeLeft = ref(0)

// Настройки порога и cooldown; загружаем из localStorage или устанавливаем по умолчанию
const threshold = ref<number>(200)
const cooldown = ref<number>(300)

function loadSettings() {
  const savedThreshold = localStorage.getItem('threshold')
  const savedCooldown = localStorage.getItem('cooldown')
  if (savedThreshold) threshold.value = parseInt(savedThreshold)
  if (savedCooldown) cooldown.value = parseInt(savedCooldown)
}
function saveSettings() {
  localStorage.setItem('threshold', threshold.value.toString())
  localStorage.setItem('cooldown', cooldown.value.toString())
}

// Интервалы таймера (в секундах)
const intervalOptions = [5, 10, 15, 30, 60]
const selectedInterval = ref<number>(15)

// Web Audio API объекты
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let mediaStream: MediaStream | null = null
let dataArray: Uint8Array
let animationFrameId: number | null = null
let timerInterval: number | null = null

let lastPunchTime = 0

function detectPunch() {
  if (!analyser) return
  analyser.getByteFrequencyData(dataArray)
  const peak = Math.max(...dataArray)
  const now = Date.now()
  if (peak > threshold.value && now - lastPunchTime > cooldown.value) {
    punchCount.value++
    lastPunchTime = now
  }
  if (recording.value) {
    animationFrameId = requestAnimationFrame(() => detectPunch())
  }
}

async function startManualRecording() {
  error.value = ''
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaStreamSource(mediaStream)
    source.connect(analyser)
    analyser.fftSize = 2048
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    recording.value = true
    punchCount.value = 0
    lastPunchTime = 0
    detectPunch()
  } catch (err: any) {
    error.value = err.message || 'Microphone connection failed'
  }
}

async function startTimerRecording() {
  error.value = ''
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaStreamSource(mediaStream)
    source.connect(analyser)
    analyser.fftSize = 2048
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    recording.value = true
    timerActive.value = true
    punchCount.value = 0
    lastPunchTime = 0
    timeLeft.value = selectedInterval.value
    detectPunch()
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        stopRecording()
      }
    }, 1000)
  } catch (err: any) {
    error.value = err.message || 'Ошибка доступа к микрофону'
  }
}

function stopRecording() {
  recording.value = false
  timerActive.value = false
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
}

function resetCounter() {
  stopRecording()
  punchCount.value = 0
  timeLeft.value = 0
}

// toggle microphone
const isSettingsOpened = ref(false)

function toggleNavbar() {
  const navbar = document.getElementById('navbarSupportedContent2')
  if (navbar) {
    let bsCollapse = Collapse.getInstance(navbar)
    if (!bsCollapse) {
      bsCollapse = new Collapse(navbar, { toggle: false })
    }
    bsCollapse.toggle()
    isSettingsOpened.value = !isSettingsOpened.value
  }
}

watch(() => error.value, (val) => {
  if (val) toast.error(val)
})

onMounted(() => {
  loadSettings()
})
onUnmounted(() => {
  stopRecording()
})
</script>

<style scoped>
.punch-counter {
  padding: 0 10px;
  text-align: center;
  &-total {
    background: red;
    &__title {
      position: relative;
    }
    &__spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.mode-controls,
.timer-controls {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
```

### src/presentation/components/pages/ExercisesPage.vue
```ts
<template>
  <div class="trainings-page py-4">
    <div class="mb-3">
      <label class="form-label text-center w-100">Select Exercise Type:</label>

      <b-button-group
        v-model="selectedType"
        color="dark"
        outline
        class="w-100"
        :items="[ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]"
      />
    </div>

    <div class="mb-4">
      <label class="form-label text-center w-100">Choose Exercise:</label>

      <b-button-group
        v-if="selectedExerciseId"
        v-model="selectedExerciseId"
        color="dark"
        outline
        vertical
        option-value="id"
        class="w-100"
        :items="filteredExercises"
      >
        <template #default="{ item }">
          {{ item.name }}
          <span
            v-if="item.measurement === 'minutes'"
            class="badge text-bg-secondary"
          >Min</span>
        </template>
      </b-button-group>
    </div>

    <exercise-logger
      v-if="selectedExercise"
      :selected-exercise="selectedExercise"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise'
import ExerciseLogger from '@/presentation/components/trainings/ExerciseLogger.vue'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'

const store = useExerciseStore()

// Выбранный тип упражнения: technique, strength, practice
const selectedType = ref<ExerciseCategory>(ExerciseCategory.PHYSICS)

// ID выбранного упражнения
const selectedExerciseId = ref<string | null>(null)

// Фильтруем список упражнений по выбранному типу
const filteredExercises = computed<Exercise[]>(() => {
  return store.exercises.filter((ex: Exercise) => ex.category === selectedType.value)
})

// Получаем объект выбранного упражнения
const selectedExercise = computed<Exercise | null>(() => {
  return store.exercises.find((ex: Exercise) => ex.id === selectedExerciseId.value) || null
})

onMounted(async () => {
  await store.loadExercises()
  selectedExerciseId.value = filteredExercises.value[0].id
  // Устанавливаем дефолтное упражнение для выбранного типа
  const filtered = store.exercises.filter((ex: Exercise) => ex.category === selectedType.value)
  if (filtered.length > 0) {
    selectedExerciseId.value = filtered[0].id
  }
})

// При смене выбранного типа сбрасываем выбранное упражнение
watch(selectedType, (newType) => {
  const filtered = store.exercises.filter((ex: Exercise) => ex.category === newType)
  selectedExerciseId.value = filtered.length > 0 ? filtered[0].id : null
}, {
  immediate: true
})
</script>

<style scoped>
.trainings-page {
  .badge {
    font-size: 10px;
    vertical-align: middle;
  }
}
</style>
```

### src/presentation/components/pages/auth/Login.vue
```ts
<template>
  <div>
    <form
      @submit.prevent="handleLogin"
    >
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
        >Email address</label>
        <b-input
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="password"
          class="form-label"
        >Password</label>
        <b-input
          id="password"
          v-model="password"
          type="password"
          required
        />
      </div>

      <b-button
        color="blue"
        size="medium"
        type="submit"
        class="w-100"
      >
        Login
      </b-button>

      <p class="mt-3 text-center">
        <small>
          Don't have an account?
        </small> <RouterLink to="/signup">Sign up</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore'
import BInput from '@/presentation/components/shared/BInput.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const email = ref('')
const password = ref('')
const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

async function handleLogin() {
  await authStore.login(email.value, password.value)
  if (!authStore.error) {
    router.push('/')
    const { redirect } = route.query
    if (redirect && typeof redirect === 'string') {
      await router.push(redirect)
    } else {
      await router.push('/') // перенаправляем на главную после успешного входа
    }
  } else {
    toast.error(authStore.error)
  }
}
</script>
```

### src/presentation/components/pages/auth/Signup.vue
```ts
<template>
  <div class="register-page">
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label
          for="email"
          class="form-label"
        >Email</label>
        <b-input
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="firstName"
          class="form-label"
        >First name</label>
        <b-input
          id="firstName"
          v-model="firstName"
          type="text"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="lastName"
          class="form-label"
        >Last name</label>
        <b-input
          id="lastName"
          v-model="lastName"
          type="text"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="nickname"
          class="form-label"
        >Nickname</label>
        <b-input
          id="nickname"
          v-model="nickname"
          type="text"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="password"
          class="form-label"
        >Password</label>
        <b-input
          id="password"
          v-model="password"
          type="password"
          class="text-center"
          required
        />
      </div>
      <div class="mb-3">
        <label
          for="confirmPassword"
          class="form-label"
        >Repeat password</label>
        <b-input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          class="text-center"
          required
        />
      </div>
      <b-button
        color="blue"
        size="medium"
        type="submit"
        class="w-100"
      >
        Sign up
      </b-button>

      <p class="mt-3 text-center">
        <small>
          Already have an account?
        </small> <RouterLink to="/login">Login</RouterLink>
      </p>
    </form>
    <b-alert
      v-if="errorMessage"
      :message="errorMessage"
      class="mt-3"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BAlert from '@/presentation/components/shared/BAlert.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore'
import BInput from '@/presentation/components/shared/BInput.vue'

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const router = useRouter()
const authStore = useAuthStore()

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }
  await authStore.register(email.value, password.value, firstName.value, lastName.value, nickname.value)
  if (!authStore.error) {
    router.push('/login')
  } else {
    errorMessage.value = authStore.error
  }
}
</script>

<style scoped>
.register-page {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
```

### src/presentation/components/pages/auth/NotFoundPage.vue
```ts
<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Извините, страница не найдена.</p>
    <router-link to="/">Вернуться на главную</router-link>
  </div>
</template>
```

### src/presentation/components/pages/EnemyCard.vue
```ts
<template>
  <div class="enemy-card">
    <div class="row">
      <div class="col">
        <h6>Кто выше?</h6>
        <b-button-group
          v-model="heightRelation"
          color="secondary"
          vertical
          outline
          size="small"
          class="w-100 mb-4"
          :items="sizeKeys"
        >
          <template #default="{ item }">
            {{ sizeMap[item] }}
          </template>
        </b-button-group>
      </div>

      <div class="col">
        <h6>Кто тяжелее?</h6>
        <b-button-group
          v-model="weightRelation"
          color="secondary"
          vertical
          outline
          size="small"
          class="w-100 mb-4"
          :items="sizeKeys"
        >
          <template #default="{ item }">
            {{ sizeMap[item] }}
          </template>
        </b-button-group>
      </div>
    </div>

    <!--    <div class="d-flex">-->
    <div class="row">
      <div
        class="col-6 d-flex flex-column"
      >
        <h6>Я</h6>
        <b-button-group
          v-model="myHandedness"
          color="secondary"
          outline
          vertical
          size="small"
          class="w-100 mb-4"
          :items="stanceKeys"
        >
          <template #default="{ item }">
            {{ stanceMap[item] }}
          </template>
        </b-button-group>

        <h6>Стиль</h6>
        <b-button-group
          v-model="myStyle"
          color="secondary"
          vertical
          outline
          size="small"
          class="w-100 mb-4"
          :items="boxingStyleKeys"
        >
          <template #default="{ item }">
            {{ boxingStyleMap[item] }}
          </template>
        </b-button-group>

        <h6>Руки</h6>
        <b-button-group
          v-model="myGuard"
          color="secondary"
          vertical
          outline
          size="small"
          class="w-100 mb-4"
          :items="boxingGuardKeys"
        >
          <template #default="{ item }">
            {{ boxingGuardMap[item] }}
          </template>
        </b-button-group>
      </div>

      <div
        class="col-6 d-flex flex-column"
      >
        <h6>Противник</h6>

        <b-button-group
          v-model="oppHandedness"
          color="secondary"
          outline
          vertical
          size="small"
          class="w-100 mb-4"
          :items="stanceKeys"
        >
          <template #default="{ item }">
            {{ stanceMap[item] }}
          </template>
        </b-button-group>

        <h6>Стиль</h6>
        <b-button-group
          v-model="oppStyle"
          color="secondary"
          vertical
          outline
          size="small"
          class="w-100 mb-4"
          :items="boxingStyleKeys"
        >
          <template #default="{ item }">
            {{ boxingStyleMap[item] }}
          </template>
        </b-button-group>

        <h6>Руки</h6>
        <b-button-group
          v-model="oppGuard"
          color="secondary"
          vertical
          outline
          size="small"
          class="w-100 mb-4"
          :items="boxingGuardKeys"
        >
          <template #default="{ item }">
            {{ boxingGuardMap[item] }}
          </template>
        </b-button-group>
      </div>
    </div>
    <!--    </div>-->

    <b-button
      color="dark"
      class="mb-3 w-100"
      size="large"
      @click="calculateStrategy"
    >
      Get strategy
    </b-button>

    <ul v-if="strategyResult?.length">
      <li
        v-for="(item, key) in strategyResult"
        :key="key"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BodyRelation,
  getExtendedFightStrategy,
  type FightOptions,
  type StanceSide,
  type BoxerStyle,
  type BoxerGuard
} from '@/application/useCases/getEnemyCard.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'

const sizeMap: Record<BodyRelation, string> = {
  [BodyRelation.I_AM_BIGGER]: 'Me',
  [BodyRelation.I_AM_SMALLER]: 'Opponent',
  [BodyRelation.EQUAL]: 'Similar'
}
const sizeKeys = Object.keys(sizeMap) as BodyRelation[]

const stanceMap: Record<StanceSide, string> = {
  orthodox: 'Orthodox',
  southpaw: 'Southpaw'
}
const stanceKeys = Object.keys(stanceMap) as StanceSide[]

const boxingStyleMap: Record<BoxerStyle, string> = {
  gamer: 'Player',
  puncher: 'Puncher',
  technician: 'Technician',
  counterpuncher: 'Counterpuncher'
}
const boxingStyleKeys = Object.keys(boxingStyleMap) as BoxerStyle[]

const boxingGuardMap: Record<BoxerGuard, string> = {
  closed: 'Closed stance',
  classical: 'Classical stance',
  handsDown: 'Hand down'
}
const boxingGuardKeys = Object.keys(boxingGuardMap) as BoxerGuard[]

const heightRelation = ref(BodyRelation.I_AM_BIGGER)
const weightRelation = ref(BodyRelation.I_AM_BIGGER)
const myHandedness = ref<StanceSide>('orthodox')
const oppHandedness = ref<StanceSide>('orthodox')
const myStyle = ref<BoxerStyle>('gamer')
const oppStyle = ref<BoxerStyle>('gamer')
const myGuard = ref<BoxerGuard>('closed')
const oppGuard = ref<BoxerGuard>('closed')

const strategyResult = ref<string[]>([])

function calculateStrategy() {
  const opts: FightOptions = {
    heightRelation: heightRelation.value,
    weightRelation: weightRelation.value,
    myHandedness: myHandedness.value,
    oppHandedness: oppHandedness.value,
    myStyle: myStyle.value,
    oppStyle: oppStyle.value,
    myGuard: myGuard.value,
    oppGuard: oppGuard.value
  }
  strategyResult.value = getExtendedFightStrategy(opts)
}
</script>

<style scoped lang="scss">
.enemy-card {
  display: flex;
  flex-direction: column;
}
</style>
```

### src/presentation/components/pages/Account.vue
```ts
<template>
  <div class="profile-page">
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="user">
      <div class="card border-0">
        <div class="card-body">
          <h5 class="card-title">{{ `${user.firstName} ${user.lastName}` }}</h5>
          <p class="card-text">{{ user.email }}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <theme-toggle/>
          </li>
        </ul>
        <div class="card-body align-items-center d-flex gap-2">
          <b-button
            color="red"
            class="col"
            size="small"
            @click="confirmLogout"
          >Log out</b-button>
        </div>
      </div>
    </div>
    <b-alert
      v-else
      message="Пользователь не найден."
      class="mt-3"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import BAlert from '@/presentation/components/shared/BAlert.vue'
import ThemeToggle from '@/presentation/components/profile/ThemeToggle.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { useToast } from 'vue-toastification'
import { useModalService } from '@/presentation/composition/useModalService'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'

const { openModalByKey } = useModalService()

function confirmLogout() {
  openModalByKey(ModalKey.CONFIRMATION, {
    title: 'Confirm logout',
    message: 'Are you sure?',
    onApply: handleLogout
  })
}
//

const toast = useToast()

const user = ref<User | null>(null)
const loading = ref(true)
const router = useRouter()

const userRepo = container.get<IUserRepository>(TYPES.IUserRepository)
const authStore = useAuthStore()

async function loadUserProfile() {
  try {
    const auth = getAuth()
    const {currentUser} = auth
    if (currentUser) {
      const {uid} = currentUser
      const fetchedUser = await userRepo.getUser(uid)
      if (fetchedUser) {
        user.value = fetchedUser
      } else {
        toast.error('Undefined user')
      }
    } else {
      toast.error('User isn\'t authorized')
    }
  } catch (error: any) {
    toast.error(error?.message || error)
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  try {
    await authStore.logout()
    await router.push('/login')
  } catch (error: any) {
    toast.error(error?.message || error)
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>
```

### src/presentation/components/pages/ProgressPage.vue
```ts
<template>
  <div class="progress-page py-4">
    <!-- Селект для выбора временного интервала -->
    <div class="mb-3">
      <label
        for="timeRange"
        class="form-label"
      >Time Range:</label>
      <b-button-group
        v-model="timeRange"
        color="dark"
        outline
        class="w-100"
        size="small"
        :items="[TimeRange.TODAY, TimeRange.WEEK, TimeRange.MONTH, TimeRange.ALL]"
      />
    </div>

    <!-- Блок "Избранные упражнения" -->
    <div
      v-if="favoriteExercises?.length"
      class="mb-4"
    >
      <h4>Favorite Exercises</h4>
      <ul class="list-group">
        <li
          v-for="exercise in favoriteExercises"
          :key="exercise.id"
          class="list-group-item"
        >
          {{ exercise.name }}: {{ getStats(exercise.id, 'today') }}
          <small class="text-muted">
            ({{ exercise.measurement }})
          </small>
        </li>
      </ul>
    </div>

    <!-- Статистика по упражнениям -->
    <div class="mb-4">
      <h4>Statistics</h4>
      <ul class="list-group">
        <template
          v-for="exercise in exercises"
          :key="exercise.id"
        >
          <li
            v-if="getStats(exercise.id, TimeRange.ALL)"
            class="list-group-item small py-1 px-2"
          >
            {{ exercise.name }}:
            <small class="text-muted">
              {{ timeRange }}: {{ getStats(exercise.id, timeRange) }},
              total: {{ getStats(exercise.id, TimeRange.ALL) }}
            </small>
          </li>
        </template>
      </ul>
    </div>

    <!-- История выполненных упражнений -->
    <div>
      <h4>History</h4>
      <ul class="list-group">
        <li
          v-for="entry in history"
          :key="entry.timestamp + entry.exerciseId"
          class="list-group-item d-flex justify-content-between align-items-center py-1 px-2"
        >
          <small class="text-muted">{{ getExerciseById(entry.exerciseId)?.name }}</small>
          <span class="badge text-bg-primary rounded-pill small">{{ entry.amount }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { type Exercise } from '@/domain/entities/Exercise'
import { onUserLoaded } from '@/presentation/utils/onUserLoaded.ts'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import { TimeRange } from '@/presentation/components/shared/types.ts'

const store = useExerciseStore()
const timeRange = ref<TimeRange>(TimeRange.TODAY)

onUserLoaded(async () => {
  await store.loadStats()
  await store.loadExercises()
  await store.loadHistory(30)
  await store.loadFavorites()
})

const exercises = computed<Exercise[]>(() => store.exercises)
const history = computed(() => store.history)

// Для простоты используем один метод, который возвращает статистику для упражнения
function getStats(exerciseId: string, period: TimeRange): number {
  if (exerciseId) return store.getStatsForPeriod(exerciseId, period || timeRange.value)
  else return 0
}

const favoriteExercises = computed<Exercise[]>(() => {
  return store.exercises.filter((ex) => store.favorites.includes(ex.id))
})

const getExerciseById = (id: string): Exercise | undefined => store.exercises.find((ex) => ex.id === id)
</script>

<style scoped>
.progress-page {
}
</style>
```

### src/presentation/components/pages/CombinationBuilderView.vue
```ts
<template>
  <div class="combination-builder">
    <div class="combination-builder-wrap">
      <h6>Action</h6>
      <b-button-group
        v-model="selectedCategory"
        color="secondary"
        outline
        class="w-100 mb-4"
        :items="categoryOptions"
      />

      <div
        v-if="comboActions.length"
        class=""
      >
        <p class="mb-1">
          Preview:
        </p>
        <div class="d-flex justify-content-center flex-wrap">
          <div
            v-for="(item, index) in comboActions"
            :key="index"
            class=""
          >
            <span class="badge text-bg-primary my-1">{{ item.name }}</span>
            <span
              v-if="index !== comboActions.length - 1"
              class="mx-1"
            >-</span>
          </div>
        </div>
      </div>

      <h6>Option</h6>
      <b-button-group
        v-if="selectedCategory && selectedActionId"
        v-model="selectedActionId"
        color="secondary"
        outline
        vertical
        option-value="id"
        class="w-100 mb-4"
        :items="availableActions"
      >
        <template #default="{ item }">
          {{ item?.name }}
        </template>
      </b-button-group>

      <b-button
        color="primary"
        class="btn-block w-100 mb-3"
        @click="addActionToCombo"
      >
        Add
      </b-button>

      <div class="input-group input-group-sm mb-3">
        <span
          id="inputGroup-sizing-sm"
          class="input-group-text"
        >Count:</span>
        <b-input
          v-model="randomIterationsNumber"
          type="number"
          class="text-center"
        />

        <b-button
          id="button-addon2"
          color="secondary"
          type="button"
          @click="onGenerateRandomCombo"
        >
          Generate random combo
        </b-button>
      </div>

      <div class="input-group input-group-sm my-3">
        <b-input
          v-model="comboTitle"
          type="text"
          placeholder="Combo title"
        />

        <b-button
          id="button-addon2"
          color="blue"
          type="button"
          @click="buildCombo"
        >
          Save Combo
        </b-button>
      </div>

      <div v-if="createdCombo">
        <h4>Created combo: {{ createdCombo.title }}</h4>
        <ul>
          <li
            v-for="punch in createdCombo.punches"
            :key="punch.id"
          >
            {{ punch.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { container } from '@/infrastructure/di/container.ts'
import { TYPES } from '@/infrastructure/di/types.ts'
import { CombinationBuilder } from '@/domain/services/CombinationBuilder.ts'
import { CreateCombinationUseCase } from '@/application/useCases/CreateCombinationUseCase.ts'
import type { Combination } from '@/domain/entities/Combination.ts'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'
import { BoxingActionCategory } from '@/domain/entities/BoxingAction.ts'
import { getNextActions } from '@/application/useCases/getNextActions.ts'

// Если вы по-прежнему используете GetPunchesUseCase, замените его на новый use-case
// или импортируйте MOCK_ACTIONS напрямую.
// Здесь для примера предполагаем, что GetPunchesUseCase возвращает все BoxingAction.
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase.ts'
import { generateRandomCombo } from '@/application/useCases/generateRandomCombo.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import BInput from '@/presentation/components/shared/BInput.vue'

export default defineComponent({
  name: 'CombinationBuilderView',
  components: {
    BInput,
    BButtonGroup,
    BButton
  },
  setup() {
    const allActions = ref<BoxingAction[]>([])
    const comboActions = ref<BoxingAction[]>([])
    const comboTitle = ref('')
    const randomIterationsNumber = ref<number>(5)
    const createdCombo = ref<Combination | null>(null)

    const categoryOptions = [BoxingActionCategory.PUNCH, BoxingActionCategory.MOVEMENT, BoxingActionCategory.DEFENSE]
    const selectedCategory = ref<BoxingActionCategory>(BoxingActionCategory.PUNCH)
    const selectedActionId = ref<number | null>(null)

    const getPunchesUseCase = container.get<GetPunchesUseCase>(TYPES.GetPunchesUseCase)
    const combinationBuilder = new CombinationBuilder()
    const createCombinationUseCase = new CreateCombinationUseCase(combinationBuilder)

    onMounted(async () => {
      allActions.value = await getPunchesUseCase.execute()
      onUpdateAvailableActions()
    })

    const lastAction = computed(() => {
      if (comboActions.value.length === 0) return null
      return comboActions.value[comboActions.value.length - 1]
    })

    const availableActions = computed<BoxingAction[]>(() => {
      if (!lastAction.value) {
        return allActions.value.filter((a) => a.category === selectedCategory.value)
      }
      const possible = getNextActions(lastAction.value, allActions.value)
      return possible.filter((a) => a.category === selectedCategory.value)
    })

    function onUpdateAvailableActions() {
      if (availableActions.value.length > 0) {
        selectedActionId.value = availableActions.value[0].id
      } else {
        selectedActionId.value = null
      }
    }

    function addActionToCombo() {
      if (selectedActionId.value == null) return
      const chosen = allActions.value.find((a) => a.id === selectedActionId.value)
      if (!chosen) return
      comboActions.value.push(chosen)
      combinationBuilder.addAction(chosen)
      onUpdateAvailableActions()
    }

    function buildCombo() {
      if (!comboTitle.value.trim()) return
      createdCombo.value = createCombinationUseCase.buildCombination(comboTitle.value.trim())
      comboActions.value = []
      combinationBuilder.reset()
      comboTitle.value = ''
      onUpdateAvailableActions()
    }

    function onGenerateRandomCombo() {
      const randomCombo = generateRandomCombo(allActions.value, randomIterationsNumber.value)
      comboActions.value = randomCombo
      combinationBuilder.reset()
      randomCombo.forEach((a) => combinationBuilder.addAction(a))
    }

    watch(selectedCategory, () => {
      onUpdateAvailableActions()
    })

    return {
      categoryOptions,
      selectedCategory,
      selectedActionId,
      comboTitle,
      createdCombo,
      availableActions,
      comboActions,
      addActionToCombo,
      buildCombo,
      onGenerateRandomCombo,
      randomIterationsNumber
    }
  }
})
</script>

<style scoped lang="scss">
.min-width-220px-lg-max {
  min-width: 220px;
}
.combination-builder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  &-wrap {
    max-width: 430px;
  }
}
</style>
```

### src/presentation/router/index.ts
```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import CombinationBuilderView from '@/presentation/components/pages/CombinationBuilderView.vue'
import EnemyCard from '@/presentation/components/pages/EnemyCard.vue'
import Account from '@/presentation/components/pages/Account.vue'
import Signup from '@/presentation/components/pages/auth/Signup.vue'
import Login from '@/presentation/components/pages/auth/Login.vue'
import NotFoundPage from '@/presentation/components/pages/auth/NotFoundPage.vue'
import { requireAuth } from './guards'
import PunchCounter from '@/presentation/components/pages/PunchCounter.vue'
import ExercisesPage from '@/presentation/components/pages/ExercisesPage.vue'
import ProgressPage from '@/presentation/components/pages/ProgressPage.vue'
import RouterViewWithSlots from '@/presentation/components/layout/router/RouterViewWithSlots.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Progress',
    component: ProgressPage,
    beforeEnter: requireAuth,
    meta: {
      name: 'Progress',
      tags: ['userRoute']
    }
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: RouterViewWithSlots,
    beforeEnter: requireAuth,
    meta: {
      name: 'Exercises',
      tags: ['userRoute']
    },
    redirect: '/exercises/index',
    children: [
      {
        path: '/exercises/index',
        name: 'Exercises page',
        component: ExercisesPage,
        meta: {
          name: 'Exercises'
          // tags: ['userRoute']
        }
      },
      {
        path: '/rounds',
        name: 'Exercises rounds',
        component: ExercisesPage,
        meta: {
          name: 'Exercises rounds'
          // tags: ['userRoute']
        }
      }
    ]
  },
  {
    path: '/combinations',
    name: 'CombinationBuilderView',
    component: CombinationBuilderView,
    beforeEnter: requireAuth,
    meta: {
      name: 'Combos',
      tags: ['userRoute']
    }
  },
  {
    path: '/enemy-card',
    name: 'EnemyCard',
    component: EnemyCard,
    beforeEnter: requireAuth,
    meta: {
      name: 'Enemy Card',
      tags: ['userRoute']
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: requireAuth,
    meta: {
      name: 'Account',
      tags: ['userRoute']
    }
  },
  {
    path: '/punch-counter',
    name: 'PunchCounter',
    component: PunchCounter,
    beforeEnter: requireAuth,
    meta: {
      name: 'Punch counter'
      // tags: ['userRoute']
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      name: 'Log in',
      tags: ['authRoute']
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      name: 'Sign up',
      tags: ['authRoute']
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      name: 'Page Not Found'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active'
})

router.afterEach((to) => {
  document.title = to.meta?.name + ' | My Boxing' || 'My Boxing'
})
```

### src/presentation/router/guards.ts
```ts
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = getAuth()
  if (auth.currentUser) {
    next()
  } else {
    // Подписываемся на изменение состояния авторизации,
    // чтобы дождаться, если оно ещё не установлено.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe() // отписываемся сразу после первого срабатывания
      if (user) {
        next()
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    })
  }
}
```

