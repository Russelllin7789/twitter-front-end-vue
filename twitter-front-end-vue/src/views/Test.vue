<template>
  <div class="test">
    <div class="block"></div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  @include color-box(300px, 100px, red);
}
</style>