<template>
  <main font-sans class="h-full w-full overflow-hidden bg-black" text="center gray-700 dark:gray-200">
    <suspense>
      <router-view />
    </suspense>
    <!-- <Footer /> -->
  </main>
</template>
<script setup lang="ts">

</script>
<style lang="scss">
.modelPic {
  display: flex;
  flex-direction: row;

  img {
    height: 100%;
    width: auto;
  }
}

.toggleMPColor {
  /*  */
  &> div:nth-child(-n + 3) { 
    background-color: rgb(247, 251, 1) !important;
  }
}

.myDivForHover {
  @apply w-48 bg-[#5B9BD5]  hidden relative;

  .MPWrap {
    @apply w-full flex flex-col text-white justify-center items-center;

    .MPWrap_title {
      @apply w-[55%] text-lg text-center text-red-600;
    }

    .MPWrap_item {
      @apply w-full p-2 text-base flex flex-row justify-center gap-2 text-white;
    }

    .MPWrap_DD {
      @apply w-[55%] text-lg text-center text-white;
    }
  }
}

.myDiv {
  @apply w-48 bg-[#5B9BD5] z-[99999999] relative;

  .MPWrap {
    @apply w-full flex flex-col text-white justify-center items-center;

    .MPWrap_title {
      @apply w-[55%] text-lg text-center text-red-600;
    }

    .MPWrap_item {
      @apply w-full p-2 text-base flex flex-row justify-center gap-2 text-white;
    }

    .MPWrap_DD {
      @apply w-[55%] text-lg text-center text-white;
    }
  }
}


.status {
  width: 15px;
  height: 15px;
  position: relative;
  cursor: pointer;

  &:hover {
    .myDivForHover {
      display: block !important;
      z-index: 99999 !important;
    }
  }
}


.solid {
  width: 60%;
  height: 60%;
  position: absolute;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(131, 105, 248, 0.35);
  border-radius: 100%;
  border: 1px solid #fff;
}

.status .animate1 {
  z-index: 999;
  background: rgba(144, 247, 236, .8);
  width: 15px;
  height: 15px;
  border-radius: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  border: 1px solid #fff;
}

.status .animate2 {
  z-index: 999;
  background: rgba(144, 247, 236, 1);
  width: 15px;
  height: 15px;
  border-radius: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  border: 1px solid #fff;
}

@keyframes circle {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1.8);
    transform: scale(1.8);
    opacity: 0.1;
    cursor: pointer;
  }
}

.status .animate1 {
  -webkit-animation: circle 2s 0s ease-out infinite running;
  animation: circle 2s 0s ease-out infinite running;
}

.status .animate2 {
  -webkit-animation: circle 2s 1s ease-out infinite running;
  animation: circle 2s 1s ease-out infinite running;
}


#app {
  font-family: 'Source Sans Pro', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin: 0;
}

:deep(.el-message-box) {
  .el-message-box__btns {
    .el-button span {
      color: #000000 !important;
    }

  }
}</style>
