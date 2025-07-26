# Архитектура проекта

Этот документ описывает ключевые концепции и организацию кода в приложении.

## Слои и их ответственность

````
┌───────────────────────────────────────────────────────────┐
│ Presentation (Vue + Pinia + Composition API + Bootstrap) │  «ViewModel» / MVVM
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│ Application (Use-Cases)                                   │  бизнес-логика, каждая операция — отдельный класс
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│ Domain                                                    │  чистые модели (Entities) + репозиторные интерфейсы
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│ Infrastructure (Firebase, Inversify DI)                   │  конкретные реализации репозиториев, контейнер зависимостей
└───────────────────────────────────────────────────────────┘
````

### Domain

- **Entities**
  - `Exercise`, `Combination`, `Category`, `Tag`, `TrainingRecord`
  - Хранят только поля и базовые типы (enum-ы, string, number, массивы)
- **Repositories (абстракции)**
  - `IExerciseRepository`, `ICombinationRepository`, `ICategoryRepository`, `ITagRepository`, `ITrainingRepository`
  - Описывают CRUD-методы без деталей реализации.

### Application (Use-Cases)

- Для каждой операции (GetAll, Create, Update, Delete, GetById и т.п.) свой класс.
- Конструкторная инъекция («D» из SOLID) через Inversify.
- **Плюсы**:
  - SRP (каждый UseCase — одно действие)
  - Легко мокать и тестировать

### Infrastructure

- **DI-контейнер** (`/infrastructure/di/container.ts`)  
  Регистрирует интерфейсы → конкретные реализации + UseCases
- **Firebase-репозитории** (`*/data/*RepositoryImpl.ts`)
  - Используют Firestore SDK
  - Содержат только низкоуровневые операции с БД
- **Utils & Constants**
  - `defaultTags.ts`, `defaultExercises.ts`, `dateTime.ts`

### Presentation

- **Pinia-сторы** (`/presentation/stores/*.ts`)
  - «VM» для компонентов: держат состояние и вызывают UseCases или аггрегируют данные
  - Composition API, `ref` + `watch` (фильтры по дате)
- **Vue-компоненты**
  - **Pages** (`/components/views/...`)
  - **Shared UI** (`/components/shared/*`)
  - **Modals** (`/components/modals/*`)
  - Базовые форм-компоненты (`BButton`, `BInput`, `BCheckbox`, `BButtonGroup`)

## Основные паттерны и принципы

- **SOLID**
  - **S**ingle Responsibility: файлы/классы отвечают за одно действие
  - **O**pen/Closed: расширяемость через новые UseCase, не меняя старый код
  - **L**iskov Substitution: интерфейсы репозиториев легко меняют реализации
  - **I**nterface Segregation: маленькие, узконаправленные интерфейсы
  - **D**ependency Inversion: высокоуровневые модули зависят от абстракций
- **MVVM** (частично)
  - Vue-компоненты + Pinia-сторы = Model ⇄ ViewModel ⇄ View
- **DI** через Inversify – все зависимости явно регистрируются и разрешаются контейнером

## Поток данных при типичном CRUD

1. Пользователь нажимает кнопку в компоненте →
2. Вызывается метод Pinia-стора →
3. Стор вызывает `getUC<SomeUseCase>(TYPES.SomeUseCase).execute(...)` →
4. UseCase (инжектит репозиторий) →
5. РепозиторийImpl выполняет Firestore-запрос →
6. Результат возвращается обратно и пушится в `ref` в Pinia →
7. Vue автоматически рендерит изменения в UI

## Расширяемость

- Добавить новую сущность →
  1) создать Entity + интерфейс репозитория
  2) создать Impl репозитория под Firestore
  3) добавить UseCases
  4) зарегистрировать в контейнере
  5) создать Pinia-store + компоненты

---