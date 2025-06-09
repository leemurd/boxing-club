# My Boxing App

**Vue 3 + TypeScript + Pinia + Firebase + Inversify**

Приложение для планирования и отслеживания боксерских тренировок:
- Создание/редактирование упражнений, комб (комбинаций ударов), категорий и тегов
- Логирование прогресса (TrainingRecord) с детальными метриками
- Графики и статистика по дням, категориям, упражнениям, тегам, комбо
- Фильтрация по периодам: день, 7 дней, 30 дней, всё время
- Система «избранных» упражнений и предопределённых тегов (доп. вес, ускорённый темп и др.)

````
┌───────────────────────────────────────────────────────────┐
│ Presentation (Vue + Pinia + Composition API + Bootstrap)  │  «ViewModel» / MVVM
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

---

## 📂 Структура проекта
````
src/
├─ application/
│   └─ useCases/            # бизнес-логика (каждый CRUD в своём файле)
├─ domain/
│   ├─ entities/            # модели + enum’ы
│   └─ repositories/        # интерфейсы репозиториев
├─ infrastructure/
│   ├─ data/                # Firebase-репозитории (Impl)
│   └─ di/                  # Inversify DI-контейнер + типы
├─ presentation/
│   ├─ components/
│   │   ├─ shared/          # UI-библиотека (кнопки, инпуты, прогресс-бар)
│   │   ├─ modals/          # универсальные модалки
│   │   └─ views/           # страницы (Exercises, Combos, Progress…)
│   ├─ stores/              # Pinia-сторы
│   └─ styles/              # SCSS, темы
└─ main.ts                  # точка входа Vue + DI + Pinia + Router
````

---

## 🚀 Быстрый старт

1. **Установить зависимости**
```bash
   npm install
   # or
   yarn install
````
2.	Настроить Firebase
– В src/infrastructure/firebase/firebaseConfig.ts положить свои настройки:
````
    export const firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      // ...
    };
````
## Project Setup

```sh
    npm install
```

### Compile and Hot-Reload for Development

```sh
    npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
    npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
    npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
    npm run lint
```