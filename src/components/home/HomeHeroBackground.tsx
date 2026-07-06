"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HomeHeroBackground.module.css";

const MODEL_PATH = "/models/attack_helicopter_concept.glb";

export function HomeHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [
        THREE,
        { GLTFLoader },
        { EffectComposer },
        { RenderPass },
        { UnrealBloomPass },
        { OutputPass },
      ] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/postprocessing/EffectComposer.js"),
        import("three/examples/jsm/postprocessing/RenderPass.js"),
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
        import("three/examples/jsm/postprocessing/OutputPass.js"),
      ]);

      if (cancelled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const SCRUB_EASE = REDUCED_MOTION ? 1 : 0.085;
      const BLOOM_STRENGTH = 0.6;
      const BLOOM_RADIUS = 0.4;
      const BLOOM_THRESHOLD = 0.85;
      const HUD_TINT: Record<string, number> = { HUD1: 0xffaa33, HUD2: 0xffaa33, HUD3: 0x66ffee };

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(4, 3, 6);

      const ambientFill = new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 0.4);
      scene.add(ambientFill);
      const key = new THREE.DirectionalLight(0xffffff, 0.6);
      key.position.set(5, 10, 7);
      scene.add(key);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera, undefined, undefined, 0));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(1, 1),
        BLOOM_STRENGTH,
        BLOOM_RADIUS,
        BLOOM_THRESHOLD
      );
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());

      async function recoverSpecGlossData(url: string) {
        const buf = await fetch(url).then((r) => r.arrayBuffer());
        const dv = new DataView(buf);
        let offset = 12;
        let json: any = null;
        let binChunk: ArrayBuffer | null = null;
        while (offset < buf.byteLength) {
          const chunkLength = dv.getUint32(offset, true);
          const chunkType = dv.getUint32(offset + 4, true);
          const chunkData = buf.slice(offset + 8, offset + 8 + chunkLength);
          if (chunkType === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(chunkData));
          else if (chunkType === 0x004e4942) binChunk = chunkData;
          offset += 8 + chunkLength;
        }

        async function decodeImageForTexture(texIndex: number) {
          const image = json.images[json.textures[texIndex].source];
          const bv = json.bufferViews[image.bufferView];
          const bytes = binChunk!.slice(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
          const blob = new Blob([bytes], { type: image.mimeType });
          return createImageBitmap(blob);
        }

        const byMaterialName: Record<string, any> = {};
        await Promise.all(
          (json.materials || []).map(async (mat: any) => {
            const specGloss = mat.extensions && mat.extensions.KHR_materials_pbrSpecularGlossiness;
            if (!specGloss) return;
            const entry: any = {
              diffuseFactor: specGloss.diffuseFactor || [1, 1, 1, 1],
              glossinessFactor: specGloss.glossinessFactor ?? 1,
            };
            if (specGloss.diffuseTexture) {
              entry.diffuseImage = await decodeImageForTexture(specGloss.diffuseTexture.index);
            }
            byMaterialName[mat.name] = entry;
          })
        );
        return byMaterialName;
      }

      function isWhiteStencil(image: ImageBitmap) {
        const c = document.createElement("canvas");
        c.width = image.width;
        c.height = image.height;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(image, 0, 0);
        const { data } = ctx.getImageData(0, 0, c.width, c.height);
        let opaqueSamples = 0;
        let nonWhiteOpaque = 0;
        for (let i = 0; i < data.length; i += 4 * 97) {
          if (data[i + 3] < 10) continue;
          opaqueSamples++;
          if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) nonWhiteOpaque++;
        }
        return opaqueSamples > 0 && nonWhiteOpaque / opaqueSamples < 0.05;
      }

      let mixer: any = null;
      let action: any = null;
      let clipDuration = 0;
      let currentTime = 0;
      let targetTime = 0;
      let model: any = null;
      let baseQuat: any = null;

      function recomputeScrollBounds() {
        return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      }

      function onScroll() {
        const scrollMax = recomputeScrollBounds();
        const progress = THREE.MathUtils.clamp(window.scrollY / scrollMax, 0, 1);
        if (clipDuration) targetTime = progress * clipDuration;
        if (model && baseQuat) {
          model.rotation.y = baseQuat + progress * Math.PI * 0.6;
        }
      }

      function onResize() {
        if (!canvas) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        onScroll();
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      onResize();

      function frameObjectToCamera(object: any) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
        camera.position.copy(new THREE.Vector3(size * 0.6, size * 0.35, size * 0.6));
        camera.lookAt(0, 0, 0);
        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();
      }

      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        MODEL_PATH,
        (gltf: any) => {
          if (cancelled) return;
          model = gltf.scene;
          scene.add(model);
          model.rotation.y = -Math.PI / 2;
          baseQuat = model.rotation.y;

          model.traverse((child: any) => {
            if (child.isMesh && child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat: any) => {
                const isEmissive = mat.emissive && (mat.emissiveMap || mat.emissive.getHex() !== 0x000000);
                if (!isEmissive) return;
                if (mat.name === "HUD1" || mat.name === "HUD2" || mat.name === "HUD3") return;
                mat.emissiveIntensity = Math.max(mat.emissiveIntensity ?? 1, 1.5);
              });
            }
          });

          const meshesByMaterialName: Record<string, any[]> = {};
          model.traverse((child: any) => {
            if (child.isMesh && child.material) {
              const name = child.material.name;
              (meshesByMaterialName[name] = meshesByMaterialName[name] || []).push(child);
            }
          });

          recoverSpecGlossData(MODEL_PATH).then((byMaterialName) => {
            if (cancelled) return;
            Object.entries(byMaterialName).forEach(([matName, data]: [string, any]) => {
              const meshes = meshesByMaterialName[matName];
              if (!meshes) return;

              if (data.diffuseImage && isWhiteStencil(data.diffuseImage)) {
                const tex = new THREE.Texture(data.diffuseImage);
                tex.needsUpdate = true;
                tex.colorSpace = THREE.NoColorSpace;
                const tint = HUD_TINT[matName] ?? 0xffaa33;
                meshes.forEach((mesh) => {
                  mesh.material = new THREE.MeshBasicMaterial({
                    color: tint,
                    alphaMap: tex,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    opacity: 0.55,
                  });
                });
                return;
              }

              let tex: any = null;
              if (data.diffuseImage) {
                tex = new THREE.Texture(data.diffuseImage);
                tex.needsUpdate = true;
                tex.colorSpace = THREE.SRGBColorSpace;
              }
              const [r, g, b] = data.diffuseFactor;
              meshes.forEach((mesh) => {
                const mat = mesh.material;
                if (tex) mat.map = tex;
                mat.color.setRGB(r, g, b);
                mat.metalness = 0;
                mat.roughness = 1 - data.glossinessFactor;
                mat.needsUpdate = true;
              });
            });
          });

          frameObjectToCamera(model);

          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            const clip = gltf.animations[0];
            clipDuration = clip.duration;
            action = mixer.clipAction(clip);
            action.play();
            action.paused = true;
            action.time = 0;
          }

          onScroll();
          setReady(true);
        },
        undefined,
        (err: unknown) => {
          console.error("Failed to load helicopter model:", err);
        }
      );

      let rafId = 0;
      function animate() {
        rafId = requestAnimationFrame(animate);
        if (action && clipDuration) {
          currentTime += (targetTime - currentTime) * SCRUB_EASE;
          action.time = THREE.MathUtils.clamp(currentTime, 0, Math.max(0, clipDuration - 0.001));
          mixer.update(0);
        }
        composer.render();
      }
      animate();

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        composer.dispose?.();
        scene.traverse((child: any) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((m: any) => m?.dispose?.());
          }
        });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className={styles.bg} aria-hidden="true">
      <canvas className={styles.canvas} ref={canvasRef} style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }} />
    </div>
  );
}
