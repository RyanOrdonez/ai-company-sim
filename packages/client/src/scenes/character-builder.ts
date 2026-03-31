import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
  Vector3,
  Space,
  Axis,
} from '@babylonjs/core';
import type { AvatarConfig, HairStyle, Accessory } from '../types/avatar';

/**
 * Builds a cartoon-style character with big head, expressive face, and
 * proper seated pose. Proportions inspired by 2D office character art.
 * Returns a root mesh that can be positioned/rotated as a unit.
 */
export function buildCharacter(scene: Scene, config: AvatarConfig, prefix: string, seated = false): Mesh {
  const root = new Mesh(`${prefix}_root`, scene);

  const skin = Color3.FromHexString(config.skinTone);
  const hair = Color3.FromHexString(config.hairColor);
  const suit = Color3.FromHexString(config.outfitColor);
  const shirt = new Color3(0.92, 0.9, 0.86);
  const pants = suit.scale(0.7);
  const shoes = new Color3(0.12, 0.12, 0.14);
  const tieC = getTieColor(suit);

  // ── Head (BIG — cartoon style) ────────────────────────────────────
  const headY = seated ? 1.42 : 1.55;

  const head = MeshBuilder.CreateSphere(`${prefix}_head`, { diameter: 0.48, segments: 10 }, scene);
  head.material = cMat(`${prefix}_headM`, skin, scene);
  head.position.set(0, headY, 0);
  head.scaling = new Vector3(1, 1.05, 0.95);
  head.parent = root;

  // Ears
  for (const s of [-1, 1]) {
    const ear = MeshBuilder.CreateSphere(`${prefix}_ear${s}`, { diameter: 0.1, segments: 6 }, scene);
    ear.material = cMat(`${prefix}_earM${s}`, skin, scene);
    ear.position.set(s * 0.23, headY - 0.02, 0);
    ear.scaling = new Vector3(0.4, 0.7, 0.6);
    ear.parent = root;
  }

  // ── Face ──────────────────────────────────────────────────────────
  // Big expressive eyes
  for (const s of [-1, 1]) {
    // Eye white — large and round
    const eyeW = MeshBuilder.CreateSphere(`${prefix}_eyeW${s}`, { diameter: 0.1, segments: 8 }, scene);
    eyeW.material = cMat(`${prefix}_eyeWM${s}`, new Color3(0.97, 0.97, 0.97), scene);
    eyeW.position.set(s * 0.09, headY + 0.02, 0.2);
    eyeW.scaling = new Vector3(1, 1.1, 0.5);
    eyeW.parent = root;

    // Iris
    const iris = MeshBuilder.CreateSphere(`${prefix}_iris${s}`, { diameter: 0.055, segments: 6 }, scene);
    iris.material = cMat(`${prefix}_irisM${s}`, new Color3(0.3, 0.22, 0.15), scene);
    iris.position.set(s * 0.09, headY + 0.02, 0.225);
    iris.scaling = new Vector3(1, 1.1, 0.5);
    iris.parent = root;

    // Pupil
    const pupil = MeshBuilder.CreateSphere(`${prefix}_pupil${s}`, { diameter: 0.03, segments: 6 }, scene);
    pupil.material = cMat(`${prefix}_pupilM${s}`, new Color3(0.05, 0.05, 0.08), scene);
    pupil.position.set(s * 0.09, headY + 0.02, 0.235);
    pupil.parent = root;

    // Eye highlight (white dot)
    const highlight = MeshBuilder.CreateSphere(`${prefix}_eyeH${s}`, { diameter: 0.015, segments: 4 }, scene);
    highlight.material = cMat(`${prefix}_eyeHM${s}`, new Color3(1, 1, 1), scene);
    highlight.position.set(s * 0.09 + 0.015, headY + 0.035, 0.24);
    highlight.parent = root;

    // Eyebrow
    const brow = MeshBuilder.CreateBox(`${prefix}_brow${s}`, { width: 0.09, height: 0.018, depth: 0.02 }, scene);
    brow.material = cMat(`${prefix}_browM${s}`, hair.scale(0.8), scene);
    brow.position.set(s * 0.09, headY + 0.1, 0.2);
    brow.rotation.z = s * -0.15; // slightly angled
    brow.parent = root;
  }

  // Nose — small and subtle
  const nose = MeshBuilder.CreateSphere(`${prefix}_nose`, { diameter: 0.04, segments: 4 }, scene);
  nose.material = cMat(`${prefix}_noseM`, skin.scale(0.92), scene);
  nose.position.set(0, headY - 0.04, 0.23);
  nose.parent = root;

  // Mouth — friendly smile curve (two angled boxes)
  const mouthL = MeshBuilder.CreateBox(`${prefix}_mouthL`, { width: 0.06, height: 0.015, depth: 0.012 }, scene);
  mouthL.material = cMat(`${prefix}_mouthLM`, new Color3(0.7, 0.35, 0.3), scene);
  mouthL.position.set(-0.025, headY - 0.1, 0.22);
  mouthL.rotation.z = 0.2;
  mouthL.parent = root;

  const mouthR = MeshBuilder.CreateBox(`${prefix}_mouthR`, { width: 0.06, height: 0.015, depth: 0.012 }, scene);
  mouthR.material = mouthL.material;
  mouthR.position.set(0.025, headY - 0.1, 0.22);
  mouthR.rotation.z = -0.2;
  mouthR.parent = root;

  // ── Hair ──────────────────────────────────────────────────────────
  buildHair(scene, root, config.hairStyle, hair, headY, prefix);

  // ── Neck ──────────────────────────────────────────────────────────
  const neckY = seated ? 1.12 : 1.25;
  const neck = MeshBuilder.CreateCylinder(`${prefix}_neck`, {
    height: 0.1, diameter: 0.12, tessellation: 8,
  }, scene);
  neck.material = cMat(`${prefix}_neckM`, skin, scene);
  neck.position.y = neckY;
  neck.parent = root;

  // ── Torso / Jacket ────────────────────────────────────────────────
  const torsoY = seated ? 0.88 : 1.0;

  // Shirt (visible under jacket)
  const shirtMesh = MeshBuilder.CreateCylinder(`${prefix}_shirt`, {
    height: 0.42, diameterTop: 0.32, diameterBottom: 0.28, tessellation: 8,
  }, scene);
  shirtMesh.material = cMat(`${prefix}_shirtM`, shirt, scene);
  shirtMesh.position.y = torsoY;
  shirtMesh.parent = root;

  // Jacket/suit — slightly wider, open front
  const jacket = MeshBuilder.CreateCylinder(`${prefix}_jacket`, {
    height: 0.44, diameterTop: 0.4, diameterBottom: 0.34, tessellation: 8,
  }, scene);
  jacket.material = cMat(`${prefix}_jacketM`, suit, scene);
  jacket.position.y = torsoY;
  jacket.parent = root;

  // Jacket lapel detail (V-shape)
  const lapelL = MeshBuilder.CreateBox(`${prefix}_lapelL`, { width: 0.04, height: 0.18, depth: 0.01 }, scene);
  lapelL.material = cMat(`${prefix}_lapelLM`, suit.scale(0.85), scene);
  lapelL.position.set(-0.06, torsoY + 0.06, 0.18);
  lapelL.rotation.z = 0.2;
  lapelL.parent = root;

  const lapelR = MeshBuilder.CreateBox(`${prefix}_lapelR`, { width: 0.04, height: 0.18, depth: 0.01 }, scene);
  lapelR.material = lapelL.material;
  lapelR.position.set(0.06, torsoY + 0.06, 0.18);
  lapelR.rotation.z = -0.2;
  lapelR.parent = root;

  // Tie
  const tieKnot = MeshBuilder.CreateSphere(`${prefix}_tieKnot`, { diameter: 0.04, segments: 4 }, scene);
  tieKnot.material = cMat(`${prefix}_tieKnotM`, tieC, scene);
  tieKnot.position.set(0, neckY - 0.06, 0.16);
  tieKnot.parent = root;

  const tieBody = MeshBuilder.CreateBox(`${prefix}_tieBody`, { width: 0.05, height: 0.2, depth: 0.012 }, scene);
  tieBody.material = cMat(`${prefix}_tieBodM`, tieC, scene);
  tieBody.position.set(0, torsoY - 0.02, 0.17);
  tieBody.parent = root;

  const tieTip = MeshBuilder.CreateBox(`${prefix}_tieTip`, { width: 0.06, height: 0.04, depth: 0.012 }, scene);
  tieTip.material = cMat(`${prefix}_tieTipM`, tieC, scene);
  tieTip.position.set(0, torsoY - 0.14, 0.17);
  tieTip.parent = root;

  // ── Shoulders + Arms ──────────────────────────────────────────────
  for (const s of [-1, 1]) {
    // Shoulder cap
    const shoulderCap = MeshBuilder.CreateSphere(`${prefix}_sCap${s}`, { diameter: 0.16, segments: 6 }, scene);
    shoulderCap.material = cMat(`${prefix}_sCapM${s}`, suit, scene);
    shoulderCap.position.set(s * 0.22, torsoY + 0.18, 0);
    shoulderCap.parent = root;

    if (seated) {
      // Arms resting on desk — upper arm down, forearm forward
      const uArm = MeshBuilder.CreateCylinder(`${prefix}_uArm${s}`, {
        height: 0.25, diameter: 0.1, tessellation: 6,
      }, scene);
      uArm.material = cMat(`${prefix}_uArmM${s}`, suit, scene);
      uArm.position.set(s * 0.25, torsoY, 0);
      uArm.parent = root;

      // Forearm going forward (toward desk)
      const fArm = MeshBuilder.CreateCylinder(`${prefix}_fArm${s}`, {
        height: 0.25, diameterTop: 0.08, diameterBottom: 0.07, tessellation: 6,
      }, scene);
      fArm.material = cMat(`${prefix}_fArmM${s}`, suit, scene);
      fArm.position.set(s * 0.25, torsoY - 0.1, 0.15);
      fArm.rotate(Axis.X, Math.PI / 2.5, Space.LOCAL);
      fArm.parent = root;

      // Hand
      const hand = MeshBuilder.CreateSphere(`${prefix}_hand${s}`, { diameter: 0.09, segments: 6 }, scene);
      hand.material = cMat(`${prefix}_handM${s}`, skin, scene);
      hand.position.set(s * 0.25, torsoY - 0.12, 0.3);
      hand.parent = root;
    } else {
      // Standing — arms at sides
      const uArm = MeshBuilder.CreateCylinder(`${prefix}_uArm${s}`, {
        height: 0.3, diameter: 0.1, tessellation: 6,
      }, scene);
      uArm.material = cMat(`${prefix}_uArmM${s}`, suit, scene);
      uArm.position.set(s * 0.26, torsoY - 0.05, 0);
      uArm.rotation.z = s * 0.12;
      uArm.parent = root;

      const fArm = MeshBuilder.CreateCylinder(`${prefix}_fArm${s}`, {
        height: 0.25, diameterTop: 0.08, diameterBottom: 0.065, tessellation: 6,
      }, scene);
      fArm.material = cMat(`${prefix}_fArmM${s}`, suit, scene);
      fArm.position.set(s * 0.28, torsoY - 0.32, 0);
      fArm.rotation.z = s * 0.08;
      fArm.parent = root;

      const hand = MeshBuilder.CreateSphere(`${prefix}_hand${s}`, { diameter: 0.09, segments: 6 }, scene);
      hand.material = cMat(`${prefix}_handM${s}`, skin, scene);
      hand.position.set(s * 0.3, torsoY - 0.47, 0);
      hand.parent = root;
    }
  }

  // ── Belt ──────────────────────────────────────────────────────────
  const beltY = torsoY - 0.22;
  const belt = MeshBuilder.CreateCylinder(`${prefix}_belt`, {
    height: 0.04, diameter: 0.34, tessellation: 8,
  }, scene);
  belt.material = cMat(`${prefix}_beltM`, new Color3(0.18, 0.15, 0.1), scene);
  belt.position.y = beltY;
  belt.parent = root;

  // Belt buckle
  const buckle = MeshBuilder.CreateBox(`${prefix}_buckle`, { width: 0.05, height: 0.04, depth: 0.02 }, scene);
  buckle.material = cMat(`${prefix}_buckleM`, new Color3(0.65, 0.6, 0.4), scene);
  buckle.position.set(0, beltY, 0.16);
  buckle.parent = root;

  // ── Legs ──────────────────────────────────────────────────────────
  if (seated) {
    // Seated: thighs go forward, calves hang down
    for (const s of [-1, 1]) {
      // Thigh — horizontal, going forward
      const thigh = MeshBuilder.CreateCylinder(`${prefix}_thigh${s}`, {
        height: 0.35, diameterTop: 0.13, diameterBottom: 0.11, tessellation: 6,
      }, scene);
      thigh.material = cMat(`${prefix}_thighM${s}`, pants, scene);
      thigh.position.set(s * 0.1, beltY - 0.08, 0.15);
      thigh.rotate(Axis.X, Math.PI / 2.2, Space.LOCAL);
      thigh.parent = root;

      // Knee
      const knee = MeshBuilder.CreateSphere(`${prefix}_knee${s}`, { diameter: 0.12, segments: 6 }, scene);
      knee.material = cMat(`${prefix}_kneeM${s}`, pants, scene);
      knee.position.set(s * 0.1, beltY - 0.12, 0.32);
      knee.parent = root;

      // Calf — hanging down
      const calf = MeshBuilder.CreateCylinder(`${prefix}_calf${s}`, {
        height: 0.3, diameterTop: 0.1, diameterBottom: 0.08, tessellation: 6,
      }, scene);
      calf.material = cMat(`${prefix}_calfM${s}`, pants, scene);
      calf.position.set(s * 0.1, beltY - 0.3, 0.32);
      calf.parent = root;

      // Shoe
      const shoe = MeshBuilder.CreateBox(`${prefix}_shoe${s}`, { width: 0.1, height: 0.05, depth: 0.18 }, scene);
      shoe.material = cMat(`${prefix}_shoeM${s}`, shoes, scene);
      shoe.position.set(s * 0.1, beltY - 0.47, 0.35);
      shoe.parent = root;
    }
  } else {
    // Standing legs
    for (const s of [-1, 1]) {
      const leg = MeshBuilder.CreateCylinder(`${prefix}_leg${s}`, {
        height: 0.55, diameterTop: 0.13, diameterBottom: 0.1, tessellation: 6,
      }, scene);
      leg.material = cMat(`${prefix}_legM${s}`, pants, scene);
      leg.position.set(s * 0.09, 0.3, 0);
      leg.parent = root;

      const shoe = MeshBuilder.CreateBox(`${prefix}_shoe${s}`, { width: 0.1, height: 0.05, depth: 0.18 }, scene);
      shoe.material = cMat(`${prefix}_shoeM${s}`, shoes, scene);
      shoe.position.set(s * 0.09, 0.03, 0.03);
      shoe.parent = root;
    }
  }

  // ── Accessory ─────────────────────────────────────────────────────
  buildAccessory(scene, root, config.accessory, headY, prefix);

  return root;
}

// ── Hair styles (scaled up for big head) ────────────────────────────

function buildHair(scene: Scene, root: Mesh, style: HairStyle, color: Color3, headY: number, prefix: string) {
  if (style === 'bald') return;

  const m = cMat(`${prefix}_hairM`, color, scene);

  if (style === 'short') {
    const top = MeshBuilder.CreateSphere(`${prefix}_hairTop`, { diameter: 0.5, segments: 8 }, scene);
    top.material = m;
    top.position.set(0, headY + 0.08, -0.01);
    top.scaling = new Vector3(1, 0.5, 1);
    top.parent = root;

    // Side coverage
    for (const s of [-1, 1]) {
      const side = MeshBuilder.CreateBox(`${prefix}_hairS${s}`, { width: 0.06, height: 0.15, depth: 0.3 }, scene);
      side.material = m;
      side.position.set(s * 0.2, headY + 0.02, -0.04);
      side.parent = root;
    }
  } else if (style === 'slicked') {
    // Slicked back — smooth swept
    const top = MeshBuilder.CreateSphere(`${prefix}_hairTop`, { diameter: 0.5, segments: 8 }, scene);
    top.material = m;
    top.position.set(0, headY + 0.06, -0.04);
    top.scaling = new Vector3(1, 0.45, 1.2);
    top.parent = root;

    const back = MeshBuilder.CreateCylinder(`${prefix}_hairBack`, {
      height: 0.15, diameterTop: 0.38, diameterBottom: 0.28, tessellation: 8,
    }, scene);
    back.material = m;
    back.position.set(0, headY - 0.08, -0.12);
    back.parent = root;

    // Sides
    for (const s of [-1, 1]) {
      const side = MeshBuilder.CreateBox(`${prefix}_hairSS${s}`, { width: 0.05, height: 0.18, depth: 0.35 }, scene);
      side.material = m;
      side.position.set(s * 0.21, headY, -0.06);
      side.parent = root;
    }
  } else if (style === 'curly') {
    // Voluminous curls
    const positions = [
      [0, 0.16, 0], [-0.14, 0.12, 0.04], [0.14, 0.12, 0.04],
      [-0.18, 0.06, -0.02], [0.18, 0.06, -0.02], [0, 0.14, -0.1],
      [-0.08, 0.18, 0.02], [0.08, 0.18, 0.02], [0, 0.2, -0.04],
      [-0.12, 0.14, -0.08], [0.12, 0.14, -0.08],
    ];
    for (let i = 0; i < positions.length; i++) {
      const curl = MeshBuilder.CreateSphere(`${prefix}_curl${i}`, {
        diameter: 0.13 + (i % 3) * 0.02, segments: 6,
      }, scene);
      curl.material = m;
      curl.position.set(positions[i]![0]!, headY + positions[i]![1]!, positions[i]![2]!);
      curl.parent = root;
    }
  } else if (style === 'long') {
    // Top volume
    const top = MeshBuilder.CreateSphere(`${prefix}_hairTop`, { diameter: 0.52, segments: 8 }, scene);
    top.material = m;
    top.position.set(0, headY + 0.08, 0);
    top.scaling = new Vector3(1.05, 0.5, 1);
    top.parent = root;

    // Side curtains — flowing down
    for (const s of [-1, 1]) {
      const curtain = MeshBuilder.CreateBox(`${prefix}_hairC${s}`, {
        width: 0.08, height: 0.38, depth: 0.3,
      }, scene);
      curtain.material = m;
      curtain.position.set(s * 0.2, headY - 0.1, -0.02);
      curtain.parent = root;
    }

    // Back flow
    const back = MeshBuilder.CreateBox(`${prefix}_hairBk`, { width: 0.36, height: 0.32, depth: 0.1 }, scene);
    back.material = m;
    back.position.set(0, headY - 0.1, -0.14);
    back.parent = root;
  } else if (style === 'buzz') {
    const top = MeshBuilder.CreateSphere(`${prefix}_hairTop`, { diameter: 0.49, segments: 8 }, scene);
    top.material = m;
    top.position.set(0, headY + 0.06, 0);
    top.scaling = new Vector3(1, 0.35, 1);
    top.parent = root;
  }
}

// ── Accessories (positioned relative to head) ───────────────────────

function buildAccessory(scene: Scene, root: Mesh, accessory: Accessory, headY: number, prefix: string) {
  if (accessory === 'none') return;

  const isShades = accessory === 'sunglasses';
  const frameC = isShades ? new Color3(0.1, 0.1, 0.12) : new Color3(0.25, 0.2, 0.15);
  const lensC = isShades ? new Color3(0.06, 0.06, 0.08) : new Color3(0.75, 0.8, 0.85);

  const fMat = cMat(`${prefix}_frM`, frameC, scene);
  const lMat = cMat(`${prefix}_lnM`, lensC, scene);
  if (!isShades) lMat.alpha = 0.25;

  // Bridge
  const bridge = MeshBuilder.CreateBox(`${prefix}_bridge`, { width: 0.05, height: 0.015, depth: 0.02 }, scene);
  bridge.material = fMat;
  bridge.position.set(0, headY + 0.02, 0.235);
  bridge.parent = root;

  for (const s of [-1, 1]) {
    // Frame ring
    const frame = MeshBuilder.CreateCylinder(`${prefix}_gFr${s}`, {
      height: 0.02, diameter: 0.08, tessellation: 10,
    }, scene);
    frame.material = fMat;
    frame.position.set(s * 0.075, headY + 0.02, 0.235);
    frame.rotate(Axis.X, Math.PI / 2, Space.LOCAL);
    frame.parent = root;

    // Lens fill
    const lens = MeshBuilder.CreateCylinder(`${prefix}_gLn${s}`, {
      height: 0.008, diameter: 0.068, tessellation: 10,
    }, scene);
    lens.material = lMat;
    lens.position.set(s * 0.075, headY + 0.02, 0.24);
    lens.rotate(Axis.X, Math.PI / 2, Space.LOCAL);
    lens.parent = root;

    // Temple arm
    const arm = MeshBuilder.CreateBox(`${prefix}_gA${s}`, { width: 0.012, height: 0.012, depth: 0.18 }, scene);
    arm.material = fMat;
    arm.position.set(s * 0.11, headY + 0.02, 0.14);
    arm.parent = root;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────

function cMat(name: string, color: Color3, scene: Scene): StandardMaterial {
  const m = new StandardMaterial(name, scene);
  m.diffuseColor = color;
  m.specularColor = Color3.Black();
  return m;
}

function getTieColor(suit: Color3): Color3 {
  const r = 1 - suit.r * 0.5;
  const g = suit.g * 0.3 + 0.1;
  const b = suit.b * 0.4 + 0.15;
  return new Color3(
    Math.min(Math.max(r, 0.15), 0.7),
    Math.min(Math.max(g, 0.1), 0.3),
    Math.min(Math.max(b, 0.1), 0.35),
  );
}
