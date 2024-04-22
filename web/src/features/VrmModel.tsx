import { FC, startTransition, useEffect, useState } from "react"

import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { GLTFLoader, GLTFLoaderPlugin, MMDLoader } from 'three-stdlib';
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { useFrame, useLoader } from "@react-three/fiber";

import { loadMixamoAnimation } from "./loadMixamoAnimation";

export const VrmModel: FC = () => {
  const gltf = useLoader(GLTFLoader, './models/AliciaSolid.vrm', (loader) => {
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
          console.log('mixer', mixer);
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
      position={[0.5, 0, 0]}
      rotation={rotation}
      scale={1}
      castShadow={true}
    />
  )
}