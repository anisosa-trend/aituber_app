import { FC, Suspense, startTransition, useEffect, useMemo, useRef, useState } from "react"

import * as THREE from 'three';
import { AnimationAction, AnimationClip, AnimationMixer } from 'three';
import { FBXLoader, GLTFLoader, GLTFLoaderPlugin, MMDLoader } from 'three-stdlib';
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

import { loadMixamoAnimation } from "./loadMixamoAnimation";
import { fog } from "three/examples/jsm/nodes/fog/FogNode";
import { useFBX } from "@react-three/drei";

export const VrmStage: FC = () => {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 1.5, 2.5] }}
      >
        {/* <ambientLight intensity={Math.PI / 2} /> */}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} castShadow={true} /> */}
        {/* <directionalLight position={[1, 1, 1]} /> */}
        <VRMAsset />
        <Floor />
        <gridHelper args={[20, 20, '#dedede', '#dedede']} />
      </Canvas>
    </Suspense>
  )
}

const Floor: FC = () => {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      {/* <circleGeometry args={[5]} /> */}
      <meshStandardMaterial color={"#ffffff"} />
    </mesh>
  )
}

// const FBXModel: FC = () => {
//   /* FBXモデル読込み */
//   const gltf = useLoader(GLTFLoader, 'models/anna_shirafuji.vrm', (loader) => {
//     loader.register((parser) => new VRMLoaderPlugin(parser as any) as any as GLTFLoaderPlugin);
//   });

//   /* AnimationClip(s)読込み */
//   const animCrips: THREE.AnimationClip[][] = []
//   animCrips[0] = useFBX('/raw/EK_11_sleepy_languid_F.fbx').animations
//   animCrips[1] = useFBX('/raw/EK_12_sleepy_languid_F.fbx').animations
//   animCrips[2] = useFBX('/raw/EK_13_sleepy_languid_F.fbx').animations
//   animCrips[3] = useFBX('/raw/EK_14_sleepy_languid_F.fbx').animations
//   animCrips[4] = useFBX('/raw/EK_15_sleepy_languid_F.fbx').animations
//   animCrips[5] = useFBX('/raw/EK_16_sleepy_languid_F.fbx').animations

//   /* 変数定義 */
//   const mixer = useRef<AnimationMixer>();

//   // const [vrm, setVRM] = useState<VRM | null>(null);
//   const [animIdx, setAnimIdx] = useState<number>(0);
//   const [rotation, setRotation] = useState<number[]>([0, 0, 0]);

//   const animActions = useMemo(() => [] as AnimationAction[], [])

//   /* 初期化 */
//   useEffect(() => {
//     if (gltf) {
//       const vrm = gltf.userData.vrm as VRM;

//       if (vrm) {
//         // setVRM(vrm);

//         // (async () => {
//         //   const animation = await loadMixamoAnimation('/raw/sample2.fbx', vrm);

//         //   const mixer = new AnimationMixer(vrm.scene);
//         //   mixer.clipAction(animation).play();
//         // })();

//         animCrips.forEach((val: AnimationClip[], idx: number) => {
//           animActions[idx] = mixer.current!.clipAction(val[0])
//         })

//         new Promise((resolve) => setTimeout((resolve) => { return void 0 }, 1000)).then(() => animActions[0].play())

//         // frustumCulledを切らないとメッシュが一部表示されない
//         vrm.scene.traverse((obj: THREE.Object3D) => {
//           obj.frustumCulled = false;
//         });
//         if (vrm.meta.metaVersion !== '1') {
//           setRotation([0, (180 * Math.PI) / 180, 0]);
//         }
//       }
//     }
//   }, [gltf]);

//   // useEffect(() => {
//   //   fbx.scale.multiplyScalar(0.02)
//   //   mixer.current = new THREE.AnimationMixer(fbx)
//   //   animCrips.forEach((val: THREE.AnimationClip[], idx: number) => {
//   //     animActions[idx] = mixer.current!.clipAction(val[0])
//   //   })
//   //   /* 1秒後に開始 */
//   //   /* eslint no-unused-expressions: "off" */
//   //   new Promise((resolve) => setTimeout((resolve) => { return void 0 }, 1000)).then(() => animActions[0].play())
//   // }, [])

//   /* モーション切替え処理 */
//   useEffect(() => {
//     const act: THREE.AnimationAction = animActions[animIdx]
//     act?.reset().fadeIn(0.3).play()
//     return () => {
//       act?.fadeOut(0.3)
//     }
//   }, [animIdx])

//   /* FPS処理 */
//   useFrame((state, delta) => {
//     mixer.current!.update(delta);
//     const durationtime: number = animActions[animIdx].getClip().duration
//     const currenttime: number = animActions[animIdx].time
//     if (currenttime / durationtime > 0.9/*90%を超えたら次のモーションへ*/) {
//       const index: number = (animIdx + 1) % (animCrips.length)
//       console.log('index=', index)
//       setAnimIdx(index)
//     }
//   });

//   return (
//     <primitive
//       object={gltf.scene}
//       position={[0, 1, 1]}
//       rotation={rotation}
//       scale={0.7}
//       castShadow={true}
//       receiveShadow={true}
//     >
//       <icosahedronGeometry args={[1, 1]} />
//     </primitive>
//   )
// }

const VRMAsset: FC = () => {
  const gltf = useLoader(GLTFLoader, 'models/anna_shirafuji.vrm', (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser as any) as any as GLTFLoaderPlugin);
  });
  const [rotation, setRotation] = useState<number[]>([0, 0, 0]);
  const [vrm, setVRM] = useState<VRM | null>(null);
  const [mixer, setMixer] = useState<AnimationMixer | null>(null);

  useEffect(() => {
    if (gltf) {
      const vrm = gltf.userData.vrm as VRM;

      if (vrm) {
        setVRM(vrm);

        (async () => {
          const animation = await loadMixamoAnimation('/raw/sample2.fbx', vrm);

          const mixer = new AnimationMixer(vrm.scene);
          mixer.clipAction(animation).play();
          setMixer(mixer);
        })();

        // frustumCulledを切らないとメッシュが一部表示されない
        vrm.scene.traverse((obj: THREE.Object3D) => {
          obj.frustumCulled = false;
        });
        if (vrm.meta.metaVersion !== '1') {
          setRotation([0, (180 * Math.PI) / 180, 0]);
        }
      }
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }

    if (vrm) {
      vrm.update(delta);
    }
  })

  return (
    <primitive
      object={gltf.scene}
      position={[0, 1, 1]}
      rotation={rotation}
      scale={0.7}
      castShadow={true}
      receiveShadow={true}
    >
      <icosahedronGeometry args={[1, 1]} />
    </primitive>
  )
}