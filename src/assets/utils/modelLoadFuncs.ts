import * as THREE from 'three'
import { Color } from 'three'

/***
 * 反光材质！
*/
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Reflector } from 'three/examples/jsm/objects/Reflector';
let groundMirror;


const initLoaders = (loaders: new () => any) => {
    return new loaders()
}
const addgroundMirrors = (scene: THREE.Scene) => {
    let geometry = new THREE.PlaneGeometry(10000, 10000, 20, 20); // 平面集合体
    groundMirror = new Reflector(geometry, {
        clipBias: 0.0001,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: new Color(0xffffff), // 倒影的颜色，
    });
    groundMirror.position.y = -3.5;
    groundMirror.rotateX(- Math.PI / 2);
    groundMirror.material.opacity = 0;
    groundMirror.material.transparent = true;
    scene.add(groundMirror)

}
function setScaleToFitSize(camera: any, obj: THREE.Group, path: string, showInfo: boolean) {
    const boxHelper = new THREE.BoxHelper(obj);
    boxHelper.geometry.computeBoundingBox();
    const box = boxHelper.geometry.boundingBox!;
    const maxDiameter = Math.max(
        box.max.x - box.min.x,
        box.max.y - box.min.y,
        box.max.z - box.min.z
    );
    // 开启了自动旋转属性后，点位会产生偏移，所以这里scale 从 0.01 => 0.012 点位就看起来差不多对其
    let scaleValue = ((camera.value.position.z / maxDiameter) * 1.5) + 0.01
    if (showInfo) {
        scaleValue = scaleValue + 0.002
    }
    obj.scale.set(scaleValue, scaleValue, scaleValue);
}
function adjustCenter(obj: THREE.Group) {
    // 将模型的中心点设置到canvas坐标系的中心点，保证模型显示是居中的，object就是操作的目标模型
    let box = new THREE.Box3().setFromObject(obj); // 获取模型的包围盒
    let mdlen = box.max.x - box.min.x; // 模型长度
    let mdwid = box.max.z - box.min.z; // 模型宽度
    let mdhei = box.max.y - box.min.y; // 模型高度
    let x1 = box.min.x + mdlen / 2; // 模型中心点坐标X
    let y1 = box.min.y + mdhei / 2; // 模型中心点坐标Y
    let z1 = box.min.z + mdwid / 2; // 模型中心点坐标Z
    obj.position.set(-x1, -y1, -z1); // 将模型进行偏移
}
function polishLight(scene: THREE.Scene,) {
    const light = new THREE.DirectionalLight(0x001029, .5,)
    light.position.x = 5
    light.position.z = 6
    light.position.y = 7
    const light1 = new THREE.DirectionalLight(0x001029, .5,)
    light.position.x = 5
    light.position.z = 6
    light.position.y = -7
    scene.add(light, light1)
}
const loadFbx = async (camera: any, loaders: any, path: string, scene: THREE.Scene,
    callbackArr: Function[], onload: Function, isShow: { value: number; }, num: { value: number; }, info: { value: string; }, keyAni: Function, showLabel: boolean) => {
    const loader = initLoaders(loaders);
    loader.load(path, (object: any) => {
        object.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
                child.material.side = THREE.DoubleSide
                child.material.color = new THREE.Color("#cdcdcd");
                child.material.flatShading = false;
                child.geometry.computeVertexNormals();
            }
        });
        let scale = 0.05
        object.scale.set(scale, scale, scale);
        // const coordinate = new THREE.AxesHelper(6);
        // setScaleToFitSize(camera, object, path, showLabel);
        // adjustCenter(object)
        showLabel && addgroundMirrors(scene)
        object.rotateY(Math.PI * 1)
        object.name = 'AnimationRef' // 标记模型 name  
        scene.add(object);
        // scene.add(coordinate)
        if (num.value >= 100) {
            info.value = "done!";
            setTimeout(async () => {
                isShow.value = 0;
                showLabel && await keyAni(object)
                // if (showLabel) {
                //     setTimeout(() => {
                //         callbackArr.forEach(async (f) => {
                //             await f();
                //         })
                //     }, 2223);
                // }
            }, 250);
        }
    }, onload)
}
const loadSTL = (loaders: any, path: string, scene: THREE.Scene) => {
    const loader = initLoaders(loaders)
}
const loadGltf = (camera: any, loaders: any, path: string, scene: THREE.Scene,
    callbackArr: Function[], onload: Function, isShow: { value: number; }, num: { value: number; }, info: { value: string; }, keyAni: Function, showLabel: boolean, data) => {
    const loader = initLoaders(loaders);
    let preloader = new DRACOLoader();
    preloader.setDecoderPath('public/draco/')
    preloader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
    preloader.preload();
    loader.setDRACOLoader(preloader);
    loader.load(path, (gltf: any) => {
        gltf.scene.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
                child.material.side = THREE.DoubleSide
                child.material.color = new THREE.Color("#cdcdcd");
                child.material.flatShading = false;
                child.geometry.computeVertexNormals();
            }
        });
        let scale = 5.5
        gltf.scene.scale.set(scale, scale, scale);
        showLabel && addgroundMirrors(scene)
        gltf.scene.rotateY(Math.PI * 1)
        polishLight(scene)
        gltf.scene.name = 'AnimationRef' // 标记模型 name  
        scene.add(gltf.scene);
        if (num.value >= 100) {
            info.value = "done!";
            setTimeout(async () => {
                isShow.value = 0;
                showLabel && await keyAni(gltf.scene)
                if (showLabel) {
                    setTimeout(() => {
                        callbackArr.forEach(async (f, i) => {
                            if (i == 0) {
                                await f();
                            }
                            if (i == 1) {
                                let r = await f(toRaw(data));
                            }
                        })
                    }, 4223);
                }
            }, 250);
        }
    }, onload)
}
const loadObj = (loaders: any, path: string, scene: THREE.Scene) => {
    const loader = initLoaders(loaders)
}
export { loadFbx, loadGltf, loadObj, loadSTL, }