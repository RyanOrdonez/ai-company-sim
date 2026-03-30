import {
  Scene,
  Engine,
  ArcRotateCamera,
  Vector3,
  Color3,
  Color4,
  HemisphericLight,
  DirectionalLight,
  PointLight,
  ShadowGenerator,
  MeshBuilder,
  StandardMaterial,
  Mesh,
  Space,
  Axis,
} from '@babylonjs/core';

// ── Color palette ────────────────────────────────────────────────────
const C = {
  // Wood tones
  darkWood: new Color3(0.35, 0.22, 0.12),
  medWood: new Color3(0.45, 0.3, 0.16),
  lightWood: new Color3(0.55, 0.4, 0.22),
  warmWood: new Color3(0.5, 0.33, 0.18),
  floorWood: new Color3(0.52, 0.4, 0.28),
  floorLine: new Color3(0.47, 0.36, 0.24),

  // Walls
  panelWall: new Color3(0.42, 0.3, 0.2),
  panelTrim: new Color3(0.35, 0.24, 0.14),
  cream: new Color3(0.88, 0.84, 0.76),
  ceilingWhite: new Color3(0.93, 0.91, 0.88),

  // Furniture
  deskTop: new Color3(0.42, 0.28, 0.15),
  deskBody: new Color3(0.38, 0.25, 0.13),
  chairTan: new Color3(0.72, 0.58, 0.38),
  chairDarkTan: new Color3(0.6, 0.48, 0.3),
  metal: new Color3(0.3, 0.3, 0.32),
  black: new Color3(0.12, 0.12, 0.14),
  monScreen: new Color3(0.18, 0.28, 0.42),

  // Bookshelf
  shelf: new Color3(0.4, 0.28, 0.16),
  shelfBack: new Color3(0.32, 0.22, 0.12),
  book1: new Color3(0.2, 0.25, 0.4),
  book2: new Color3(0.5, 0.2, 0.15),
  book3: new Color3(0.18, 0.35, 0.22),
  book4: new Color3(0.55, 0.48, 0.2),
  book5: new Color3(0.35, 0.18, 0.35),
  book6: new Color3(0.6, 0.55, 0.45),

  // Window
  windowFrame: new Color3(0.32, 0.28, 0.22),
  glass: new Color3(0.75, 0.85, 0.92),
  blinds: new Color3(0.85, 0.82, 0.76),

  // Accents
  rug: new Color3(0.55, 0.45, 0.32),
  rugBorder: new Color3(0.42, 0.32, 0.2),
  plant: new Color3(0.22, 0.48, 0.2),
  plantDark: new Color3(0.16, 0.38, 0.14),
  pot: new Color3(0.55, 0.42, 0.28),
  potDark: new Color3(0.4, 0.3, 0.18),
  lampShade: new Color3(0.88, 0.85, 0.78),
  lampMetal: new Color3(0.5, 0.42, 0.28),
  frameGold: new Color3(0.55, 0.45, 0.25),
  paper: new Color3(0.92, 0.9, 0.85),
};

function mat(name: string, color: Color3, scene: Scene): StandardMaterial {
  const m = new StandardMaterial(name, scene);
  m.diffuseColor = color;
  m.specularColor = new Color3(0.08, 0.08, 0.08);
  return m;
}

function box(name: string, opts: { width: number; height: number; depth: number }, scene: Scene): Mesh {
  return MeshBuilder.CreateBox(name, opts, scene);
}

// ── Room ─────────────────────────────────────────────────────────────
function createRoom(scene: Scene): void {
  const W = 12, D = 10, H = 3.6;

  // Floor
  const floor = box('floor', { width: W, height: 0.1, depth: D }, scene);
  floor.material = mat('floorMat', C.floorWood, scene);
  floor.position.y = -0.05;
  floor.receiveShadows = true;

  for (let i = -5; i <= 5; i++) {
    const line = box(`fline${i}`, { width: 0.025, height: 0.11, depth: D }, scene);
    line.material = mat(`flineMat${i}`, C.floorLine, scene);
    line.position.set(i, -0.04, 0);
  }

  // Back wall — wood paneled (main focal wall behind desk)
  const backZ = D / 2;
  const backPanel = box('backWall', { width: W, height: H, depth: 0.2 }, scene);
  backPanel.material = mat('backWallMat', C.panelWall, scene);
  backPanel.position.set(0, H / 2, backZ);
  backPanel.receiveShadows = true;

  // Vertical panel trim lines on back wall
  for (let px = -4; px <= 4; px += 2) {
    const trim = box(`panelTrim${px}`, { width: 0.06, height: H, depth: 0.22 }, scene);
    trim.material = mat(`panelTrimMat${px}`, C.panelTrim, scene);
    trim.position.set(px, H / 2, backZ);
  }

  // Horizontal chair rail
  const rail = box('chairRail', { width: W, height: 0.08, depth: 0.23 }, scene);
  rail.material = mat('chairRailMat', C.panelTrim, scene);
  rail.position.set(0, 1.0, backZ);

  // Crown molding at top
  const crown = box('crown', { width: W, height: 0.1, depth: 0.24 }, scene);
  crown.material = mat('crownMat', C.panelTrim, scene);
  crown.position.set(0, H - 0.05, backZ);

  // Right wall — with large window
  const rightX = W / 2;
  const winY = 0.8, winH = 2.2, winW = 5;

  // Below window
  const rwBot = box('rwBot', { width: 0.15, height: winY, depth: D }, scene);
  rwBot.material = mat('rwBotMat', C.cream, scene);
  rwBot.position.set(rightX, winY / 2, 0);
  rwBot.receiveShadows = true;

  // Above window
  const abvH = H - winY - winH;
  const rwTop = box('rwTop', { width: 0.15, height: abvH, depth: D }, scene);
  rwTop.material = mat('rwTopMat', C.cream, scene);
  rwTop.position.set(rightX, winY + winH + abvH / 2, 0);

  // Window side walls
  const sideD = (D - winW) / 2;
  for (const [sign, label] of [[-1, 'L'], [1, 'R']] as const) {
    const sw = box(`rwSide${label}`, { width: 0.15, height: winH, depth: sideD }, scene);
    sw.material = mat(`rwSide${label}Mat`, C.cream, scene);
    sw.position.set(rightX, winY + winH / 2, sign * (D / 2 - sideD / 2));
  }

  // Window sill
  const sill = box('sill', { width: 0.25, height: 0.05, depth: winW + 0.2 }, scene);
  sill.material = mat('sillMat', C.cream, scene);
  sill.position.set(rightX - 0.1, winY - 0.02, 0);

  // Glass
  const glass = box('glass', { width: 0.03, height: winH - 0.1, depth: winW - 0.1 }, scene);
  const glassMat = mat('glassMat', C.glass, scene);
  glassMat.alpha = 0.35;
  glass.material = glassMat;
  glass.position.set(rightX, winY + winH / 2, 0);

  // Window frame mullions
  const ft = 0.06;
  // Vertical center
  const vc = box('wfV', { width: ft, height: winH, depth: ft }, scene);
  vc.material = mat('wfVMat', C.windowFrame, scene);
  vc.position.set(rightX - 0.04, winY + winH / 2, 0);
  // Horizontal center
  const hc = box('wfH', { width: ft, height: ft, depth: winW }, scene);
  hc.material = mat('wfHMat', C.windowFrame, scene);
  hc.position.set(rightX - 0.04, winY + winH / 2, 0);

  // Blinds slats (partially open)
  for (let by = 0; by < 8; by++) {
    const slat = box(`blind${by}`, { width: 0.01, height: 0.06, depth: winW - 0.3 }, scene);
    slat.material = mat(`blindMat${by}`, C.blinds, scene);
    slat.position.set(rightX - 0.06, winY + 0.3 + by * 0.25, 0);
    slat.rotation.z = 0.3;
  }

  // Left wall — cream
  const leftWall = box('leftWall', { width: 0.15, height: H, depth: D }, scene);
  leftWall.material = mat('leftWallMat', C.cream, scene);
  leftWall.position.set(-W / 2, H / 2, 0);
  leftWall.receiveShadows = true;

  // No ceiling — open top for camera view
}

// ── Built-in bookshelves (flanking desk on back wall) ────────────────
function createBuiltInShelves(scene: Scene): void {
  const shelfFrontZ = 4.3;  // front face of shelves, in front of back wall
  const bookColors = [C.book1, C.book2, C.book3, C.book4, C.book5, C.book6];

  for (const side of [-1, 1]) {
    const cx = side * 4.2;
    const shW = 2.0, shH = 3.0, shD = 0.5;
    const shelfCenterZ = shelfFrontZ + shD / 2;
    const prefix = side === -1 ? 'lShelf' : 'rShelf';

    // Side panels
    for (const ss of [-1, 1]) {
      const sp = box(`${prefix}Side${ss}`, { width: 0.04, height: shH, depth: shD }, scene);
      sp.material = mat(`${prefix}SideMat${ss}`, C.shelf, scene);
      sp.position.set(cx + ss * (shW / 2), shH / 2, shelfCenterZ);
    }

    // Back panel (flush against wall)
    const bk = box(`${prefix}Back`, { width: shW, height: shH, depth: 0.04 }, scene);
    bk.material = mat(`${prefix}BackMat`, C.shelfBack, scene);
    bk.position.set(cx, shH / 2, shelfFrontZ + shD - 0.02);

    // Top
    const topP = box(`${prefix}Top`, { width: shW, height: 0.04, depth: shD }, scene);
    topP.material = mat(`${prefix}TopMat`, C.shelf, scene);
    topP.position.set(cx, shH, shelfCenterZ);

    // Shelves + decorative items
    const numShelves = 5;
    const spacing = shH / (numShelves + 1);

    // Decorative colors
    const statueColors = [
      new Color3(0.7, 0.68, 0.65), // stone
      new Color3(0.75, 0.6, 0.15), // gold
      new Color3(0.25, 0.25, 0.28), // dark bronze
    ];
    const frameColors = [
      new Color3(0.35, 0.25, 0.15), // dark wood frame
      new Color3(0.6, 0.55, 0.45), // light wood frame
      new Color3(0.25, 0.25, 0.27), // metal frame
    ];
    const photoColors = [
      new Color3(0.65, 0.75, 0.85), // sky/outdoor
      new Color3(0.85, 0.78, 0.65), // sepia
      new Color3(0.55, 0.7, 0.55), // greenery
    ];
    const potColors = [
      new Color3(0.55, 0.3, 0.15), // terracotta
      new Color3(0.8, 0.78, 0.72), // cream ceramic
      new Color3(0.3, 0.3, 0.32),  // dark pot
    ];

    // Layout per shelf: array of item type sequences to vary content
    // 0=books, 1=statue, 2=photo, 3=bookend+books, 4=small plant, 5=globe/sphere
    const shelfLayouts = [
      [0, 1, 0],           // bottom: books, statue, books
      [2, 0, 4],           // books with photo and plant
      [0, 5, 0, 2],        // books, globe, books, photo
      [3, 1, 2],           // bookend cluster, statue, photo
      [4, 0, 1, 0],        // plant, books, statue, books
    ];

    for (let s = 0; s <= numShelves; s++) {
      const shY = spacing * s + 0.02;
      // Shelf plank
      const plank = box(`${prefix}Plank${s}`, { width: shW - 0.08, height: 0.03, depth: shD - 0.08 }, scene);
      plank.material = mat(`${prefix}PlankMat${s}`, C.shelf, scene);
      plank.position.set(cx, shY, shelfCenterZ);

      if (s >= numShelves) continue; // no items on top cap

      const maxH = spacing - 0.1;
      const layout = shelfLayouts[(s + (side === 1 ? 2 : 0)) % shelfLayouts.length]!;
      const slotWidth = (shW - 0.36) / layout.length;
      let slotX = cx - (shW / 2) + 0.18;

      for (let li = 0; li < layout.length; li++) {
        const itemType = layout[li]!;
        const seed = s * 7 + li * 13 + (side === 1 ? 5 : 0);

        if (itemType === 0 || itemType === 3) {
          // Books cluster
          const numBooks = 3 + (seed % 4);
          let bx = slotX;

          // Bookend on left side of cluster (type 3)
          if (itemType === 3) {
            const beH = maxH * 0.6;
            const be = box(`${prefix}BE${s}_${li}L`, { width: 0.04, height: beH, depth: shD * 0.45 }, scene);
            be.material = mat(`${prefix}BEMat${s}_${li}`, statueColors[seed % 3]!, scene);
            be.position.set(bx, shY + 0.015 + beH / 2, shelfCenterZ - 0.04);
            bx += 0.06;
          }

          for (let b = 0; b < numBooks; b++) {
            const bH = maxH * (0.5 + ((b * 7 + seed) % 10) / 22);
            const bW = 0.03 + ((b * 3 + seed) % 5) * 0.006;
            const color = bookColors[(b + seed) % bookColors.length]!;
            const book = box(`${prefix}Bk${s}_${li}_${b}`, { width: bW, height: bH, depth: shD * 0.5 }, scene);
            book.material = mat(`${prefix}BkM${s}_${li}_${b}`, color, scene);
            book.position.set(bx, shY + 0.015 + bH / 2, shelfCenterZ - 0.04);
            bx += bW + 0.012;
          }

          // Bookend on right (type 3)
          if (itemType === 3) {
            const beH = maxH * 0.6;
            const be = box(`${prefix}BE${s}_${li}R`, { width: 0.04, height: beH, depth: shD * 0.45 }, scene);
            be.material = mat(`${prefix}BEMat${s}_${li}R`, statueColors[seed % 3]!, scene);
            be.position.set(bx + 0.02, shY + 0.015 + beH / 2, shelfCenterZ - 0.04);
          }

        } else if (itemType === 1) {
          // Mini statue / trophy
          const variant = seed % 3;
          const sx = slotX + slotWidth / 2 - 0.05;

          if (variant === 0) {
            // Pedestal + abstract shape on top
            const ped = box(`${prefix}Ped${s}_${li}`, { width: 0.08, height: 0.06, depth: 0.08 }, scene);
            ped.material = mat(`${prefix}PedM${s}_${li}`, statueColors[0]!, scene);
            ped.position.set(sx, shY + 0.045, shelfCenterZ - 0.02);

            const fig = MeshBuilder.CreateCylinder(`${prefix}Fig${s}_${li}`, { height: maxH * 0.5, diameterTop: 0.03, diameterBottom: 0.07 }, scene);
            fig.material = mat(`${prefix}FigM${s}_${li}`, statueColors[1]!, scene);
            fig.position.set(sx, shY + 0.075 + maxH * 0.25, shelfCenterZ - 0.02);
          } else if (variant === 1) {
            // Trophy cup shape
            const base = MeshBuilder.CreateCylinder(`${prefix}TrB${s}_${li}`, { height: 0.04, diameter: 0.1 }, scene);
            base.material = mat(`${prefix}TrBM${s}_${li}`, statueColors[1]!, scene);
            base.position.set(sx, shY + 0.035, shelfCenterZ - 0.02);

            const stem = MeshBuilder.CreateCylinder(`${prefix}TrS${s}_${li}`, { height: maxH * 0.3, diameter: 0.03 }, scene);
            stem.material = mat(`${prefix}TrSM${s}_${li}`, statueColors[1]!, scene);
            stem.position.set(sx, shY + 0.055 + maxH * 0.15, shelfCenterZ - 0.02);

            const cup = MeshBuilder.CreateCylinder(`${prefix}TrC${s}_${li}`, { height: maxH * 0.25, diameterTop: 0.1, diameterBottom: 0.04 }, scene);
            cup.material = mat(`${prefix}TrCM${s}_${li}`, statueColors[1]!, scene);
            cup.position.set(sx, shY + 0.055 + maxH * 0.3 + maxH * 0.125, shelfCenterZ - 0.02);
          } else {
            // Abstract block sculpture
            const blk = box(`${prefix}Scl${s}_${li}`, { width: 0.1, height: maxH * 0.55, depth: 0.08 }, scene);
            blk.material = mat(`${prefix}SclM${s}_${li}`, statueColors[2]!, scene);
            blk.position.set(sx, shY + 0.015 + maxH * 0.275, shelfCenterZ - 0.02);
            blk.rotation.y = 0.3;
          }

        } else if (itemType === 2) {
          // Framed photo — leaning against back
          const fW = 0.16, fH = 0.13;
          const fx = slotX + slotWidth / 2 - fW / 2;
          const frameC = frameColors[seed % 3]!;
          const photoC = photoColors[(seed + 1) % 3]!;

          const frame = box(`${prefix}Fr${s}_${li}`, { width: fW, height: fH, depth: 0.02 }, scene);
          frame.material = mat(`${prefix}FrM${s}_${li}`, frameC, scene);
          frame.position.set(fx, shY + 0.015 + fH / 2, shelfCenterZ + 0.1);
          frame.rotation.x = -0.2; // lean back slightly
          frame.rotation.y = (seed % 2 === 0) ? 0.1 : -0.1;

          const photo = box(`${prefix}Ph${s}_${li}`, { width: fW - 0.03, height: fH - 0.03, depth: 0.01 }, scene);
          photo.material = mat(`${prefix}PhM${s}_${li}`, photoC, scene);
          photo.position.set(fx, shY + 0.015 + fH / 2, shelfCenterZ + 0.09);
          photo.rotation.x = -0.2;
          photo.rotation.y = frame.rotation.y;

        } else if (itemType === 4) {
          // Small potted plant
          const px = slotX + slotWidth / 2 - 0.05;
          const potC = potColors[seed % 3]!;

          const pot = MeshBuilder.CreateCylinder(`${prefix}Pot${s}_${li}`, { height: 0.08, diameterTop: 0.1, diameterBottom: 0.07 }, scene);
          pot.material = mat(`${prefix}PotM${s}_${li}`, potC, scene);
          pot.position.set(px, shY + 0.055, shelfCenterZ - 0.02);

          // Soil
          const soil = MeshBuilder.CreateCylinder(`${prefix}Soil${s}_${li}`, { height: 0.02, diameter: 0.09 }, scene);
          soil.material = mat(`${prefix}SoilM${s}_${li}`, new Color3(0.25, 0.18, 0.1), scene);
          soil.position.set(px, shY + 0.1, shelfCenterZ - 0.02);

          // Foliage — small sphere clusters
          const leafG = new Color3(0.2 + (seed % 3) * 0.08, 0.45 + (seed % 2) * 0.1, 0.15);
          for (let lf = 0; lf < 3; lf++) {
            const leaf = MeshBuilder.CreateSphere(`${prefix}Lf${s}_${li}_${lf}`, { diameter: 0.07 + lf * 0.01 }, scene);
            leaf.material = mat(`${prefix}LfM${s}_${li}_${lf}`, leafG, scene);
            const offX = (lf - 1) * 0.03;
            const offY = lf * 0.025;
            leaf.position.set(px + offX, shY + 0.12 + offY, shelfCenterZ - 0.02 + (lf % 2) * 0.015);
          }

        } else if (itemType === 5) {
          // Small globe / decorative sphere on stand
          const gx = slotX + slotWidth / 2 - 0.05;
          const stand = MeshBuilder.CreateCylinder(`${prefix}GlSt${s}_${li}`, { height: maxH * 0.3, diameterTop: 0.03, diameterBottom: 0.06 }, scene);
          stand.material = mat(`${prefix}GlStM${s}_${li}`, C.metal, scene);
          stand.position.set(gx, shY + 0.015 + maxH * 0.15, shelfCenterZ - 0.02);

          const globe = MeshBuilder.CreateSphere(`${prefix}Gl${s}_${li}`, { diameter: maxH * 0.35 }, scene);
          globe.material = mat(`${prefix}GlM${s}_${li}`, new Color3(0.25, 0.4, 0.55), scene);
          globe.position.set(gx, shY + 0.015 + maxH * 0.3 + maxH * 0.175, shelfCenterZ - 0.02);
        }

        slotX += slotWidth;
      }
    }

    // Glass doors on lower 2 shelves
    const doorH = spacing * 2 - 0.06;
    const door = box(`${prefix}Door`, { width: shW - 0.1, height: doorH, depth: 0.02 }, scene);
    const doorMat2 = mat(`${prefix}DoorMat`, new Color3(0.6, 0.55, 0.48), scene);
    doorMat2.alpha = 0.25;
    door.material = doorMat2;
    door.position.set(cx, doorH / 2 + 0.06, shelfFrontZ - 0.01);
  }
}

// ── CEO Desk — centered, simple rectangle ────────────────────────────
function createCEODesk(scene: Scene): Mesh[] {
  const meshes: Mesh[] = [];
  const x = 0, z = 1.8;
  const dW = 3.4, dD = 1.5;

  // Desktop
  const top = box('deskTop', { width: dW, height: 0.1, depth: dD }, scene);
  top.material = mat('deskTopMat', C.deskTop, scene);
  top.position.set(x, 0.76, z);
  meshes.push(top);

  // Front panel (faces the guest chairs / camera)
  const front = box('deskFront', { width: dW, height: 0.7, depth: 0.1 }, scene);
  front.material = mat('deskFrontMat', C.deskBody, scene);
  front.position.set(x, 0.38, z - dD / 2 + 0.05);
  meshes.push(front);

  // Front decorative inset
  const inset = box('deskInset', { width: dW - 0.6, height: 0.5, depth: 0.11 }, scene);
  inset.material = mat('deskInsetMat', C.darkWood, scene);
  inset.position.set(x, 0.38, z - dD / 2 + 0.055);
  meshes.push(inset);

  // Side panels
  for (const side of [-1, 1]) {
    const sp = box(`deskSide${side}`, { width: 0.1, height: 0.7, depth: dD }, scene);
    sp.material = mat(`deskSideMat${side}`, C.deskBody, scene);
    sp.position.set(x + side * (dW / 2 - 0.05), 0.38, z);
    meshes.push(sp);
  }

  // === Items on desk — all on CEO side (toward back wall, +z) ===

  // Monitor — offset to CEO's left, canted 45° so CEO can glance at it while facing guests
  const monAngle = Math.PI / 4; // 45° rotation
  const monX = x - 0.7;
  const monZ = z + 0.35;

  const monBezel = box('ceoMon', { width: 0.95, height: 0.58, depth: 0.04 }, scene);
  monBezel.material = mat('ceoMonMat', C.black, scene);
  monBezel.position.set(monX, 1.38, monZ);
  monBezel.rotation.y = monAngle;
  meshes.push(monBezel);

  const monScreen = box('ceoMonScr', { width: 0.88, height: 0.52, depth: 0.03 }, scene);
  monScreen.material = mat('ceoMonScrMat', C.monScreen, scene);
  monScreen.position.set(monX, 1.38, monZ + 0.01);
  monScreen.rotation.y = monAngle;
  meshes.push(monScreen);

  const monStand = box('ceoMonStand', { width: 0.06, height: 0.25, depth: 0.06 }, scene);
  monStand.material = mat('ceoMonStandMat', C.metal, scene);
  monStand.position.set(monX, 0.94, monZ);
  meshes.push(monStand);

  const monBase = box('ceoMonBase', { width: 0.28, height: 0.02, depth: 0.2 }, scene);
  monBase.material = mat('ceoMonBaseMat', C.metal, scene);
  monBase.position.set(monX, 0.82, monZ);
  meshes.push(monBase);

  // Keyboard — centered in front of where CEO sits
  const keyboard = box('keyboard', { width: 0.45, height: 0.015, depth: 0.16 }, scene);
  keyboard.material = mat('keyboardMat', C.black, scene);
  keyboard.position.set(x, 0.82, z + 0.15);
  keyboard.rotation.y = 0.08; // slight angle
  meshes.push(keyboard);

  // Mouse — to the right of keyboard
  const mouse = box('mouse', { width: 0.06, height: 0.02, depth: 0.1 }, scene);
  mouse.material = mat('mouseMat', C.black, scene);
  mouse.position.set(x + 0.35, 0.82, z + 0.15);
  meshes.push(mouse);

  // Desk lamp (CEO's right side, toward back)
  const lampBase = MeshBuilder.CreateCylinder('dLampBase', { height: 0.03, diameter: 0.18 }, scene);
  lampBase.material = mat('dLampBaseMat', C.lampMetal, scene);
  lampBase.position.set(x + 1.2, 0.83, z + 0.3);
  meshes.push(lampBase);

  const lampArm = MeshBuilder.CreateCylinder('dLampArm', { height: 0.5, diameter: 0.025 }, scene);
  lampArm.material = mat('dLampArmMat', C.lampMetal, scene);
  lampArm.position.set(x + 1.2, 1.08, z + 0.3);
  lampArm.rotation.z = -0.15;
  meshes.push(lampArm);

  const lampHead = MeshBuilder.CreateCylinder('dLampHead', { height: 0.12, diameterTop: 0.05, diameterBottom: 0.2 }, scene);
  lampHead.material = mat('dLampHeadMat', C.lampMetal, scene);
  lampHead.position.set(x + 1.25, 1.36, z + 0.3);
  lampHead.rotation.z = -0.3;
  meshes.push(lampHead);

  // Papers (CEO's left, toward back)
  const papers = box('papers', { width: 0.35, height: 0.03, depth: 0.25 }, scene);
  papers.material = mat('papersMat', C.paper, scene);
  papers.position.set(x - 1.0, 0.83, z + 0.2);
  papers.rotation.y = 0.1;
  meshes.push(papers);

  // Folder (in front of monitor, CEO side)
  const folder = box('folder', { width: 0.32, height: 0.02, depth: 0.22 }, scene);
  folder.material = mat('folderMat', new Color3(0.5, 0.35, 0.2), scene);
  folder.position.set(x - 0.5, 0.82, z + 0.1);
  meshes.push(folder);

  // Phone (CEO's right, far side)
  const phone = box('phone', { width: 0.28, height: 0.04, depth: 0.18 }, scene);
  phone.material = mat('phoneMat', C.black, scene);
  phone.position.set(x + 1.2, 0.82, z - 0.1);
  meshes.push(phone);

  const handset = MeshBuilder.CreateCylinder('handset', { height: 0.22, diameter: 0.04 }, scene);
  handset.material = mat('handsetMat', C.black, scene);
  handset.position.set(x + 1.2, 0.87, z - 0.1);
  handset.rotate(Axis.Z, Math.PI / 2, Space.LOCAL);
  meshes.push(handset);

  return meshes;
}

// ── Executive chair — tan leather ────────────────────────────────────
function createExecChair(scene: Scene, x: number, z: number, rotY: number, prefix: string): Mesh[] {
  const meshes: Mesh[] = [];

  // Star base
  for (let i = 0; i < 5; i++) {
    const arm = box(`${prefix}BaseA${i}`, { width: 0.05, height: 0.04, depth: 0.32 }, scene);
    arm.material = mat(`${prefix}BaseAM${i}`, C.metal, scene);
    arm.position.set(x, 0.04, z);
    arm.rotation.y = rotY + (i * Math.PI * 2) / 5;
    meshes.push(arm);
  }

  const pole = MeshBuilder.CreateCylinder(`${prefix}Pole`, { height: 0.36, diameter: 0.06 }, scene);
  pole.material = mat(`${prefix}PoleMat`, C.metal, scene);
  pole.position.set(x, 0.26, z);
  meshes.push(pole);

  // Seat
  const seat = box(`${prefix}Seat`, { width: 0.58, height: 0.1, depth: 0.55 }, scene);
  seat.material = mat(`${prefix}SeatMat`, C.chairTan, scene);
  seat.position.set(x, 0.49, z);
  seat.rotation.y = rotY;
  meshes.push(seat);

  // High back with tufting look (main back + smaller overlay)
  const backOff = 0.26;
  const back = box(`${prefix}Back`, { width: 0.56, height: 0.9, depth: 0.1 }, scene);
  back.material = mat(`${prefix}BackMat`, C.chairTan, scene);
  back.position.set(x + Math.sin(rotY) * backOff, 1.0, z + Math.cos(rotY) * backOff);
  back.rotation.y = rotY;
  meshes.push(back);

  // Headrest
  const head = box(`${prefix}Head`, { width: 0.38, height: 0.2, depth: 0.09 }, scene);
  head.material = mat(`${prefix}HeadMat`, C.chairDarkTan, scene);
  head.position.set(x + Math.sin(rotY) * (backOff + 0.01), 1.52, z + Math.cos(rotY) * (backOff + 0.01));
  head.rotation.y = rotY;
  meshes.push(head);

  // Armrests
  for (const side of [-1, 1]) {
    const ax = x + Math.cos(rotY) * side * 0.27;
    const az = z - Math.sin(rotY) * side * 0.27;

    const sup = box(`${prefix}ArmS${side}`, { width: 0.04, height: 0.22, depth: 0.04 }, scene);
    sup.material = mat(`${prefix}ArmSM${side}`, C.metal, scene);
    sup.position.set(ax, 0.63, az);
    meshes.push(sup);

    const pad = box(`${prefix}ArmP${side}`, { width: 0.06, height: 0.04, depth: 0.26 }, scene);
    pad.material = mat(`${prefix}ArmPM${side}`, C.chairDarkTan, scene);
    pad.position.set(ax, 0.75, az);
    pad.rotation.y = rotY;
    meshes.push(pad);
  }

  return meshes;
}

// ── Framed certificates on back wall ─────────────────────────────────
function createWallFrames(scene: Scene): void {
  const wallZ = 4.78;
  const frames = [
    { x: -0.6, y: 2.6, w: 0.5, h: 0.38 },
    { x: 0.6, y: 2.6, w: 0.5, h: 0.38 },
  ];

  frames.forEach((f, i) => {
    const frame = box(`cert${i}`, { width: f.w + 0.06, height: f.h + 0.06, depth: 0.03 }, scene);
    frame.material = mat(`certFMat${i}`, C.frameGold, scene);
    frame.position.set(f.x, f.y, wallZ);

    const inner = box(`certI${i}`, { width: f.w, height: f.h, depth: 0.035 }, scene);
    inner.material = mat(`certIMat${i}`, C.paper, scene);
    inner.position.set(f.x, f.y, wallZ - 0.005);

    // Text lines (thin dark boxes)
    for (let line = 0; line < 4; line++) {
      const lw = f.w * (0.6 - line * 0.08);
      const l = box(`certL${i}_${line}`, { width: lw, height: 0.015, depth: 0.036 }, scene);
      l.material = mat(`certLM${i}_${line}`, new Color3(0.2, 0.2, 0.22), scene);
      l.position.set(f.x, f.y + 0.08 - line * 0.06, wallZ - 0.007);
    }
  });
}

// ── Plants ───────────────────────────────────────────────────────────
function createPlant(scene: Scene, x: number, z: number, prefix: string, tall: boolean): void {
  // Pot
  const potH = tall ? 0.5 : 0.35;
  const potD = tall ? 0.4 : 0.3;
  const pot = MeshBuilder.CreateCylinder(`${prefix}Pot`, { height: potH, diameterTop: potD, diameterBottom: potD * 0.7 }, scene);
  pot.material = mat(`${prefix}PotMat`, C.pot, scene);
  pot.position.set(x, potH / 2, z);

  const rim = MeshBuilder.CreateCylinder(`${prefix}Rim`, { height: 0.04, diameter: potD + 0.04 }, scene);
  rim.material = mat(`${prefix}RimMat`, C.potDark, scene);
  rim.position.set(x, potH - 0.01, z);

  // Foliage
  if (tall) {
    // Tall leafy plant (like a ficus)
    // Trunk
    const trunk = MeshBuilder.CreateCylinder(`${prefix}Trunk`, { height: 0.8, diameter: 0.06 }, scene);
    trunk.material = mat(`${prefix}TrunkMat`, new Color3(0.35, 0.25, 0.15), scene);
    trunk.position.set(x, potH + 0.4, z);

    // Leaf clusters
    const clusters = [
      { dx: 0, dy: 1.0, dz: 0, s: 0.45 },
      { dx: 0.15, dy: 0.85, dz: 0.1, s: 0.35 },
      { dx: -0.12, dy: 0.9, dz: -0.08, s: 0.38 },
      { dx: 0.08, dy: 1.15, dz: -0.06, s: 0.3 },
      { dx: -0.1, dy: 1.1, dz: 0.1, s: 0.32 },
      { dx: 0, dy: 1.25, dz: 0, s: 0.25 },
    ];
    clusters.forEach((cl, i) => {
      const leaf = MeshBuilder.CreateSphere(`${prefix}Leaf${i}`, { diameter: cl.s, segments: 6 }, scene);
      leaf.material = mat(`${prefix}LeafMat${i}`, i % 2 === 0 ? C.plant : C.plantDark, scene);
      leaf.position.set(x + cl.dx, potH + cl.dy, z + cl.dz);
    });
  } else {
    // Small bushy plant
    const sizes = [0.22, 0.2, 0.18, 0.16];
    sizes.forEach((s, i) => {
      const leaf = MeshBuilder.CreateSphere(`${prefix}Leaf${i}`, { diameter: s, segments: 6 }, scene);
      leaf.material = mat(`${prefix}LeafMat${i}`, i % 2 === 0 ? C.plant : C.plantDark, scene);
      leaf.position.set(x + (i - 1.5) * 0.06, potH + 0.1 + i * 0.08, z + ((i % 2) * 0.06 - 0.03));
    });
  }
}

// ── Guest chairs (front of desk) ─────────────────────────────────────
function createGuestChair(scene: Scene, x: number, z: number, rotY: number, prefix: string): void {
  // Simple padded chair
  const legs = [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]];
  legs.forEach(([lx, lz], i) => {
    const leg = box(`${prefix}Leg${i}`, { width: 0.04, height: 0.42, depth: 0.04 }, scene);
    leg.material = mat(`${prefix}LegMat${i}`, C.metal, scene);
    leg.position.set(
      x + Math.cos(rotY) * lx! + Math.sin(rotY) * lz!,
      0.21,
      z - Math.sin(rotY) * lx! + Math.cos(rotY) * lz!,
    );
  });

  const seat = box(`${prefix}Seat`, { width: 0.5, height: 0.08, depth: 0.48 }, scene);
  seat.material = mat(`${prefix}SeatMat`, C.chairDarkTan, scene);
  seat.position.set(x, 0.46, z);
  seat.rotation.y = rotY;

  const back = box(`${prefix}Back`, { width: 0.5, height: 0.5, depth: 0.06 }, scene);
  back.material = mat(`${prefix}BackMat`, C.chairTan, scene);
  back.position.set(x + Math.sin(rotY) * 0.22, 0.75, z + Math.cos(rotY) * 0.22);
  back.rotation.y = rotY;
}

// ── Rug ──────────────────────────────────────────────────────────────
function createRug(scene: Scene): void {
  const border = box('rugBorder', { width: 6, height: 0.015, depth: 4.5 }, scene);
  border.material = mat('rugBorderMat', C.rugBorder, scene);
  border.position.set(0, 0.005, 0.5);

  const rug = box('rug', { width: 5.6, height: 0.018, depth: 4.1 }, scene);
  rug.material = mat('rugMat', C.rug, scene);
  rug.position.set(0, 0.01, 0.5);
  rug.receiveShadows = true;
}

// ── Credenza (low cabinet behind desk, against back wall) ────────────
function createCredenza(scene: Scene): void {
  const cx = 0, cz = 4.2;
  const body = box('credenza', { width: 3.0, height: 0.75, depth: 0.5 }, scene);
  body.material = mat('credenzaMat', C.medWood, scene);
  body.position.set(cx, 0.375, cz);

  const top = box('credTop', { width: 3.1, height: 0.04, depth: 0.55 }, scene);
  top.material = mat('credTopMat', C.deskTop, scene);
  top.position.set(cx, 0.77, cz);

  // Door lines
  for (const dx of [-0.75, 0, 0.75]) {
    const line = box(`credLine${dx}`, { width: 0.02, height: 0.6, depth: 0.51 }, scene);
    line.material = mat(`credLineMat${dx}`, C.darkWood, scene);
    line.position.set(cx + dx, 0.38, cz - 0.01);
  }
}

// ── Lighting ─────────────────────────────────────────────────────────
function createLighting(scene: Scene): ShadowGenerator {
  // Warm ambient
  const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.45;
  ambient.diffuse = new Color3(1, 0.95, 0.85);
  ambient.groundColor = new Color3(0.3, 0.25, 0.2);

  // Window sunlight
  const sun = new DirectionalLight('sun', new Vector3(-0.5, -0.7, 0.3), scene);
  sun.position = new Vector3(8, 5, -2);
  sun.intensity = 0.65;
  sun.diffuse = new Color3(1, 0.95, 0.82);

  const shadows = new ShadowGenerator(1024, sun);
  shadows.useBlurExponentialShadowMap = true;
  shadows.blurKernel = 16;
  shadows.darkness = 0.35;

  // Overhead recessed lights
  for (const lx of [-3, 0, 3]) {
    const pl = new PointLight(`pLight${lx}`, new Vector3(lx, 3.4, 1), scene);
    pl.intensity = 0.25;
    pl.diffuse = new Color3(1, 0.96, 0.88);
    pl.range = 8;
  }

  return shadows;
}

// ── Camera — lower perspective, more immersive ───────────────────────
function createCamera(scene: Scene, canvas: HTMLCanvasElement): ArcRotateCamera {
  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 1.8,      // alpha — front-left, looking toward back wall
    Math.PI / 3.0,       // beta — lower angle, near eye level
    12,                  // radius
    new Vector3(0, 1.0, 2.0),  // target — desk area center
    scene,
  );

  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 22;
  camera.lowerBetaLimit = 0.5;
  camera.upperBetaLimit = Math.PI / 2.3;
  camera.panningDistanceLimit = 5;
  camera.inertia = 0.88;
  camera.wheelPrecision = 35;

  camera.attachControl(canvas, true);
  return camera;
}

// ── Main export ──────────────────────────────────────────────────────
export function createCEOSuite(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.05, 0.05, 0.1, 1);

  createCamera(scene, canvas);
  const shadows = createLighting(scene);

  createRoom(scene);
  createBuiltInShelves(scene);
  createCredenza(scene);

  // CEO desk — centered, commanding position
  const deskMeshes = createCEODesk(scene);
  deskMeshes.forEach((m) => shadows.addShadowCaster(m));

  // CEO chair — tan leather, behind desk
  const chairMeshes = createExecChair(scene, 0, 3.2, 0, 'ceo');
  chairMeshes.forEach((m) => shadows.addShadowCaster(m));

  // Two guest chairs in front of desk
  createGuestChair(scene, -1.0, -0.3, Math.PI, 'guest1');
  createGuestChair(scene, 1.0, -0.3, Math.PI, 'guest2');

  // Framed certificates on back wall
  createWallFrames(scene);

  // Rug
  createRug(scene);

  // Tall plants flanking the desk area
  createPlant(scene, -3.2, 4.2, 'plantL', true);
  createPlant(scene, 3.2, 4.2, 'plantR', true);

  // Small plant on credenza
  createPlant(scene, 1.2, 4.2, 'plantC', false);

  return scene;
}
