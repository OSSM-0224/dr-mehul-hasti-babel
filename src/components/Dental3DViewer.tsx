import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

interface Dental3DViewerProps {
  selectedTeeth: string[];
  onToggleTooth: (idx: string) => void;
}

function TeethModel({ selectedTeeth, onToggleTooth }: Dental3DViewerProps) {
  const { scene } = useGLTF("/models/teeth1.glb");
  const { camera, gl } = useThree();
  const materialsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(
    new Map(),
  );

  // Save original materials ONCE on load
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && !materialsRef.current.has(mesh.uuid)) {
        // Deep clone — preserve textures
        if (Array.isArray(mesh.material)) {
          materialsRef.current.set(
            mesh.uuid,
            mesh.material.map((m) => m.clone()),
          );
        } else {
          materialsRef.current.set(mesh.uuid, mesh.material.clone());
        }
      }
    });
  }, [scene]);

  // Raycasting — click handler
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Ignore if user was dragging (rotating model)
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
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

        // Skip mouth/wet/gum
        const name = obj.name.toLowerCase();
        if (
          name.includes("mouth") ||
          name.includes("wet") ||
          name.includes("gum")
        )
          return;

        console.log("Tooth clicked:", obj.name);
        onToggleTooth(obj.name);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [scene, camera, gl, onToggleTooth]);

  // Highlight selected teeth — restore original for unselected
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      const original = materialsRef.current.get(mesh.uuid);
      if (!original) return;

      const parentName = (obj.parent?.name || "").toLowerCase();
      const objName = obj.name.toLowerCase();

      // Skip mouth/gum/wet
      if (
        objName.includes("mouth") ||
        objName.includes("wet") ||
        objName.includes("gum") ||
        parentName.includes("mouth") ||
        parentName.includes("wet") ||
        parentName.includes("gum")
      ) {
        // Always restore original
        mesh.material = Array.isArray(original)
          ? original.map((m) => m.clone())
          : original.clone();
        return;
      }

      const isSelected =
        selectedTeeth.includes(obj.name) ||
        selectedTeeth.includes(obj.parent?.name || "");

      if (isSelected) {
        // Clone original (keeps texture) then add gold emissive glow
        const mat = Array.isArray(original)
          ? original.map((m) => {
              const c = m.clone() as THREE.MeshStandardMaterial;
              c.color = new THREE.Color("#FFD700"); // Gold shade
              c.emissive = new THREE.Color("#00E5FF"); // Neon cyan glow
              c.emissiveIntensity = 0.6;
              return c;
            })
          : (() => {
              const c = (original as THREE.MeshStandardMaterial).clone();
              c.color = new THREE.Color("#FFD700");
              c.emissive = new THREE.Color("#00E5FF");
              c.emissiveIntensity = 0.6;
              return c;
            })();
        mesh.material = mat;
      } else {
        // Restore clean original
        mesh.material = Array.isArray(original)
          ? original.map((m) => m.clone())
          : original.clone();
      }
    });
  }, [scene, selectedTeeth]);

  return <primitive object={scene} />;
}

export default function Dental3DViewer({
  selectedTeeth,
  onToggleTooth,
}: Dental3DViewerProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        marginTop: "-100px",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 13 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 0.5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <TeethModel
            selectedTeeth={selectedTeeth}
            onToggleTooth={onToggleTooth}
          />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
