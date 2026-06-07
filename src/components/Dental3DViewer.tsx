import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface Dental3DViewerProps {
  selectedTeeth: string[];
  onToggleTooth: (idx: string) => void;
}

const TOOTH_NUMBER_MAP: Record<string, string> = {
  teeth001: '1',  teeth002: '2',  teeth003: '3',  teeth004: '4',
  teeth005: '5',  teeth006: '6',  teeth007: '7',  teeth008: '8',
  teeth009: '9',  teeth010: '10', teeth011: '11', teeth012: '12',
  teeth013: '13', teeth014: '14', teeth015: '15', teeth016: '16',
  teeth017: '17', teeth018: '18', teeth019: '19', teeth020: '20',
  teeth021: '21', teeth022: '22', teeth023: '23', teeth024: '24',
  teeth025: '25', teeth026: '26', teeth027: '27',
};

// Pre-check once: is this object a tooth?
function isToothObject(name: string) {
  const n = name.toLowerCase();
  return !n.includes('mouth') && !n.includes('wet') && !n.includes('gum');
}

interface ToothLabel {
  name: string;
  x: number;
  y: number;
}

function TeethModel({
  selectedTeeth,
  onToggleTooth,
  onLabelsUpdate,
}: Dental3DViewerProps & { onLabelsUpdate: (labels: ToothLabel[]) => void }) {
  const { scene } = useGLTF("/models/teeth1.glb");
  const { camera, gl, size } = useThree();

  // Store original materials once, keyed by uuid
  const originalsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());

  // Pre-built highlight materials keyed by uuid (avoid re-cloning every render)
  const highlightRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());

  // Raycaster created once
  const raycasterRef = useRef(new THREE.Raycaster());

  // Track whether camera is moving — only update labels when it is
  const isDirtyRef = useRef(true);

  // ── Save originals + pre-build highlights once on load ──────────────────
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      if (originalsRef.current.has(mesh.uuid)) return;

      const cloneMat = (m: THREE.Material) => m.clone();

      const original = Array.isArray(mesh.material)
        ? mesh.material.map(cloneMat)
        : cloneMat(mesh.material);

      originalsRef.current.set(mesh.uuid, original);

      // Pre-build highlight variant
      const makeHighlight = (m: THREE.Material) => {
        const h = m.clone() as THREE.MeshStandardMaterial;
        h.emissive = new THREE.Color("#FFD700");
        h.emissiveIntensity = 0.7;
        return h;
      };

      const highlight = Array.isArray(original)
        ? original.map(makeHighlight)
        : makeHighlight(original as THREE.Material);

      highlightRef.current.set(mesh.uuid, highlight);
    });
  }, [scene]);

  // ── Apply highlights only when selectedTeeth changes ─────────────────────
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      const objName = obj.name;
      const parentName = obj.parent?.name || "";

      // Skip non-teeth
      if (!isToothObject(objName) || !isToothObject(parentName)) {
        const original = originalsRef.current.get(mesh.uuid);
        if (original) {
          mesh.material = Array.isArray(original)
            ? original // no need to clone — not mutated
            : original;
        }
        return;
      }

      const isSelected =
        selectedTeeth.includes(objName) || selectedTeeth.includes(parentName);

      const original = originalsRef.current.get(mesh.uuid);
      const highlight = highlightRef.current.get(mesh.uuid);
      if (!original || !highlight) return;

      // Just swap the pre-built reference — zero cloning
      mesh.material = isSelected ? highlight : original;
    });
  }, [scene, selectedTeeth]);

  // ── Update labels only when camera moves (useFrame + dirty flag) ─────────
  useFrame(() => {
    if (!isDirtyRef.current) return;
    isDirtyRef.current = false;

    const labels: ToothLabel[] = [];
    const projected = new THREE.Vector3();

    scene.traverse((obj) => {
      if (!TOOTH_NUMBER_MAP[obj.name]) return;

      obj.getWorldPosition(projected);
      projected.project(camera);

      if (projected.z >= 1) return; // behind camera

      labels.push({
        name: obj.name,
        x: (projected.x * 0.5 + 0.5) * size.width,
        y: (-projected.y * 0.5 + 0.5) * size.height,
      });
    });

    onLabelsUpdate(labels);
  });

  // ── Mark dirty when OrbitControls moves ──────────────────────────────────
  useEffect(() => {
    const markDirty = () => { isDirtyRef.current = true; };
    gl.domElement.addEventListener("mousemove", markDirty);
    gl.domElement.addEventListener("touchmove", markDirty);
    // Also mark dirty once on mount so initial labels render
    isDirtyRef.current = true;
    return () => {
      gl.domElement.removeEventListener("mousemove", markDirty);
      gl.domElement.removeEventListener("touchmove", markDirty);
    };
  }, [gl]);

  // ── Click / raycast ───────────────────────────────────────────────────────
  const handleClick = useCallback((event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycasterRef.current.setFromCamera(mouse, camera);
    const intersects = raycasterRef.current.intersectObjects(scene.children, true);

    if (intersects.length === 0) return;

    let obj: THREE.Object3D | null = intersects[0].object;
    while (obj?.parent && obj.parent !== scene) obj = obj.parent;

    if (!obj?.name || !isToothObject(obj.name)) return;
    onToggleTooth(obj.name);
  }, [scene, camera, gl, onToggleTooth]);

  useEffect(() => {
    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [gl, handleClick]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
        }
      });
      originalsRef.current.forEach((mat) => {
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else mat.dispose();
      });
      highlightRef.current.forEach((mat) => {
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else mat.dispose();
      });
    };
  }, [scene]);

  return <primitive object={scene} />;
}

// Preload outside component so it starts before mount
useGLTF.preload("/models/teeth1.glb");

export default function Dental3DViewer({ selectedTeeth, onToggleTooth }: Dental3DViewerProps) {
  const [toothLabels, setToothLabels] = useState<ToothLabel[]>([]);

  // Stable callback — won't cause TeethModel re-render
  const handleLabelsUpdate = useCallback((labels: ToothLabel[]) => {
    setToothLabels(labels);
  }, []);

  return (
    <div style={{ width: "100%", height: "400px", marginTop: "-100px", position: "relative" }}>
      {/* frameloop="demand" — only renders when invalidated (OrbitControls does this automatically) */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 13 }}
        gl={{ antialias: true }}
        frameloop="demand"
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 0.5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <TeethModel
            selectedTeeth={selectedTeeth}
            onToggleTooth={onToggleTooth}
            onLabelsUpdate={handleLabelsUpdate}
          />
        </Suspense>
        {/* makeDefault tells R3F to invalidate the frame on camera move — works with frameloop="demand" */}
        <OrbitControls enablePan={false} makeDefault />
      </Canvas>

      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {toothLabels.map((label) => {
          const isSelected = selectedTeeth.includes(label.name);
          const num = TOOTH_NUMBER_MAP[label.name] || '';
          if (!num) return null;
          return (
            <div
              key={label.name}
              style={{
                position: "absolute",
                left: label.x,
                top: label.y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              <div style={{
                background: isSelected ? "#FFD700" : "rgba(0,0,0,0.65)",
                color: isSelected ? "#000" : "#fff",
                fontSize: "9px",
                fontWeight: "bold",
                fontFamily: "monospace",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: isSelected ? "1.5px solid #b8860b" : "1px solid rgba(255,255,255,0.3)",
                boxShadow: isSelected ? "0 0 6px #FFD70088" : "none",
                transition: "all 0.2s",
              }}>
                {num}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}