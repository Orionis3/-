<template>
  <div
    class="github-icon"
    :style="{
      width: size,
      height: size,
      backgroundColor: color
    }"
  ></div>
</template>

<script setup></script>
<style scoped>
.github-icon {
  display: inline-block;
  width: 24px; /* 与其他图标大小一致 */
  height: 24px;
  background-image: url('./github-hover.svg'); /* 相对路径正确 */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-image 0.2s ease;
}

.github-icon:hover {
  background-image: url('./github-fill.svg'); /* hover 图标路径 */
}
</style>
