import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Dental3DViewerProps {
  selectedTeeth: string[];
  onToggleTooth: (idx: string) => void;
}

// Tooth name → display number mapping
const TOOTH_NUMBER_MAP: Record<string, string> = {
  teeth001: '1',  teeth002: '2',  teeth003: '3',  teeth004: '4',
  teeth005: '5',  teeth006: '6',  teeth007: '7',  teeth008: '8',
  teeth009: '9',  teeth010: '10', teeth011: '11', teeth012: '12',
  teeth013: '13', teeth014: '14', teeth015: '15', teeth016: '16',
  teeth017: '17', teeth018: '18', teeth019: '19', teeth020: '20',
  teeth021: '21', teeth022: '22', teeth023: '23', teeth024: '24',
  teeth025: '25', teeth026: '26', teeth027: '27',
};

interface ToothLabel {
  name: string
  x: number
  y: number
}

function TeethModel({ selectedTeeth, onToggleTooth, onLabelsUpdate }: Dental3DViewerProps & {
  onLabelsUpdate: (labels: ToothLabel[]) => void
}) {
  const { scene } = useGLTF("/models/teeth1.glb");
  const { camera, gl, size } = useThree();
  const materialsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());
  const frameRef = useRef<number>(0);

  // Save original materials ONCE
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && !materialsRef.current.has(mesh.uuid)) {
        if (Array.isArray(mesh.material)) {
          materialsRef.current.set(mesh.uuid, mesh.material.map(m => m.clone()));
        } else {
          materialsRef.current.set(mesh.uuid, mesh.material.clone());
        }
      }
    });
  }, [scene]);

  // Update label positions every frame (follows camera rotation)
  useEffect(() => {
    const updateLabels = () => {
      const labels: ToothLabel[] = [];

      scene.traverse((obj) => {
        if (!obj.name) return;
        const name = obj.name.toLowerCase();
        if (name.includes('mouth') || name.includes('wet') || name.includes('gum')) return;
        if (!TOOTH_NUMBER_MAP[obj.name] && !TOOTH_NUMBER_MAP[obj.name?.toLowerCase()]) return;

        // Get world position of tooth center
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);

        // Project 3D → 2D screen coords
        const projected = worldPos.clone().project(camera);
        const x = (projected.x * 0.5 + 0.5) * size.width;
        const y = (-projected.y * 0.5 + 0.5) * size.height;

        // Only show if in front of camera
        if (projected.z < 1) {
          labels.push({ name: obj.name, x, y });
        }
      });

      onLabelsUpdate(labels);
      frameRef.current = requestAnimationFrame(updateLabels);
    };

    frameRef.current = requestAnimationFrame(updateLabels);
    return () => cancelAnimationFrame(frameRef.current);
  }, [scene, camera, size, onLabelsUpdate]);

  // Raycasting click handler
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj?.parent && obj.parent !== scene) {
          obj = obj.parent;
        }
        if (!obj?.name) return;
        const name = obj.name.toLowerCase();
        if (name.includes('mouth') || name.includes('wet') || name.includes('gum')) return;
        onToggleTooth(obj.name);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [scene, camera, gl, onToggleTooth]);

  // Highlight selected teeth
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const original = materialsRef.current.get(mesh.uuid);
      if (!original) return;

      const parentName = (obj.parent?.name || "").toLowerCase();
      const objName = obj.name.toLowerCase();

      if (
        objName.includes("mouth") || objName.includes("wet") || objName.includes("gum") ||
        parentName.includes("mouth") || parentName.includes("wet") || parentName.includes("gum")
      ) {
        mesh.material = Array.isArray(original) ? original.map(m => m.clone()) : original.clone();
        return;
      }

      const isSelected =
        selectedTeeth.includes(obj.name) ||
        selectedTeeth.includes(obj.parent?.name || "");

      if (isSelected) {
        const applyHighlight = (m: THREE.Material) => {
          const c = m.clone() as THREE.MeshStandardMaterial;
          c.emissive = new THREE.Color("#FFD700");
          c.emissiveIntensity = 0.7;
          return c;
        };
        mesh.material = Array.isArray(original)
          ? original.map(applyHighlight)
          : applyHighlight(original as THREE.Material);
      } else {
        mesh.material = Array.isArray(original)
          ? original.map(m => m.clone())
          : original.clone();
      }
    });
  }, [scene, selectedTeeth]);

  return <primitive object={scene} />;
}

export default function Dental3DViewer({ selectedTeeth, onToggleTooth }: Dental3DViewerProps) {
  const [toothLabels, setToothLabels] = useState<ToothLabel[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "400px", marginTop: "-100px", position: "relative" }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 13 }} gl={{ antialias: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 0.5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <TeethModel
            selectedTeeth={selectedTeeth}
            onToggleTooth={onToggleTooth}
            onLabelsUpdate={setToothLabels}
          />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>

      {/* HTML Number Labels — float over canvas */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {toothLabels.map((label) => {
          const isSelected = selectedTeeth.includes(label.name);
          const num = TOOTH_NUMBER_MAP[label.name] || TOOTH_NUMBER_MAP[label.name?.toLowerCase()] || '';
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