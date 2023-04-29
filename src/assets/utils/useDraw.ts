import { ref } from 'vue'

export default function useDraw() {
  // * 指向最外层容器
  const appRef = ref()
  // * 定时函数
  const timer = ref()
  // * 默认缩放值
  const scale = ref({
    width: '1',
    height: '1',
  })
  // * 设计稿尺寸（px）
  const baseWidth = 1920
  const baseHeight = 1080

  // * 需保持的比例（默认1.77778）
  const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
  const calcRate = () => {
    // 当前宽高比
    const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
    if (appRef.value) {
      if (currentRate > baseProportion) {
        // 表示更宽
        scale.value.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
        scale.value.height = (window.innerHeight / baseHeight).toFixed(5)
        appRef.value.style.transform = `scale(${scale.value.width}, ${scale.value.height}) translate(-50%, -50%)`
      } else {
        // 表示更高
        scale.value.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
        scale.value.width = (window.innerWidth / baseWidth).toFixed(5)
        appRef.value.style.transform = `scale(${scale.value.width}, ${scale.value.height}) translate(-50%, -50%)`
      }
    }
   
  }

  const resize = () => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
     calcRate();
     
    }, 200)
  }

  // 改变窗口大小重新绘制
  const windowDraw = () => {
    window.addEventListener('resize', resize)
  }

  // 改变窗口大小重新绘制
  const unWindowDraw = () => {
    window.removeEventListener('resize', resize)
  }
  
  watch(scale,(cur, pre) => {
    localStorage.setItem('scale', JSON.stringify(scale.value))
    
    
  }, {immediate:true, deep:true})

  return {
    appRef,
    calcRate,
    windowDraw,
    unWindowDraw
  }
}
