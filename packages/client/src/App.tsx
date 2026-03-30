import { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color4, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.08, 0.08, 0.15, 1);

    // Camera — fixed angle with pan/zoom, not free-fly
    const camera = new ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3, 15, Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 25;
    camera.lowerBetaLimit = 0.5;
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(canvas, true);

    // Warm office lighting
    const light = new HemisphericLight('light', new Vector3(0.5, 1, 0.3), scene);
    light.intensity = 0.9;
    light.diffuse = new Color3(1, 0.95, 0.85);
    light.groundColor = new Color3(0.2, 0.2, 0.3);

    // Placeholder floor
    const floor = MeshBuilder.CreateBox('floor', { width: 10, height: 0.1, depth: 10 }, scene);
    const floorMat = new StandardMaterial('floorMat', scene);
    floorMat.diffuseColor = new Color3(0.35, 0.3, 0.25);
    floor.material = floorMat;
    floor.position.y = -0.05;

    // Placeholder desk
    const desk = MeshBuilder.CreateBox('desk', { width: 2.5, height: 0.8, depth: 1.2 }, scene);
    const deskMat = new StandardMaterial('deskMat', scene);
    deskMat.diffuseColor = new Color3(0.45, 0.3, 0.15);
    desk.material = deskMat;
    desk.position.y = 0.4;
    desk.position.z = -2;

    // Placeholder chair
    const chair = MeshBuilder.CreateBox('chair', { width: 0.8, height: 1.2, depth: 0.8 }, scene);
    const chairMat = new StandardMaterial('chairMat', scene);
    chairMat.diffuseColor = new Color3(0.2, 0.2, 0.25);
    chair.material = chairMat;
    chair.position.y = 0.6;
    chair.position.z = -3.2;

    // Walls
    const backWall = MeshBuilder.CreateBox('backWall', { width: 10, height: 4, depth: 0.15 }, scene);
    const wallMat = new StandardMaterial('wallMat', scene);
    wallMat.diffuseColor = new Color3(0.85, 0.82, 0.75);
    backWall.material = wallMat;
    backWall.position.y = 2;
    backWall.position.z = 5;

    const leftWall = MeshBuilder.CreateBox('leftWall', { width: 0.15, height: 4, depth: 10 }, scene);
    leftWall.material = wallMat;
    leftWall.position.y = 2;
    leftWall.position.x = -5;

    engine.runRenderLoop(() => scene.render());

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        padding: '16px 24px',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>AI Company Simulator</h1>
        <p style={{ fontSize: 13, opacity: 0.7 }}>CEO Suite — Phase 1 Foundation</p>
      </div>
    </div>
  );
}
