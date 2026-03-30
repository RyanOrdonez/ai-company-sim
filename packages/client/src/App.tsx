import { useEffect, useRef } from 'react';
import { Engine } from '@babylonjs/core';
import { createCEOSuite } from './scenes/ceo-suite';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    const scene = createCEOSuite(engine, canvas);

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
