<script setup lang="ts">
import TWEEN from "@tweenjs/tween.js";
import { isUndefined } from 'lodash';
import * as dat from 'dat.gui'
import { loadFbx, loadGltf } from '~/assets/utils/modelLoadFuncs'
import * as THREE from "three";
import { OrbitControls } from "~/assets/js/Controls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { CSS2DRenderer, CSS2DObject, } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { ref, onMounted, getCurrentInstance } from "vue";
import { ElMessage, ElSelect, ElOption, ElProgress } from 'element-plus'
import { searchByParams } from '~/types/interface';
interface Lights {
  name: string,
  obj: THREE.AmbientLight | THREE.DirectionalLight | THREE.PointLight,
  position?: Array<number>,
  Helper?: THREE.PointLightHelper
}
const emit = defineEmits(['changeListBySN', 'changeViewBySN'])
const props = defineProps({
  model3dPropInfoData: Object,
  dataOnModel: Object,
  showInfo: Boolean,
  ST: String,
  renderList: Function
})
let currentMP = ref()
let show3D = ref(true);
let gui = new dat.GUI()
gui.hide()
let showAP = ref(false);
let timer: NodeJS.Timeout | null = null
let timer2: string | number | NodeJS.Timeout | undefined;
let { model3dPropInfoData, dataOnModel, showInfo, ST, renderList } = toRefs(props);
let propDataOnModel = ref()
let sum = ref(0)
const currentModel = ref('BRE');
const modelPath = ref(`model/${currentModel.value}.gltf`);
let fov = 46;
let mixer: THREE.AnimationMixer;
let clock = new THREE.Clock()
const router = useRouter();
const route = useRoute()
let sphere103: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>, lineGeometry, line, raycaster: THREE.Raycaster, mouse: THREE.Vector2;
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
const { proxy } = getCurrentInstance() as any;
const num = ref(0);
const isShow = ref(1);
const info = ref("model loading...");
let renderAF = ref()
let scene = ref<THREE.Scene | null>()
let camera = ref();
const renderer = ref();
const labelRenderer = ref();
const controls = ref();
const server = "/api/measurePoint/getBySubModel"
const realData = ref()
let infos = ref();
infos.value = model3dPropInfoData!.value
const options = ref([
  {
    value: 'GW',
    label: 'GW',
  },
  {
    value: 'SR',
    label: 'SR',
  },
])
const ModelPics = ref([
  {
    url: '../../public/image/F_BRE.png',
    name: 'Front'
  },
  {
    url: '../../public/image/B_BRE.png',
    name: 'Back'
  }
])
const curStationName = ref("")

const onProgress = (xhr: any) => {
  num.value = Math.floor((xhr.loaded / xhr.total) * 100);
};
function addGrid() {
  //添加地板割线
  var grid = new THREE.GridHelper(800, 200, 0xeeeeee, 0xeeeeee);
  grid.position.y = -6.5;
  grid.rotation.y = -Math.PI;
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.value!.add(grid);
}
const deco = () => {
  const decorations = document.querySelectorAll('.decoration') as NodeListOf<HTMLElement>;
  [...decorations].forEach((v, i) => {
    if (i > 0) {
      v.style.right = `-${16 + 14 * i}%`
    }
    i > 2 ? v.style.opacity = `${1 * (1 - i * 0.1)}` : ''
  })
}

function removeTags() {
  const meshes = scene.value!.children.filter((o) => {
    return o.type == 'Object3D';
  })
  scene.value!.remove(...meshes);
}

async function getCurCar(flag?: boolean, stationNameFromSelect?: string) {
  let url = '/api/cache/getCurCarAndStation'
  let params = {}
  let headers = {
    token: localStorage.getItem('token')
  }
  let { data, status } = await proxy.$http.get(url, { params, headers })
  if (status == 200) {
    let { productPrototypeSubModel, stationName } = data
    currentModel.value = productPrototypeSubModel
    curStationName.value = isUndefined(stationNameFromSelect) ? stationName : stationNameFromSelect
    modelPath.value = `model/${currentModel.value}.gltf`
   
    proxy.$http.get(server, {
      params: {
        subModel: currentModel.value
      },
      headers: {
        token: localStorage.getItem('token')
      }
    }).then((v: { status: number; data: any; }) => {
      if (v.status == 200) {
        realData.value = v.data; // 模型上测量点位置;
        if (isUndefined(flag)) {
          init()
        }
        else {
          init(flag)
        }
      } else if (v.status == 401) {
        ElMessage('请登录后在操作！');
        router.push('/login')
        return;
      }
    }).catch((e: any) => {
      if (e.response.data.status == 401) {
        ElMessage('登录凭证失效,请登录后在操作！');
        setTimeout(() => {
          router.push('/login')
        }, 500);
        return;
      } else {
        ElMessage(`${e.response.data.status + '-' + e.response.data.error}`);
        return;
      }

    })
  }
}

function getMesurePointsBySubModel(flag?: { 0: string; } | undefined, stationNameFromSelect?: string) { // 获得模型上测点位置
  let __;
  getCurCar(__, stationNameFromSelect)
}
async function changeModelByWs(modelName?: any, stationNameFromWS?: any, modelOnly?: boolean) {
  curStationName.value = stationNameFromWS;
  if (!isUndefined(modelName)) {
    // 首先清除model
    const preModel = scene.value!.children.filter(v => { // 过滤出模型obj
      return v.name == 'AnimationRef';
    });
    if (preModel.length > 0) {
      const container = document.querySelector('#container')!;
      const canvas = document.querySelector('#container>canvas')!
      container.removeChild(canvas)
      removeTags();
      clearTimeout(timer2)
      setTimeout(() => {
        scene.value!.remove(...preModel) // 清除模型
        if (!isUndefined(modelName)) {
          currentModel.value = modelName
          modelPath.value = `model/${modelName}.gltf`
          getMesurePointsBySubModel()
          setTimeout(() => {
            toggleStation(stationNameFromWS)
          }, 5800);
        }
      }, 300);
    }
  } else {
    toggleStation(stationNameFromWS)
  }

}
function guiAdd(camera) {
  gui.add(camera.position, 'x').step(0.01).min(-30).max(30)
  gui.add(camera.position, 'y').step(0.01).min(-30).max(30)
  gui.add(camera.position, 'z').step(0.01).min(-30).max(30)
}
const initPrerequsites = () => {
  scene.value = new THREE.Scene()
  const element = document.getElementById("container")!;
  const Lights: Array<Lights> = [
    { name: 'AmbientLight', obj: new THREE.AmbientLight(0xffffff, .75) },
    {
      name: 'pointLight1',
      obj: new THREE.PointLight(0xffffff, .75, 4),
      position: [0, 5, 0]
    },
    {
      name: 'pointLight2',
      obj: new THREE.PointLight(0xffffff, .75, 4),
      position: [0, -5, 0]
    },
    {
      name: 'pointLight3',
      obj: new THREE.PointLight(0xffffff, .75, 4),
      position: [-5, 0, 5]
    },
    {
      name: 'pointLight4',
      obj: new THREE.PointLight(0xffffff, .75, 4),
      position: [5, 0, 5]
    },
    { name: 'DirectionalLight_top', obj: new THREE.DirectionalLight(0xffffff, 0.5), position: [50, 50, 50] },
    { name: 'DirectionalLight_bottom', obj: new THREE.DirectionalLight(0xffffff, 0.5), position: [0, -200, 0] },
    { name: 'DirectionalLight_right1', obj: new THREE.DirectionalLight(0xffffff, 0.5), position: [0, -5, 20] },
    { name: 'DirectionalLight_right2', obj: new THREE.DirectionalLight(0xffffff, 0.5), position: [0, -5, -20] },
  ];
  Lights.map(item => {
    item.obj.name = item.name;
    item.position && item.obj.position.set([...item.position][0], [...item.position][1], [...item.position][2]);
    item.Helper = new THREE.PointLightHelper(item.obj as any);
    scene.value!.add(item.obj);
  })
  //相机
  camera.value = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  //-11.24, 7.88, 12.53 | -11.7,  7.0,  18.7 | last:-24.3, 2.9, 12.84
  camera.value.position.set(-18.42, 11.50, 13.45); // 设置相机位置
  camera.value.lookAt(new THREE.Vector3(-18.42, 11.50, 13.45)); // 设置相机方向
  scene.value!.add(camera.value);
  // renderer 设置
  renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.value.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
  renderer.value.shadowMap.enabled = true; // 显示阴影
  renderer.value.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.value.setClearColor(0xaaaaaa); // 设置背景颜色
  element.appendChild(renderer.value.domElement); // 这里是canvas
  labelRenderer.value = new CSS2DRenderer();
  labelRenderer.value.setSize(element.clientWidth, element.clientHeight);
  labelRenderer.value.domElement.style.position = "absolute";
  labelRenderer.value.domElement.style.top = "0px";
  labelRenderer.value.domElement.setAttribute('refer', 'labelRendererDom')
  labelRenderer.value.domElement.style.pointerEvents = 'auto'; // 这里设置为none，模型点击获取坐标就可以生效了，但是对于css2dobject的操作就被屏蔽了！！！
  element.appendChild(labelRenderer.value.domElement); // 这里domElement是 divlabel的父级
  // init 控制器
  controls.value = new OrbitControls(
    camera.value,
    labelRenderer.value.domElement
  );
  // copy中实例了两个控制对象, 经试验 只绑定labelRenderer_controls 也可以！！！，但是不能只绑定 controls ，这个就将controls 定义为 labelRenderer_controls
  showInfo.value && (controls.value.autoRotate = true)
  // 开启了自动旋转属性后，点位会产生些许偏移
  controls.value.minDistance = 15;
  controls.value.maxDistance = 30;
  // 这里控制可以缩放的最大最远距离，也就是放大缩小的比例
  renderer.value.domElement.removeAttribute('tabindex');
  //  去除 点击模型出现白色边框
  labelRenderer.value.domElement.removeAttribute('tabindex');
  //  去除 点击模型出现白色边框
  return new Promise((resolve) => {
    resolve(1)
  })
}
async function keyframeAni(object: THREE.Object3D) {
  const times = [0, 2];
  const rorateValues = [0, -Math.PI * 2];
  const Kf_duration = 2;
  const VKf_duration = 2.8
  // 关键帧轨道！！！
  const rotateTrack = new THREE.KeyframeTrack(
    'AnimationRef.rotation[y]',
    times,
    rorateValues
  );
  const { x, y, z } = object.position;
  const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2], [x, y, z, x, y + 0.15, z, x, y, z]);

  const animations: [THREE.KeyframeTrack, THREE.VectorKeyframeTrack] = [rotateTrack, positionKF]
  //动画剪辑
  animations.forEach((ani, index) => { // animation 是系统特殊变量！！！
    if (index == 0) {
      const clip = new THREE.AnimationClip('modelRotation', Kf_duration, [ani]);
      //播放编辑好的关键帧动画
      // const gp = new THREE.Object3D(); // 用一个3d物体包裹模型，旋转3d物体已达到绕自身旋转的效果。failed
      // gp.position.set(0, 0, 0);
      // gp.add(object);
      mixer = new THREE.AnimationMixer(object);
      const animation = mixer.clipAction(clip);
      animation.setLoop(THREE.LoopOnce, 1) // 设置帧动画只播放一次！！！
      animation.timeScale = 1 //调节播放速度，默认1，0动画暂停，负数动画反方向执行。
      animation.play() //开始播放。
    } else {
      setTimeout(() => {
        if (sum.value > 2) {
          const clip = new THREE.AnimationClip('modelTranslateY', VKf_duration, [ani]);
          mixer = new THREE.AnimationMixer(object);
          const animation = mixer.clipAction(clip);
          animation.setLoop(THREE.LoopRepeat, Infinity) // 设置帧动画只播放一次！！！
          animation.timeScale = 1 //调节播放速度，默认1，0动画暂停，负数动画反方向执行。
          animation.play() //开始播放。
        }
      }, 2023);
    }
  })
}
/* 判断模型是否被移出相机可视区！！！ */

const render = () => {
  cancelAnimationFrame(renderAF.value)
  renderAF.value = requestAnimationFrame(render);
  renderer.value.render(toRaw(scene.value), camera.value);
  labelRenderer.value.render(toRaw(scene.value), camera.value);
  controls.value.update();
  TWEEN.update();
  // console.log(camera.value.position)
  //模型旋转动画
  if (mixer) {
    const t = clock.getDelta();
    sum.value += t;
    mixer.update(t)
  }
};

const toggleShowAP = () => {
  showAP.value = !showAP.value
  if (showAP.value && show3D.value) {
    const container = document.querySelector('#container')!;
    setTimeout(() => {
      const mm = container.querySelectorAll('.status>.myDiv');
      if (mm.length > 0) {
        showMPs()
      }
    }, 50);
  } else {
    removeTags()
  }
}
const showMPs = () => {
  const container = document.querySelector('#container')!;
  setTimeout(() => {
    const mm = container.querySelectorAll('.status>.myDiv');
    [...mm].forEach(m => {
      (m as HTMLDivElement).style.display = 'block'
    })
  }, 50);
}
function lock() {
  controls.value.autoRotate = false;
}
function unlock() {
  if (timer) clearTimeout(timer); timer = null;

  timer = setTimeout(() => {
    controls.value.autoRotate = true;
  }, 9999);
}

const bindEvents = () => {
  controls.value.addEventListener('start', lock)
  controls.value.addEventListener('end', unlock);
  labelRenderer.value.domElement.addEventListener("mouseenter", (event: { preventDefault: () => void }) => {
    event.preventDefault();
    controls.value.autoRotate = false;
    // if (scene.value!.children.filter(v => {
    //   return v.type == 'Group' && v.name == "AnimationRef"
    // }).length > 0 && labelRenderer.value.domElement.children.length == 0) {
    //   addSprites()
    // }
  });
  labelRenderer.value.domElement.addEventListener("mouseleave", (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // removeTags()
    showAP.value = false
    if (timer) clearTimeout(timer); timer = null;
    timer = setTimeout(() => {
      controls.value.autoRotate = true;
    }, 9999);
  });
};

//模型位置判断，如果处于不可见位置，则reset 模型位置
function judgeModelPosition(model: THREE.Object3D<THREE.Event>) {
  let vector = new THREE.Vector3(model.position.x, model.position.y, model.position.z)
  let tempV = vector.applyMatrix4(camera.value.matrixWorldInverse).applyMatrix4(camera.value.projectionMatrix);
  if ((Math.abs(tempV.x) > 1) || (Math.abs(tempV.y) > 1) || (Math.abs(tempV.z) > 1)) {
    if (isUndefined(controls.value.autoRotate) || controls.value.autoRotate == false) {
      ElMessage('模型暂不可见,将恢复原视图!')
      controls.value.reset()
    }

  } else {
    console.log('in')
  }
}
const timerOfModelView = () => {
  timer2 = setInterval(() => {
    let model = scene.value?.children.filter(v => {
      return v.name == "AnimationRef" && v.type == 'Group'
    })!
    if (model.length == 1) {
      judgeModelPosition(model[0])
    }
  }, 2500)
}

const init = async (flag?: boolean) => {
  initPrerequsites().then((v) => {
    render()
  })
  await loadSTL(); // 加载STL模型
  showInfo.value && bindEvents()
  addGrid()
  deco()
};

/**animateCamera()
 * current1 相机当前的位置 target1 相机的目标位置
 * target1 相机的目标位置
 * current2 当前的controls的target
 * target2 新的controls的target
 * */
async function animateCamera(current1: { x: any; y: any; z: any; }, target1: { x: any; y: any; z: any; }, current2: { x: any; y: any; z: any; }, target2: { x: any; y: any; z: any; }) {
  // console.log(current1, target1, current2, target2)
  var tween = new TWEEN.Tween({
    x1: current1.x, // 相机当前位置x
    y1: current1.y, // 相机当前位置y
    z1: current1.z, // 相机当前位置z
    x2: current2.x, // 控制当前的中心点x
    y2: current2.y, // 控制当前的中心点y
    z2: current2.z, // 控制当前的中心点z
  });
  tween.to(
    {
      x1: target1.x, // 新的相机位置x
      y1: target1.y, // 新的相机位置y
      z1: target1.z, // 新的相机位置z
      x2: target2.x, // 新的控制中心点位置x
      y2: target2.y, // 新的控制中心点位置x
      z2: target2.z, // 新的控制中心点位置x
    },
    3500
  );
  tween.onUpdate(function (object) {
    // console.log(object)
    // camera.value.lookAt(target1.x,target1.y,target1.z)
    camera.value.position.x = object.x1;
    camera.value.position.y = object.y1;
    camera.value.position.z = object.z1;
    controls.value.target.x = object.x2;
    controls.value.target.y = object.y2;
    controls.value.target.z = object.z2;
    controls.value.update();
  });
  tween.easing(TWEEN.Easing.Cubic.InOut);
  tween.start();
}
function getCameraAndControl() {
  return { camera: camera.value, control: toRaw(controls.value) }
}
defineExpose({ changeModelByWs, animateCamera, getCameraAndControl })
onMounted(async () => {
  setTimeout(() => {
    timerOfModelView()
  }, 50);
  getMesurePointsBySubModel()
  let hash = route.hash;
  if (hash.includes('#debug')) {
    setTimeout(() => {
      gui.show()
      guiAdd(camera.value)
    }, 250);

  }
});
function clearCache() {
  cancelAnimationFrame(renderAF.value)
  scene.value!.clear()
  scene.value = null
  camera.value = null
  controls.value = null
  renderer.value.dispose()
  renderer.value.forceContextLoss();
  renderer.value.context = null;
  renderer.value.domElement = null;
  renderer.value = null;
  labelRenderer.value.domElement = null;
  labelRenderer.value = null;
}
onUnmounted(() => { // 网页离开的
  clearCache()
  clearInterval(timer2)
})
watch(show3D, (cur) => {
  if (cur == true) {
    const refer = document.querySelector('div[refer="labelRendererDom"]')!
    removeNodeWithChild(refer)
    init()
  } else {
    let __;
    changeModelByWs(__, __, true)
    clearInterval(timer2)
    clearTimeout(timer!)
    showPic()
  }
})
function showPic() {
  const refer = document.querySelector('div[refer="labelRendererDom"]')!
  refer.classList.add('modelPic')
  ModelPics.value.forEach(v => {
    let img = document.createElement('img')
    img.src = v.url
    refer.appendChild(img)
  })
}
function removeNodeWithChild(node, removeSelf?: boolean) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  if (isUndefined(removeSelf)) {
    node.parentNode.removeChild(node);
  }
}
const loadSTL = async (path?: string, modelName?: string, stationName?: string) => {
  isShow.value = 1;
  num.value = 0;
  await loadGltf(camera, GLTFLoader, modelPath.value,
    scene.value!, [addSprites, roundSprites], onProgress, isShow, num, info, keyframeAni, showInfo.value, dataOnModel!.value);
};

function addSprites(v?) {
  let dat = isUndefined(v) ? dataOnModel!.value! : v
  realData.value.forEach(async (vv: { positionX: number; positionY: number; positionZ: number; pointId: number; name: string }, index: number) => {
    if (((vv.positionX) != null || (vv.positionY) != null || (vv.positionZ) != null)) {
      if (realData.value) {
        const MPdata = (dat as unknown as Array<searchByParams>).filter((v: any, i) => {
          return v.pointName == vv.name
        })
        if (MPdata.length > 0) {
          const waves = document.createElement('div');
          waves.id = MPdata[0].pointName
          waves.className = 'status';
          const solid = document.createElement('div');
          solid.className = 'solid';
          const animate1 = document.createElement('div');
          animate1.className = 'animate1';
          const animate2 = document.createElement('div');
          animate2.className = 'animate2';
          waves.appendChild(solid);
          waves.appendChild(animate1);
          waves.appendChild(animate2);
          loadLabel(MPdata, vv, waves)
          const wavesLabel = new CSS2DObject(waves);
          wavesLabel.name = "mesPoint";
          wavesLabel.position.set((vv.positionX), (vv.positionY), (vv.positionZ));
          scene.value!.add(wavesLabel);
        }
      }


    }
  })
}
const loadLabel = async (MPdata: any, vv: any, waves: any) => {
  const div = document.createElement("div");
  div.className = "myDivForHover";
  div.style.pointerEvents = 'auto'
  div.id = vv.name;
  div.addEventListener("pointerdown", (e) => {
    router.push({ name: 'details', query: { id: MPdata[0].productPrototypeFeature, pointName: MPdata[0].pointName, stationName: ST!.value } })
    // let r = router.resolve({ path: '/MPDetail', query: { XYZ: JSON.stringify({ x: MPdata[0].txObserValue, y: MPdata[0].tyObserValue, z: MPdata[0].tzObserValue, dx: MPdata[0].txObserDevia, dy: MPdata[0].tyObserDevia, dz: MPdata[0].tzObserDevia, id, curModel: currentModel.value, partName: MPdata[0].pointName, position: [(vv.positionX), (vv.positionY), (vv.positionZ)], stationName: ST!.value, eventTime: MPdata[0].eventTime }) } })
    // window.open(r.href, "_blank")
    // router.push({path:'/MPDetail', state:{id, curModel:currentModel.value,}}) // 使用state, 需要在history API 路由方式下，使用， 接收： history.state.params
  });
  div.innerHTML = `
                      <div id=${MPdata[0].pointName} class="MPWrap PM">
                        <div class="MPWrap_title PM">${MPdata[0].pointName} </div>
                        <div class=MPWrap_item>
                          <div>X ${(MPdata[0].txObserValue as number).toFixed(2)}</div>
                          <div class=tag>DX ${(MPdata[0].txObserDevia as number).toFixed(2)}</div>
                        </div>
                        <div class=MPWrap_item>
                          <div>Y ${(MPdata[0].tyObserValue as number).toFixed(2)}</div>
                          <div class=tag>DY ${(MPdata[0].tyObserDevia as number).toFixed(2)}</div>
                        </div>
                        <div class=MPWrap_item>
                          <div>Z ${(MPdata[0].tzObserValue as number).toFixed(2)}</div>
                          <div class=tag>DZ ${(MPdata[0].tzObserDevia as number).toFixed(2)}</div>
                        </div>
                        <div class="MPWrap_DD PM">DD:${MPdata[0].ddistance} </div>
                      </div>
                  `;
  waves.appendChild(div)
}
let count = ref(0); // 记录已经遍历过的元素数量
let timerOnSprite = ref()
async function roundSprites(vv: []) {
  for (let i = 0; i < vv.length; i++) {
    await new Promise(resolve => {
      if (timerOnSprite.value) clearTimeout(timerOnSprite.value)
      timerOnSprite.value = setTimeout(() => {
        const container = document.querySelector('#container')!;
        const mm = container.querySelectorAll('.status');
        let mmm = [...mm];
        mmm.forEach(m0 => {
          m0.classList.remove('toggleMPColor')
          // let div = m0.querySelector('.myDivForHover')! as HTMLDivElement
          // if (div) {
          //   div.style.display = 'none'
          // }
        })
        let finish = false;
        mmm.forEach(m0 => {
          if (finish) return; // 如果已经找到了符合条件的元素，则直接返回
          if ((m0 as HTMLDivElement).id == vv[i].pointName) {
            setTimeout(() => {
              (m0 as HTMLDivElement).classList.add('toggleMPColor')
              // let div = m0.querySelector('.myDivForHover')! as HTMLDivElement
              // if (div) {
              //   div.style.display = 'block'
              //   div.style.zIndex = '99999'
              // }
              currentMP.value = vv[i]
            }, 50);
            count.value++; // 已经遍历的元素数量加1
            if (count.value == mmm.length) { // 如果已经遍历完所有元素，则重新开始新的一轮循环
              count.value = 0;
              roundSprites(vv); // 递归调用 roundSprites 函数，实现自动重新开始新的一轮循环
            }
            finish = true;
            resolve();
          }
        })
        if (!finish) { // 如果没有找到符合条件的元素，则也算已经遍历过了一个元素
          count.value++;
          if (count.value == mmm.length) { // 如果已经遍历完所有元素，则重新开始新的一轮循环
            count.value = 0;
            roundSprites(vv); // 递归调用 roundSprites 函数，实现自动重新开始新的一轮循环
          }
          resolve();
        }
      }, 2500);
    });
  }
}
function toggleStation(w: string) {
  let __;
  const refer = document.querySelector('div[refer="labelRendererDom"]')!
  if (refer.firstChild) {
    removeTags()
  }
  emit('changeViewBySN', w)
  nextTick(() => {
    renderList?.value!(w, currentModel.value).then(v => {
      propDataOnModel!.value = v
      removeTags()
      addSprites(v)
      roundSprites(v)
    })
  })
}
</script>
<template>
  <div>
    <div class="main w-full h-full relative" ref="container" id="container">
      <!-- isshow here -->
      <div class="progress" v-show="isShow">
        <el-progress :text-inside="true" :stroke-width="24" :percentage="num" status="success" />
        <div class="progressInfo">{{ info }}</div>
      </div>
      <!-- <div v-if="currentMP" class="MPInfo myDiv absolute top-3 left-3">
                                    <div id="${MPdata[0].pointName}" class="MPWrap PM">
                                      <div class="MPWrap_title PM">{{ currentMP.pointName }}</div>
                                      <div class="MPWrap_item">
                                        <div>X {{ currentMP.txObserValue }}</div>
                                        <div class="tag">DX {{ currentMP.txObserDevia }}</div>
                                      </div>
                                      <div class="MPWrap_item">
                                        <div>Y {{ currentMP.tyObserValue }}</div>
                                        <div class="tag">DY {{ currentMP.tyObserDevia }}</div>
                                      </div>
                                      <div class="MPWrap_item">
                                        <div>Z {{ currentMP.tzObserValue }}</div>
                                        <div class="tag">DZ {{ currentMP.tzObserDevia }}</div>
                                      </div>
                                      <div class="MPWrap_DD PM">DD {{ currentMP.ddistance }} </div>
                                    </div>
                                  </div> -->
      <div v-if="showInfo"
        class="z-[88999] model3d-modelSel absolute top-6 right-14 w-[215px] bg-[#001025] border-[#01122b]-50">
        <span class="text-white mr-2 cursor-pointer" @click="toggleShowAP">当前工位:</span>
        <el-select @change="toggleStation" v-model="curStationName" class="my-2 w-[33%] z-[9999] " placeholder="Select"
          size="small">
          <el-option class="" v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

      </div>
      <el-button-group v-if="showInfo" class=" !hidden absolute  bottom-2 right-2 z-[88999]">
        <el-button type="" class="!text-white bg-sky-600 cursor-pointer " @click="show3D = true">3D视图</el-button>
        <el-button type="" class="!text-white  bg-sky-600 cursor-pointer" @click="show3D = false">PIC视图</el-button>
      </el-button-group>
    </div>
  </div>
</template>
<style lang="less" scoped>
.modelPic {
  display: flex;
  flex-direction: row;

  img {
    height: 100%;
    width: auto;
  }
}

.progress {
  position: absolute;
  left: 50%;
  top: 10px;
  width: 350px;
  transform: translateX(-50%);
  z-index: 9999;

  .progressInfo {
    color: #fff; // color:#1f3b6f
    text-align: center;
    margin-top: 5px;
  }
}

.el-select {
  & :deep(.el-input__wrapper) {
    background-color: rgba(0, 0, 0, 0) !important;
    box-shadow: none !important;
    border: none !important;

    &:focus {
      border: none !important;
    }

    &:focus-visible {
      border: none !important;
      outline: none !important;
    }

    &>input {
      color: #efecec !important;
      font-weight: bolder !important;
      border: none !important;
    }
  }
}

.model3d-title {
  .productInfo {
    width: 240px;
    height: 423px;
    background-image: url(../assets/images/u809.png);

    .productInfoItem {
      border-bottom: none !important;

      .pValue {
        font-family: "Arial Normal", Arial, sans-serif;
      }

      &:not(&:last-of-type)::before {
        content: '';
        position: absolute;
        left: 18px;
        top: auto;
        bottom: -24px;
        right: 18px;
        height: 1px;
        width: calc(100%- 36px);
        background-color: #052E61;
      }

      &::after {
        content: '';
        position: absolute;
      }
    }
  }

  text-align: center;
  padding: 13px 23px;
  color: white;
  perspective: 800px;

  &::before {
    content: '';
    position: absolute;
    top: 21px;
    left: 15px;
    width: 8px;
    height: 8px;
    background: rgba(242, 242, 242, 1);
    // border: 1px solid #52c8f6;
    // transform: skew(-45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 18px;
    left: 18px;
    width: 8px;
    height: 8px;
    background: rgba(242, 242, 242, .6);
  }

  .decoration {
    content: '';
    width: 16px;
    height: 13px;
    position: absolute;
    top: 50%;
    background: rgba(103, 133, 143, 1);
    transform: translateY(-50%) skew(-45deg);
    right: -16%;
  }
}

:deep(.el-message-box__message) {
  p {
    line-height: 26px !important;
  }

  .inputBox {
    display: flex !important;
    justify-content: space-between !important;

    input {
      box-shadow: rgb(220, 223, 230) 0px 0px 0;
      outline: none;
      border: 1px solid #39393a;
      border-radius: 3px;
    }
  }
}

.el-message-box__message {
  p {
    line-height: 26px !important;
  }

  .inputBox {
    display: flex !important;
    justify-content: space-between !important;

    input {
      box-shadow: rgb(220, 223, 230) 0px 0px 0;
      outline: none;
      border: 1px solid #39393a;
      border-radius: 3px;
    }
  }
}

.el-button--primary {
  color: #111 !important;
}
</style>