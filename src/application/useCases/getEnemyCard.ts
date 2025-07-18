export enum BodyRelation {
  I_AM_BIGGER = 'i_am_bigger',
  I_AM_SMALLER = 'i_am_smaller',
  EQUAL = 'equal'
}

export type StanceSide = 'orthodox' | 'southpaw'
export type BoxerStyle = 'gamer' | 'puncher' | 'technician' | 'counterpuncher'
export type BoxerGuard = 'closed' | 'classical' | 'handsDown'

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
    parts.push(
      'Вы агрессивный панчер, соперник — технарь, значит, ему будет комфортнее вести бой с дистанции и разбирать вас по точности.'
    )
    parts.push('Старайтесь ломать ритм, навязывая силовую борьбу, и не дайте технарю спокойно «читать» ваши атаки.')
  } else if (opts.myStyle === 'counterpuncher' && opts.oppStyle === 'puncher') {
    parts.push('Вы контрпанчер, соперник — панчер, значит, он будет стремиться взорваться серией мощных ударов.')
    parts.push('Ваша задача — выманивать его на риск и ловить в момент атаки быстрыми ответными ударами.')
  } else {
    parts.push('Анализируйте базовые сильные стороны своего стиля и старайтесь искать уязвимости в стиле соперника.')
    parts.push(
      'Если ваш оппонент любит постоянный прессинг, отвечайте движением и точными контрвыпадами; если он осторожен, давите и поджимайте.'
    )
  }

  // Защита
  if (opts.myGuard === 'closed' && opts.oppGuard === 'handsDown') {
    parts.push('У вас более надёжная защита, поэтому не бойтесь идти вперёд и вынуждать соперника раскрыться.')
    parts.push('Как только видите, что его руки опущены, вбрасывайте быстрые удары, заставляя его тратить силы на блоки.')
  } else if (opts.myGuard === 'handsDown' && opts.oppGuard !== 'handsDown') {
    parts.push('Ваш стиль предполагает быстрые реакции и постоянную работу корпусом, но любая ошибка может стоить дорого.')
    parts.push('Не заигрывайтесь с «руками внизу» и ищите моменты для внезапных атак, совмещая финты и резкие выпады.')
  } else {
    parts.push(
      'Если у вас классическая или закрытая стойка, а соперник нет, используйте стабильность защиты и работайте преимущественно первым номером.'
    )
    parts.push(
      'Если наоборот, будьте готовы к плотному прессингу и готовьте контрвыпады, исходя из того, где у противника слабые места.'
    )
  }

  return parts
}
