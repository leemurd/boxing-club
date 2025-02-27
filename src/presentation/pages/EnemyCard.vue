<template>
  <div class="enemy-card">
    <h1>Enemy card</h1>

    <h4>Кто выше?</h4>
    <div class="btn-group mb-4" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" class="btn-check" name="height" id="height1" autocomplete="off" checked>
      <label class="btn btn-outline-primary" for="height1">Я</label>

      <input type="radio" class="btn-check" name="height" id="height2" autocomplete="off">
      <label class="btn btn-outline-primary" for="height2">Противник</label>

      <input type="radio" class="btn-check" name="height" id="height3" autocomplete="off">
      <label class="btn btn-outline-primary" for="height3">Примерно одинаково</label>
    </div>

    <h4>Кто тяжелее?</h4>
    <div class="btn-group mb-4" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" class="btn-check" name="weight" id="weight1" autocomplete="off" checked>
      <label class="btn btn-outline-primary" for="weight1">Я</label>

      <input type="radio" class="btn-check" name="weight" id="weight2" autocomplete="off">
      <label class="btn btn-outline-primary" for="weight2">Противник</label>

      <input type="radio" class="btn-check" name="weight" id="weight3" autocomplete="off">
      <label class="btn btn-outline-primary" for="weight3">Примерно одинаково</label>
    </div>

    <div class="d-flex">
      <div class="row">
        <div class="col d-flex flex-column">
          <h4>Я</h4>
          <div class="btn-group mb-4" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="stance" id="stance1" autocomplete="off" checked>
            <label class="btn btn-outline-primary" for="stance1">Правша</label>

            <input type="radio" class="btn-check" name="stance" id="stance2" autocomplete="off">
            <label class="btn btn-outline-primary" for="stance2">Левша</label>
          </div>

          <div class="btn-group-vertical mb-4" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="style" id="style1" autocomplete="off" checked>
            <label class="btn btn-outline-primary" for="style1">Игровик</label>

            <input type="radio" class="btn-check" name="style" id="style2" autocomplete="off">
            <label class="btn btn-outline-primary" for="style2">Панчер</label>

            <input type="radio" class="btn-check" name="style" id="style3" autocomplete="off">
            <label class="btn btn-outline-primary" for="style3">Технарь</label>

            <input type="radio" class="btn-check" name="style" id="style4" autocomplete="off">
            <label class="btn btn-outline-primary" for="style4">Контрпанчер</label>
          </div>
        </div>
        <div class="col d-flex flex-column">
          <h4>Противник</h4>
          <div class="btn-group mb-4" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="stanceEnemy" id="stanceE1" autocomplete="off" checked>
            <label class="btn btn-outline-primary" for="stanceE1">Правша</label>

            <input type="radio" class="btn-check" name="stanceEnemy" id="stanceE2" autocomplete="off">
            <label class="btn btn-outline-primary" for="stanceE2">Левша</label>
          </div>

          <div class="btn-group-vertical mb-4" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="styleEnemy" id="styleEnemy1" autocomplete="off" checked>
            <label class="btn btn-outline-primary" for="styleEnemy1">Игровик</label>

            <input type="radio" class="btn-check" name="styleEnemy" id="styleEnemy2" autocomplete="off">
            <label class="btn btn-outline-primary" for="styleEnemy2">Панчер</label>

            <input type="radio" class="btn-check" name="styleEnemy" id="styleEnemy3" autocomplete="off">
            <label class="btn btn-outline-primary" for="styleEnemy3">Технарь</label>

            <input type="radio" class="btn-check" name="styleEnemy" id="styleEnemy4" autocomplete="off">
            <label class="btn btn-outline-primary" for="styleEnemy4">Контрпанчер</label>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.enemy-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
