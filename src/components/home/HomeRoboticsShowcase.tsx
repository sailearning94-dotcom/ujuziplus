"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./HomeRoboticsShowcase.module.css";

const MODEL_PATH = "/models/attack_helicopter_concept.glb";

export function HomeRoboticsShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);
  const loaderPctRef = useRef<HTMLDivElement>(null);
  const loaderErrorRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const scrubFillRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const railMarkerRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const viewportTagRef = useRef<HTMLSpanElement>(null);
  const clipLabelRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);

  // Only boot the (heavy) three.js scene once the section actually scrolls into view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [
        THREE,
        { GLTFLoader },
        { OrbitControls },
        { EffectComposer },
        { RenderPass },
        { UnrealBloomPass },
        { OutputPass },
      ] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("three/examples/jsm/postprocessing/EffectComposer.js"),
        import("three/examples/jsm/postprocessing/RenderPass.js"),
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
        import("three/examples/jsm/postprocessing/OutputPass.js"),
      ]);

      if (cancelled) return;

      const canvas = canvasRef.current;
      const stage = stageRef.current;
      if (!canvas || !stage) return;

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

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x05080b);

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(4, 3, 6);

      const ambientFill = new THREE.HemisphereLight(0xffffff, 0x2a2a2a, 0.4);
      scene.add(ambientFill);
      const key = new THREE.DirectionalLight(0xffffff, 0.6);
      key.position.set(5, 10, 7);
      scene.add(key);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = Math.PI * 0.15;
      controls.maxPolarAngle = Math.PI * 0.85;
      controls.rotateSpeed = 0.6;
      controls.target.set(0, 0, 0);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
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
      let scrollMax = 1;

      function formatTC(t: number) {
        const m = Math.floor(t / 60).toString().padStart(2, "0");
        const s = Math.floor(t % 60).toString().padStart(2, "0");
        return m + ":" + s;
      }

      function frameObjectToCamera(object: any) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        controls.target.copy(center);
        camera.position.copy(center).add(new THREE.Vector3(size * 0.6, size * 0.4, size * 0.6));
        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();
        controls.update();
      }

      function recomputeScrollBounds() {
        if (!stage) return;
        scrollMax = Math.max(1, stage.offsetHeight - window.innerHeight);
      }

      function onScroll() {
        if (!stage) return;
        const stageTop = stage.offsetTop;
        const raw = (window.scrollY - stageTop) / scrollMax;
        const progress = THREE.MathUtils.clamp(raw, 0, 1);
        if (clipDuration) targetTime = progress * clipDuration;

        if (scrubFillRef.current) scrubFillRef.current.style.width = (progress * 100).toFixed(1) + "%";
        if (railFillRef.current) railFillRef.current.style.height = (progress * 100).toFixed(1) + "%";
        if (railMarkerRef.current) railMarkerRef.current.style.bottom = (progress * 100).toFixed(1) + "%";
        if (scrollCueRef.current) scrollCueRef.current.style.opacity = progress > 0.03 ? "0" : "1";
      }

      function onResize() {
        const viewport = viewportRef.current;
        if (!viewport || !canvas) return;
        const w = viewport.clientWidth;
        const h = viewport.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        if (viewportTagRef.current) viewportTagRef.current.textContent = w + " × " + h;
        recomputeScrollBounds();
        onScroll();
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      onResize();

      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        MODEL_PATH,
        (gltf: any) => {
          if (cancelled) return;
          const model = gltf.scene;
          scene.add(model);

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
                    opacity: 0.65,
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
            if (clipLabelRef.current) {
              clipLabelRef.current.textContent = "SEQ // " + clip.name.slice(0, 18).toUpperCase();
            }
          } else if (clipLabelRef.current) {
            clipLabelRef.current.textContent = "NO SEQUENCE FOUND";
          }

          recomputeScrollBounds();
          onScroll();
          loaderRef.current?.classList.add(styles.hidden);
        },
        (xhr: ProgressEvent) => {
          if (xhr.total) {
            const pct = Math.min(100, Math.round((xhr.loaded / xhr.total) * 100));
            if (loaderBarRef.current) loaderBarRef.current.style.width = pct + "%";
            if (loaderPctRef.current) loaderPctRef.current.textContent = pct + "%";
          }
        },
        (err: unknown) => {
          console.error("Failed to load helicopter model:", err);
          if (loaderErrorRef.current) {
            loaderErrorRef.current.style.display = "block";
            loaderErrorRef.current.textContent = "Could not load the 3D model. Please refresh the page.";
          }
        }
      );

      const panels = contentRef.current?.querySelectorAll("[data-panel]") ?? [];
      const panelIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add(styles.visible);
          });
        },
        { threshold: 0.25 }
      );
      panels.forEach((p) => panelIo.observe(p));

      let rafId = 0;
      let frameCount = 0;
      let fpsAccum = 0;
      let lastFpsUpdate = performance.now();

      function animate() {
        rafId = requestAnimationFrame(animate);
        const now = performance.now();

        if (action && clipDuration) {
          currentTime += (targetTime - currentTime) * SCRUB_EASE;
          action.time = THREE.MathUtils.clamp(currentTime, 0, Math.max(0, clipDuration - 0.001));
          mixer.update(0);
          if (tcRef.current) tcRef.current.textContent = formatTC(action.time) + " / " + formatTC(clipDuration);
        }

        controls.update();
        composer.render();

        frameCount++;
        if (now - lastFpsUpdate > 500) {
          fpsAccum = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
          if (fpsRef.current) fpsRef.current.textContent = fpsAccum + " fps";
          frameCount = 0;
          lastFpsUpdate = now;
        }
      }
      animate();

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        panelIo.disconnect();
        controls.dispose();
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
  }, [inView]);

  return (
    <div className={styles.showcase} ref={stageRef} style={{ height: "500vh" }}>
      <div ref={viewportRef} style={{ position: "sticky", top: 0, height: "100vh" }}>
        <canvas className={styles.canvas} ref={canvasRef} />
        <div className={styles.gridOverlay} />

        <div className={styles.hud}>
          <div className={`${styles.corner} ${styles.tl}`} />
          <div className={`${styles.corner} ${styles.tr}`} />
          <div className={`${styles.corner} ${styles.bl}`} />
          <div className={`${styles.corner} ${styles.br}`} />

          <div className={`${styles.hudLabel} ${styles.tagDesignation}`}>
            Build&nbsp;<span className={styles.accent}>Robotics-07</span> // Learner Showcase
          </div>
          <div className={`${styles.hudLabel} ${styles.tagStatus}`}>
            <span><span className={styles.statusDot} />Render&nbsp;Active</span>
            <span ref={viewportTagRef}>&mdash;</span>
          </div>

          <div className={styles.telemetry}>
            <span className={styles.tc} ref={tcRef}>00:00 / 00:00</span>
            <div className={styles.scrubTrack}>
              <div className={styles.scrubFill} ref={scrubFillRef} />
            </div>
            <span className={styles.clipLabel} ref={clipLabelRef}>SEQ</span>
          </div>

          <div className={styles.rail}>
            <div className={styles.railFill} ref={railFillRef} />
            <div className={styles.railMarker} ref={railMarkerRef} />
          </div>

          <div className={styles.scrollCue} ref={scrollCueRef}>
            Scroll to run sequence
            <span className={styles.chev} />
          </div>
        </div>

        <div className={`${styles.loader} ${!inView ? "" : ""}`} ref={loaderRef}>
          <div className={styles.loaderMark}>Loading Concept Model</div>
          <div className={styles.loaderBarTrack}><div className={styles.loaderBarFill} ref={loaderBarRef} /></div>
          <div className={styles.loaderPct} ref={loaderPctRef}>0%</div>
          <div className={styles.loaderError} ref={loaderErrorRef} />
        </div>
      </div>

      <div className={styles.content} ref={contentRef} style={{ marginTop: "-100vh" }}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>Design study / built with our robotics track</div>
          <h2 className={styles.title}>
            From Coursework <em>to Concept Craft</em>
          </h2>
          <p className={styles.heroSub}>
            A rendered engineering study exploring a shrouded coaxial rotor and an
            integrated holographic display layer &mdash; the kind of 3D design and
            CAD-to-render pipeline learners build toward in our Robotics & Aerospace
            Engineering track. Scroll to run the sequence, drag to inspect the
            airframe from any angle.
          </p>
          <div className={styles.heroControls}>
            <span><b>Scroll</b> &mdash; play sequence</span>
            <span><b>Drag</b> &mdash; rotate view</span>
          </div>
        </section>

        <section className={`${styles.section} ${styles.alignLeft}`}>
          <div className={styles.panel} data-panel>
            <div className={styles.fileTag}><span>File 01 / 04</span><span className={styles.accent}>Overview</span></div>
            <h3>Shrouded rotor system</h3>
            <p>
              This concept replaces an exposed main rotor with a ducted ring,
              reducing blade signature while keeping a familiar rotary-wing
              silhouette &mdash; the same systems-thinking approach we teach across
              our engineering design courses.
            </p>
            <p>
              Every surface on the model was built to read clearly at a glance:
              a design study built by student engineers, not a production spec.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.alignRight}`}>
          <div className={styles.panel} data-panel>
            <div className={styles.fileTag}><span>File 02 / 04</span><span className={styles.accent}>Airframe</span></div>
            <h3>Angular low-profile hull</h3>
            <p>
              The fuselage trades curvature for faceted plating, a hull language
              learners explore in our CAD and 3D-modeling modules. The cockpit sits
              low and forward, tucked beneath the rotor shroud.
            </p>
            <div className={styles.specRow}><span>Rotor type</span><span>Shrouded coaxial</span></div>
            <div className={styles.specRow}><span>Hull language</span><span>Faceted / low-profile</span></div>
            <div className={styles.specRow}><span>Format</span><span>glTF Binary (.glb)</span></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.alignLeft}`}>
          <div className={styles.panel} data-panel>
            <div className={styles.fileTag}><span>File 03 / 04</span><span className={styles.accent}>Systems</span></div>
            <h3>Integrated HUD overlay</h3>
            <p>
              Amber flight-reference lines and cyan targeting brackets are baked
              directly into the model's materials &mdash; the same graphic language
              this showcase borrows for its own interface, tying the viewer to the
              object it's presenting.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.closing}`}>
          <div className={styles.panel} data-panel>
            <div className={styles.fileTag}><span>File 04 / 04</span><span className={styles.accent}>Sequence</span></div>
            <h3>Build something like this</h3>
            <p>
              That's the full animation, scrubbed across the page. This model was
              rendered using the same 3D and engineering-design skills taught in
              our Robotics track &mdash; scroll back up to replay it, or explore the
              courses that get you here.
            </p>
            <p>
              <Link href="/courses" style={{ color: "var(--sc-cyan)" }}>
                Browse robotics &amp; engineering courses &rarr;
              </Link>
            </p>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <span>Robotics-07 &mdash; concept render, viewer built with three.js</span>
        <span ref={fpsRef}>&mdash;</span>
      </footer>
    </div>
  );
}
