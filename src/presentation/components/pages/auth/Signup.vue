<template>
  <div class="">
    <form class="mt-3">
      <h1 class="text-center">Sign Up</h1>
      <div class="mb-3">
        <label
          for="exampleInputEmail1"
          class="form-label"
        >Email address</label>
        <input
          id="exampleInputEmail1"
          type="email"
          class="form-control"
          aria-describedby="emailHelp"
        >
      </div>
      <div class="mb-3">
        <label
          for="exampleInputPassword1"
          class="form-label"
        >Password</label>
        <input
          id="exampleInputPassword1"
          type="password"
          class="form-control"
        >
      </div>
      <div class="mb-3 form-check">
        <input
          id="exampleCheck1"
          type="checkbox"
          class="form-check-input"
        >
        <label
          class="form-check-label"
          for="exampleCheck1"
        >Check me out</label>
      </div>
      <button
        type="submit"
        class="btn btn-primary w-100"
      >
        Sign Up
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

</style>
