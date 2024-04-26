import { FC, Suspense, startTransition, useEffect, useState } from "react"

import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { GLTFLoader, GLTFLoaderPlugin, MMDLoader } from 'three-stdlib';
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

import { loadMixamoAnimation } from "./loadMixamoAnimation";
import { fog } from "three/examples/jsm/nodes/fog/FogNode";

export const VrmStage: FC = () => {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 1.5, 2.5] }}
      >
        {/* <ambientLight intensity={Math.PI / 2} /> */}
        {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} castShadow={true} />
        {/* <directionalLight position={[1, 1, 1]} /> */}
        <VRMAsset />
        <ShadowMap />
        <gridHelper args={[20, 20, '#dedede', '#dedede']} />
      </Canvas>
    </Suspense>
  )
}

const ShadowMap: FC = () => {
  return (
    <fog attach="fog" args={['#dedede', 0.015, 100]} />
  );
}

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
          const animation = await loadMixamoAnimation('/raw/sample.fbx', vrm);

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
    >
      <meshStandardMaterial attach="material" />
    </primitive>
  )
}