<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ResourceTracker from "~/assets/js/dispose.js";
import { ref, onMounted, getCurrentInstance } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import useDraw from "~/assets/utils/useDraw";

interface Lights {
    name: string,
    obj: THREE.AmbientLight | THREE.DirectionalLight | THREE.PointLight,
    position?: Array<number>,
    Helper?: THREE.PointLightHelper
}

const loading = ref<boolean>(true);
const { appRef, calcRate, windowDraw } = useDraw();
let _: any;
const options = ref([
    { label: 'BRE', value: 'BRE' },
    { label: 'CRD', value: 'CRD' },
    { label: 'INT4D', value: 'INT4D' },
    { label: 'INT5D', value: 'INT5D' },
])
const modelSV = ref('BRE')
const rt = new ResourceTracker();
const track = rt.track.bind(rt);
let scene: THREE.Scene | null, raycaster: THREE.Raycaster, mouse: THREE.Vector2, sphere103: THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>;
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

let renderAF = ref()
const camera = ref();
const renderer = ref();
const controls = ref();
const { proxy } = getCurrentInstance() as any;

function clearCache() {
    cancelAnimationFrame(renderAF.value)
    scene!.clear()
    scene = null
    camera.value = null
    controls.value = null
    renderer.value.dispose()
    renderer.value.forceContextLoss();
    renderer.value.context = null;
    renderer.value.domElement = null;
    renderer.value = null;
}

const changeModel = (val: string) => {
    modelSV.value = val
    const obj = scene!.children.filter(v => {
        return v.type == 'Group'
    })
    if (obj.length > 0) {
        console.log(1)
        scene!.remove(...obj);
        const container = document.querySelector('#container')!;
        const canvas = document.querySelector('#container>canvas')!
        container.removeChild(canvas)
        clearCache()
        init(`/model/${modelSV.value}.gltf`);
    }


}
const createScene = () => {
    scene = new THREE.Scene();
    scene.position.y = 0;
};
const loadSTL = (scale = 5.5, path?: string) => {
    const loader = new GLTFLoader()
    let preloader = new DRACOLoader();
    preloader.setDecoderPath('public/draco/')
    preloader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
    preloader.preload();
    loader.setDRACOLoader(preloader);
    let dpath = path??'/model/BRE.gltf'
    loader.load(`${dpath}`, async (gltf) => {
        const coordinate = new THREE.AxesHelper(6);
        gltf.scene.name = modelSV.value
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.side = THREE.DoubleSide
                child.material.color = new THREE.Color("#cdcdcd");
                child.material.flatShading = false;
                //Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
                child.geometry.computeVertexNormals();
            }
        });
       
        const helper = new THREE.BoxHelper(gltf.scene, 0xff0000);
        helper.update();
        gltf.scene.rotateY(Math.PI * 1)
        // scene.add(track(object));
        scene!.add(gltf.scene);
        scene!.add(track(coordinate));
    });
};
const createLight = () => {
    const Lights: Array<Lights> = [
        { name: 'AmbientLight', obj: new THREE.AmbientLight(0xcccccc, .35) },
        // { name: 'PointLight', obj: new THREE.PointLight(0xffffff, 1, 200), position: [0, 50, 0] },
        // { name: 'PointLight', obj: new THREE.PointLight(0xffffff, 1, 200), position: [0, 0, 0] },
        { name: 'DirectionalLight_top', obj: new THREE.DirectionalLight(0xcccccc, 0.8), position: [50, 50, 50] },
        { name: 'DirectionalLight_bottom', obj: new THREE.DirectionalLight(0xcccccc, 0.8), position: [0, -200, 0] },
        { name: 'DirectionalLight_right1', obj: new THREE.DirectionalLight(0xcccccc, 0.8), position: [0, -5, 20] },
        { name: 'DirectionalLight_right2', obj: new THREE.DirectionalLight(0xcccccc, 0.8), position: [0, -5, -20] },
    ];
    Lights.map(item => {
        item.obj.name = item.name;
        item.position && item.obj.position.set([...item.position][0], [...item.position][1], [...item.position][2]);
        item.Helper = new THREE.PointLightHelper(item.obj as any);
        scene!.add(item.obj);
    })
};
const createCamera = () => {
    const el = document.querySelector('#container') as HTMLDivElement
    camera.value = new THREE.PerspectiveCamera(
        45,
        el.clientWidth / el.clientHeight,
        0.1,
        1000
    );
    camera.value.position.set(-24.3, 2.9, 12.84); // 设置相机位置

    camera.value.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机方向
    scene!.add(camera.value);
};
const createRender = () => {
    const element = document.getElementById("container")!;
    renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.value.setSize(window.innerWidth, window.innerHeight); // 设置渲染区域尺寸
    renderer.value.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
    renderer.value.shadowMap.enabled = true; // 显示阴影
    renderer.value.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.value.setClearColor(0xffffff, .5); // 设置背景颜色
    element.appendChild(renderer.value.domElement);
};
const createControls = () => {
    controls.value = new OrbitControls(camera.value, renderer.value.domElement);

    controls.value.enableRotate = true; //启用或禁用摄像机水平或垂直旋转

    controls.value.enableDamping = true;

    //动态阻尼系数 就是鼠标拖拽旋转灵敏度

    controls.value.dampingFactor = 0.25;

    //是否可以缩放

    controls.value.enableZoom = true;

    //是否自动旋转

    controls.value.autoRotate = false;

    controls.value.autoRotateSpeed = 1;

    //设置相机距离原点的最远距离

    controls.value.minDistance = 1;

    //设置相机距离原点的最远距离

    controls.value.maxDistance = 200;

    //是否开启右键拖拽

    controls.value.enablePan = true;
};
const render = () => {
    renderer.value.render(scene, camera.value);
    controls.value.update();
    renderAF.value = requestAnimationFrame(render);

};

const bindEvents = () => {
    renderer.value.domElement.addEventListener("click", (event: { preventDefault: () => void; clientX: number; clientY: number; }) => {
        event.preventDefault();
        let div3D = renderer.value.domElement;
        let div3DLeft = renderer.value.domElement.getBoundingClientRect().left;
        let div3DTop = renderer.value.domElement.getBoundingClientRect().top;
        // console.log(div3DLeft, div3DTop)
        mouse.x = ((event.clientX - div3DLeft) / div3D.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - div3DTop) / div3D.clientHeight) * 2 + 1;
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        // console.log(mouse.x, mouse)
        raycaster.setFromCamera(mouse, camera.value);
        raycastMeshes(clickApp, raycaster);
    });
};

function raycastMeshes(callback: { (intersects: any): void; (arg0: any): any; }, raycaster: THREE.Raycaster) {
    let intersects = [] as any;
    // 获取整个场景
    let theScene = scene || new THREE.Scene();
    // 获取鼠标点击点的射线
    let theRaycaster = raycaster || new THREE.Raycaster();
    // 对场景及其子节点遍历
    for (let i in theScene.children) {
        // 如果场景的子节点是Group或者Scene对象
        if (
            theScene.children[i] instanceof THREE.Group ||
            theScene.children[i] instanceof THREE.Scene
        ) {
            // 场景子节点及其后代，被射线穿过的模型的数组集合
            // intersects = theRaycaster.intersectObjects(theScene.children[i].children, true)
            let rayArr = theRaycaster.intersectObjects(
                theScene.children[i].children,
                true
            );
            intersects.push(...rayArr);
        } else if (theScene.children[i] instanceof THREE.Mesh) {
            // 如果场景的子节点是Mesh网格对象，场景子节点被射线穿过的模型的数组集合
            // intersects.push(theRaycaster.intersectObject(theScene.children[i]))
        }
    }
    intersects = filtersVisibleFalse(intersects); // 过滤掉不可见的
    // 被射线穿过的模型的数组集合
    if (intersects && intersects.length > 0) {
        return callback(intersects);
    } else {
        // this.hiddenDetailDiv()
        return null;
    }
}
function filtersVisibleFalse(arr: string | any[]) {
    let arrList = arr;
    if (arr && arr.length > 0) {
        arrList = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].object.visible) {
                arrList.push(arr[i]);
            }
        }
    }
    return arrList;
}
function clickApp(intersects: { point: any; }[]) {
    if (intersects[0].object !== undefined) {
        // console.log(intersects[0].object, "这就是成功点击到的对象了~");
        setPoint(intersects[0].point);
    }
}

function setPoint(points: { x: number; y: number; z: number; }) {
    //console.log(points);
    scene!.remove(sphere103);
    const x = Math.round(points.x * 1000) / 1000;
    const y = Math.round(points.y * 1000) / 1000;
    const z = Math.round(points.z * 1000) / 1000;
    // const x = Math.round(points.x * 1000) / 1000 + base.value.x;
    // const y = Math.round(points.y * 1000) / 1000 + base.value.y;
    // const z = Math.round(points.z * 1000) / 1000 + base.value.z;
    const params = {
        positionX: x,
        positionY: y,
        positionZ: z,
        belongTo: '',
        pointId: '',
        productPrototypeModel: '',
        productPrototypeSubModel: '',
        name: "",
        id:0
    };
    // console.log(params)
    var radius = 0.25,
        segemnt = 8,
        rings = 8;
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x9afc00 });
    sphere103 = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segemnt, rings),
        sphereMaterial
    );
    sphere103.position.set(x, y, z);
    scene!.add(sphere103);
    setTimeout(() => {
        ElMessageBox.confirm(
            `当前选中的测量点坐标为：（${x}, ${y}, ${z})<br/>
      <div class="inputBox flex flex-row justify-between items-center">
        <label>请输入测量点编号:</label><input style="margin-left:24px; border:1px solid #000;" id="inputName" autocomplete="off" />
      </div>
      <div class="inputBox flex flex-row justify-between items-center mt-5">
        <label>请输入测点名字:</label><input style="margin-left:24px; border:1px solid #000;" id="inputZone" autocomplete="off" />
      </div>
      <br/>
       <div class="inputBox flex flex-row justify-between items-center">
        <label>请输入模型名称:</label><input style="margin-left:36px; border:1px solid #000;" value=${modelSV.value}  id="inputModelName" autocomplete="off" />
       </div>
      `,
            `测量点添加`,
            {
                confirmButtonText: "添加",
                cancelButtonText: "再确认看看",
                dangerouslyUseHTMLString: true,
                type: "warning",
                draggable: true,
            }
        )
            .then(() => {
                params.pointId = (document.querySelector("#inputName") as any).value;
                params.name = (document.querySelector("#inputZone") as any).value;
                params.productPrototypeModel = modelSV.value;
                params.productPrototypeSubModel = modelSV.value;
                params.id = Math.ceil(Math.random() * 999999)
                const server = "/api/measurePoint/addPoint";
                //const local = "/index/rsdemo/addPoints"; // 
                proxy.$http.post(
                    server,
                    params,
                    {
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    }).then((res: any) => {
                        console.log(res);

                        if (res) {
                            const msg = ElMessage({
                                type: "success",
                                message: "添加成功！",
                            });
                            setTimeout(() => {
                                msg.close();
                                // router.replace({ name: "measure" });
                            }, 800);
                        }
                    })
            })
            .catch(() => {
                ElMessage({
                    type: "info",
                    message: "取消添加！",
                });
                scene.remove(sphere103); // 如果取消就移除小球
            });
    }, 800);
}

const init = async (path?: string) => {
    createScene(); // 创建场景
    loadSTL(_, path); // 加载STL模型
    createLight(); // 创建光源
    createCamera(); // 创建相机
    createRender(); // 创建渲染器
    createControls(); // 创建控件对象
    render(); // 渲染
    bindEvents();
};
const cancelLoading = () => {
    setTimeout(() => {
        loading.value = false;
        // chartRender()
    }, 500);
};

onMounted(async () => {
    cancelLoading()
    calcRate()
    windowDraw()
    setTimeout(() => {
        init();
    }, 500);
});

</script>
<template>
    <div class="spmain relative h-full w-full overflow-hidden bg-[#001637]" id="container">
        <div class="spmain-sel absolute top-5 left-3">
            <label for="" class="text-white mr-3">当前车型</label>
            <el-select @change="changeModel" v-model="modelSV" value-key="" placeholder="" allow-create clearable
                filterable>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

        </div>
    </div>
</template>
<style  lang="scss">
.spmain {
    // width: 100%;
    // height: 100%;
    // position: absolute;
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
</style>
