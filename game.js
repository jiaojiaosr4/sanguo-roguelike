/* ==========================================
   三国肉鸽 - Three Kingdoms Roguelike
   Game Engine
   ========================================== */

// =============================================
// CONFIGURATION
// =============================================
const CFG = {
  TILE_SIZE: 28,
  MAP_W: 50,
  MAP_H: 40,
  VIEW_W: 25,
  VIEW_H: 19,
  FLOOR_COUNT: 10,
  ROOMS_MIN: 7,
  ROOMS_MAX: 11,
  FOV_RANGE: 7,
  MINIMAP_SCALE: 3,
};

const TILE = { WALL: 0, FLOOR: 1, STAIRS: 2 };

// =============================================
// HERO DEFINITIONS
// =============================================
const HEROES = {
  liubei: {
    id: 'liubei', name: '刘备', title: '仁德之君',
    hp: 130, atk: 14, def: 10, spd: 8,
    color: '#44aaff', emoji: '👑',
    ability: {
      name: '仁德', desc: '恢复35%最大生命值',
      cooldown: 5, type: 'heal',
      value: 0.35,
    },
  },
  guanyu: {
    id: 'guanyu', name: '关羽', title: '武圣',
    hp: 110, atk: 22, def: 8, spd: 9,
    color: '#22cc44', emoji: '🗡️',
    ability: {
      name: '武圣', desc: '下次攻击造成3倍伤害',
      cooldown: 4, type: 'power_strike',
      value: 3,
    },
  },
  caocao: {
    id: 'caocao', name: '曹操', title: '乱世奸雄',
    hp: 150, atk: 16, def: 12, spd: 7,
    color: '#cc4444', emoji: '⚔️',
    ability: {
      name: '奸雄', desc: '3回合内防御力翻倍',
      cooldown: 5, type: 'defense_up',
      value: 2, duration: 3,
    },
  },
  zhugeliang: {
    id: 'zhugeliang', name: '诸葛亮', title: '卧龙',
    hp: 95, atk: 18, def: 6, spd: 10,
    color: '#aa66ff', emoji: '📜',
    ability: {
      name: '奇门遁甲', desc: '对周围3格敌人造成1.5倍攻击伤害',
      cooldown: 4, type: 'aoe',
      value: 1.5, range: 3,
    },
  },
};

// =============================================
// ENEMY TEMPLATES (by floor tier)
// =============================================
const ENEMY_TEMPLATES = {
  // Floor 1-2
  tier1: [
    { name: '黄巾兵', ch: '兵', hp: 25, atk: 8, def: 3, spd: 5, xp: 12, color: '#dd8844', detect: 5 },
    { name: '黄巾头目', ch: '目', hp: 40, atk: 12, def: 5, spd: 6, xp: 22, color: '#cc6633', detect: 6, elite: true },
    { name: '山贼', ch: '贼', hp: 30, atk: 10, def: 4, spd: 6, xp: 15, color: '#aa6644', detect: 5 },
  ],
  // Floor 3-4
  tier2: [
    { name: '西凉骑兵', ch: '骑', hp: 50, atk: 15, def: 7, spd: 8, xp: 25, color: '#cc8844', detect: 7 },
    { name: '董卓亲卫', ch: '卫', hp: 60, atk: 18, def: 9, spd: 7, xp: 30, color: '#bb5533', detect: 6, elite: true },
    { name: '李傕部将', ch: '傕', hp: 45, atk: 14, def: 6, spd: 8, xp: 22, color: '#996644', detect: 7 },
  ],
  // Floor 5-6
  tier3: [
    { name: '虎豹骑', ch: '豹', hp: 75, atk: 22, def: 11, spd: 10, xp: 40, color: '#cc5555', detect: 8 },
    { name: '精锐弓手', ch: '弓', hp: 55, atk: 25, def: 7, spd: 9, xp: 38, color: '#dd6666', detect: 9, ranged: true },
    { name: '许褚部将', ch: '许', hp: 85, atk: 24, def: 13, spd: 8, xp: 50, color: '#bb3333', detect: 7, elite: true },
  ],
  // Floor 7-8
  tier4: [
    { name: '禁卫军', ch: '禁', hp: 95, atk: 28, def: 15, spd: 10, xp: 55, color: '#cc3333', detect: 9 },
    { name: '大将', ch: '将', hp: 120, atk: 32, def: 18, spd: 12, xp: 70, color: '#ee3333', detect: 10, elite: true },
    { name: '虎贲军', ch: '贲', hp: 85, atk: 26, def: 14, spd: 11, xp: 50, color: '#cc4444', detect: 9 },
  ],
};

const BOSSES = [
  { floor: 2,  name: '华雄',     ch: '雄', hp: 140, atk: 22, def: 14, spd: 7,  xp: 100, color: '#ff4400', slot: 'headwear' },
  { floor: 4,  name: '颜良文丑', ch: '颜', hp: 210, atk: 30, def: 18, spd: 9,  xp: 180, color: '#ff5500', slot: 'armor' },
  { floor: 6,  name: '典韦',     ch: '韦', hp: 290, atk: 38, def: 26, spd: 11, xp: 290, color: '#ff3300', slot: 'pants' },
  { floor: 8,  name: '董卓',     ch: '董', hp: 360, atk: 42, def: 30, spd: 8,  xp: 380, color: '#990099', slot: 'mount' },
  { floor: 10, name: '吕布',     ch: '吕', hp: 460, atk: 50, def: 32, spd: 16, xp: 550, color: '#ff0000', slot: 'weapon' },
];

// Boss 专属掉落
const BOSS_DROPS = {
  headwear: { id: 'head_boss', name: '紫金雉尾冠', slot: 'headwear', stat: 'atk', value: 12, desc: '华雄金冠，勇冠三军', color: '#cc88ff' },
  armor:    { id: 'armor_boss', name: '黄金锁子甲', slot: 'armor', stat: 'def', value: 14, desc: '颜良文丑双雄宝甲', color: '#ffcc00' },
  pants:    { id: 'pants_boss', name: '虎皮战裙',   slot: 'pants', stat: 'spd', value: 6, desc: '典韦虎纹战裙，古之恶来', color: '#ff8800' },
  mount:    { id: 'mount_boss', name: '赤兔马',     slot: 'mount', stat: 'spd', value: 7, desc: '董卓千里神驹，人中吕布马中赤兔', color: '#ff4444' },
  weapon:   { id: 'weapon_boss', name: '方天画戟',  slot: 'weapon', stat: 'atk', value: 22, desc: '吕布天下无双之神兵', color: '#ff2222' },
};

// =============================================
// ITEM DEFINITIONS
// =============================================
const ITEMS = {
  consumables: [
    { id: 'herb', name: '草药', desc: '恢复25点生命', type: 'heal', value: 25, color: '#66cc66' },
    { id: 'medkit', name: '金疮药', desc: '恢复60点生命', type: 'heal', value: 60, color: '#44cc44' },
    { id: 'elixir', name: '还魂丹', desc: '恢复全部生命', type: 'heal_full', value: 1, color: '#ffd700' },
    { id: 'atk_pill', name: '战神丹', desc: '5回合内攻击+10', type: 'buff_atk', value: 10, duration: 5, color: '#ff6644' },
    { id: 'def_pill', name: '铁壁丹', desc: '5回合内防御+10', type: 'buff_def', value: 10, duration: 5, color: '#4488ff' },
    { id: 'spd_pill', name: '迅捷丹', desc: '5回合内速度+5', type: 'buff_spd', value: 5, duration: 5, color: '#44dddd' },
  ],
  equipment: [
    // 头饰
    { id: 'head1', name: '纶巾', slot: 'headwear', stat: 'def', value: 3, desc: '诸葛亮常戴之巾', color: '#aaaaff' },
    { id: 'head2', name: '铁盔', slot: 'headwear', stat: 'def', value: 5, desc: '普通武将头盔', color: '#888888' },
    { id: 'head3', name: '凤翅盔', slot: 'headwear', stat: 'atk', value: 5, desc: '精良战盔', color: '#ffcc88' },
    // 衣服
    { id: 'armor1', name: '八卦阵图', slot: 'armor', stat: 'def', value: 10, desc: '诸葛卧龙阵法护体', color: '#aa88ff' },
    { id: 'armor2', name: '明光铠', slot: 'armor', stat: 'def', value: 8, desc: '精制铠甲', color: '#cccccc' },
    { id: 'armor3', name: '鱼鳞甲', slot: 'armor', stat: 'def', value: 6, desc: '轻便战甲', color: '#88aacc' },
    // 裤子
    { id: 'pants1', name: '锦缎战裤', slot: 'pants', stat: 'spd', value: 3, desc: '名将战裤', color: '#ccaa88' },
    { id: 'pants2', name: '铁护腿', slot: 'pants', stat: 'def', value: 4, desc: '精铁打造', color: '#999999' },
    { id: 'pants3', name: '皮甲护胫', slot: 'pants', stat: 'spd', value: 2, desc: '轻便护胫', color: '#bbaa88' },
    // 兵器
    { id: 'sword1', name: '雌雄双股剑', slot: 'weapon', stat: 'atk', value: 8, desc: '刘备双剑', color: '#cc88ff' },
    { id: 'sword2', name: '青龙偃月刀', slot: 'weapon', stat: 'atk', value: 15, desc: '关羽大刀', color: '#ff8800' },
    { id: 'sword3', name: '丈八蛇矛', slot: 'weapon', stat: 'atk', value: 12, desc: '张飞蛇矛', color: '#ffaa00' },
    { id: 'sword4', name: '青釭剑', slot: 'weapon', stat: 'atk', value: 10, desc: '曹操宝剑', color: '#aaaaff' },
    // 坐骑
    { id: 'mount1', name: '的卢马', slot: 'mount', stat: 'spd', value: 3, desc: '救主神马', color: '#ffffff' },
    { id: 'mount2', name: '绝影马', slot: 'mount', stat: 'spd', value: 4, desc: '曹操爱马', color: '#aaaaaa' },
    { id: 'mount3', name: '爪黄飞电', slot: 'mount', stat: 'spd', value: 5, desc: '曹操名马', color: '#ddcc88' },
  ],
};

// =============================================
// GAME STATE
// =============================================
const state = {
  // Player
  hero: null,
  heroKey: null,
  level: 1,
  xp: 0,
  xpToNext: 20,
  playerX: 0,
  playerY: 0,
  inventory: [],       // consumable items
  equipment: { headwear: null, armor: null, pants: null, weapon: null, mount: null },
  buffs: [],           // active buffs { name, turns, atk?, def?, spd? }
  powerStrike: false,  // 关羽's next attack buff
  abilityCooldown: 0,

  // Map
  map: [],
  rooms: [],
  visible: [],         // currently visible tiles
  explored: [],        // tiles that have been seen
  enemies: [],
  floorItems: [],      // items on the ground { x, y, item }

  // Game progress
  floor: 1,
  turn: 0,
  kills: 0,
  messages: [],
  gameOver: false,

  // Effects (combat visuals)
  effects: [],
  animFrameId: null,

  // Canvas
  canvas: null,
  ctx: null,
  miniCanvas: null,
  miniCtx: null,
  vx: 0,
  vy: 0,
};

// =============================================
// UTILITY FUNCTIONS
// =============================================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function dist(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// =============================================
// COMBAT EFFECTS / VISUALS
// =============================================
function spawnEffect(x, y, type, opts = {}) {
  state.effects.push({
    x, y, type,
    frame: 0,
    maxFrames: opts.maxFrames || 12,
    color: opts.color || '#fff',
    damage: opts.damage || 0,
    isCrit: opts.isCrit || false,
    dx: opts.dx || 0,
    dy: opts.dy || 0,
  });
  // Start animation loop if not running
  if (!state.animFrameId) {
    state.animFrameId = requestAnimationFrame(animLoop);
  }
}

function spawnSlashEffect(fromX, fromY, toX, toY, damage, isCrit) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  spawnEffect(toX, toY, 'slash', { damage, isCrit, dx, dy });
  // Also spawn hit particles
  for (let i = 0; i < (isCrit ? 8 : 4); i++) {
    spawnEffect(toX, toY, 'particle', {
      color: isCrit ? '#ff4444' : '#ffdd44',
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
      maxFrames: 6 + Math.floor(Math.random() * 6),
    });
  }
  // Flash the defender tile
  spawnEffect(toX, toY, 'flash', {
    color: isCrit ? '#ff0000' : '#ff8800',
    maxFrames: isCrit ? 8 : 5,
  });
}

function spawnHealEffect(x, y) {
  for (let i = 0; i < 6; i++) {
    spawnEffect(x, y, 'particle', {
      color: '#44ff44',
      dx: (Math.random() - 0.5) * 6,
      dy: -2 - Math.random() * 6,
      maxFrames: 10 + Math.floor(Math.random() * 8),
    });
  }
}

function spawnAbilityEffect(x, y, color) {
  for (let i = 0; i < 10; i++) {
    spawnEffect(x, y, 'particle', {
      color,
      dx: (Math.random() - 0.5) * 12,
      dy: (Math.random() - 0.5) * 12,
      maxFrames: 12 + Math.floor(Math.random() * 10),
    });
  }
  spawnEffect(x, y, 'flash', { color, maxFrames: 10 });
}

function animLoop() {
  const canvas = state.canvas;
  const ctx = state.ctx;

  // Update effects
  state.effects = state.effects.filter(e => {
    e.frame++;
    return e.frame < e.maxFrames;
  });

  // If effects still exist, keep looping; otherwise stop
  if (state.effects.length > 0) {
    state.animFrameId = requestAnimationFrame(animLoop);
  } else {
    state.animFrameId = null;
  }

  // Re-render
  render();
}

function drawEffects(ctx, ts, vx, vy, vw, vh) {
  for (const e of state.effects) {
    const sx = (e.x - vx) * ts;
    const sy = (e.y - vy) * ts;
    if (sx < -ts || sx > vw * ts + ts || sy < -ts || sy > vh * ts + ts) continue;

    const progress = e.frame / e.maxFrames;
    const cx = sx + ts / 2;
    const cy = sy + ts / 2;
    const alpha = 1 - progress;

    switch (e.type) {
      case 'flash':
        // Flash overlay on the tile
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = e.color;
        ctx.fillRect(sx, sy, ts, ts);
        ctx.globalAlpha = 1;
        break;

      case 'slash':
        // Slash arc from attacker direction
        ctx.save();
        ctx.globalAlpha = alpha;
        const angle = Math.atan2(e.dy, e.dx);
        ctx.strokeStyle = e.isCrit ? '#ff2222' : '#ffdd44';
        ctx.lineWidth = e.isCrit ? 3 : 2;
        ctx.shadowColor = e.isCrit ? '#ff0000' : '#ffaa00';
        ctx.shadowBlur = e.isCrit ? 8 : 4;
        ctx.beginPath();
        ctx.arc(cx, cy, ts * 0.6, angle - 0.8, angle + 0.8);
        ctx.stroke();
        // Second arc (cross-slash for crit)
        if (e.isCrit) {
          ctx.beginPath();
          ctx.arc(cx, cy, ts * 0.8, angle - 0.5, angle + 0.5);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.restore();
        // Damage number
        if (e.frame < 8) {
          ctx.save();
          ctx.globalAlpha = 1 - e.frame / 8;
          ctx.fillStyle = e.isCrit ? '#ff2222' : '#ffdd44';
          ctx.font = `bold ${e.isCrit ? 16 : 12}px "Microsoft YaHei", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((e.isCrit ? '💥' : '') + e.damage, cx, cy - ts * 0.7 - e.frame * 1.5);
          ctx.restore();
        }
        break;

      case 'particle':
        // Small flying particles
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 4;
        const px = cx + e.dx * progress * ts / 2;
        const py = cy + e.dy * progress * ts / 2;
        const size = Math.max(1, (1 - progress) * 4);
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
        break;
    }
  }
}

// =============================================
// MESSAGE SYSTEM
// =============================================
function addMessage(text, type = 'info') {
  state.messages.unshift({ text, type, turn: state.turn });
  if (state.messages.length > 100) state.messages.pop();
}

// =============================================
// MAP GENERATION
// =============================================
function generateMap() {
  // Initialize map with walls
  const map = [];
  for (let y = 0; y < CFG.MAP_H; y++) {
    map[y] = new Array(CFG.MAP_W).fill(TILE.WALL);
  }

  // Generate rooms
  const rooms = [];
  const numRooms = rand(CFG.ROOMS_MIN, CFG.ROOMS_MAX);
  let attempts = 0;
  const maxAttempts = numRooms * 20;

  while (rooms.length < numRooms && attempts < maxAttempts) {
    attempts++;
    const w = rand(4, 9);
    const h = rand(3, 7);
    const x = rand(2, CFG.MAP_W - w - 2);
    const y = rand(2, CFG.MAP_H - h - 2);

    // Check overlap with padding
    const pad = 2;
    let overlaps = false;
    for (const r of rooms) {
      if (
        x - pad < r.x + r.w &&
        x + w + pad > r.x &&
        y - pad < r.y + r.h &&
        y + h + pad > r.y
      ) {
        overlaps = true;
        break;
      }
    }
    if (overlaps) continue;

    // Carve room
    const room = { x, y, w, h, cx: Math.floor(x + w / 2), cy: Math.floor(y + h / 2) };
    rooms.push(room);
    for (let ry = y; ry < y + h; ry++) {
      for (let rx = x; rx < x + w; rx++) {
        if (ry >= 0 && ry < CFG.MAP_H && rx >= 0 && rx < CFG.MAP_W) {
          map[ry][rx] = TILE.FLOOR;
        }
      }
    }
  }

  // Sort rooms left-to-right for better corridor connections
  rooms.sort((a, b) => a.cx - b.cx);

  // Connect rooms with corridors
  for (let i = 1; i < rooms.length; i++) {
    connectRooms(map, rooms[i - 1], rooms[i]);
  }

  // Ensure all rooms are connected (MST-style fallback)
  // Connect each room to the nearest room
  for (let i = 0; i < rooms.length; i++) {
    let connected = false;
    for (let j = 0; j < rooms.length; j++) {
      if (i === j) continue;
      if (roomsConnected(map, rooms[i], rooms[j])) {
        connected = true;
        break;
      }
    }
    if (!connected && i > 0) {
      connectRooms(map, rooms[i - 1], rooms[i]);
    }
  }

  return { map, rooms };
}

function connectRooms(map, r1, r2) {
  // L-shaped corridor from r1 center to r2 center
  let x = r1.cx;
  let y = r1.cy;
  const tx = r2.cx;
  const ty = r2.cy;

  // Randomly choose horizontal-first or vertical-first
  if (Math.random() < 0.5) {
    // Horizontal then vertical
    while (x !== tx) {
      x += x < tx ? 1 : -1;
      if (y >= 0 && y < CFG.MAP_H && x >= 0 && x < CFG.MAP_W) map[y][x] = TILE.FLOOR;
    }
    while (y !== ty) {
      y += y < ty ? 1 : -1;
      if (y >= 0 && y < CFG.MAP_H && x >= 0 && x < CFG.MAP_W) map[y][x] = TILE.FLOOR;
    }
  } else {
    // Vertical then horizontal
    while (y !== ty) {
      y += y < ty ? 1 : -1;
      if (y >= 0 && y < CFG.MAP_H && x >= 0 && x < CFG.MAP_W) map[y][x] = TILE.FLOOR;
    }
    while (x !== tx) {
      x += x < tx ? 1 : -1;
      if (y >= 0 && y < CFG.MAP_H && x >= 0 && x < CFG.MAP_W) map[y][x] = TILE.FLOOR;
    }
  }
}

function roomsConnected(map, r1, r2) {
  // Simple BFS to check if two rooms are connected
  const visited = new Set();
  const queue = [{ x: r1.cx, y: r1.cy }];
  visited.add(`${r1.cx},${r1.cy}`);

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (x === r2.cx && y === r2.cy) return true;

    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;
      if (
        nx >= 0 && nx < CFG.MAP_W && ny >= 0 && ny < CFG.MAP_H &&
        map[ny][nx] !== TILE.WALL && !visited.has(key)
      ) {
        visited.add(key);
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return false;
}

// =============================================
// FOG OF WAR / FIELD OF VIEW
// =============================================
function updateFOV() {
  const px = state.playerX;
  const py = state.playerY;
  const range = CFG.FOV_RANGE;

  // Reset visibility
  for (let y = 0; y < CFG.MAP_H; y++) {
    for (let x = 0; x < CFG.MAP_W; x++) {
      state.visible[y][x] = false;
    }
  }

  // Cast rays in all directions
  for (let angle = 0; angle < 360; angle += 0.5) {
    const rad = (angle * Math.PI) / 180;
    let x = px + 0.5;
    let y = py + 0.5;

    for (let i = 0; i <= range * 1.5; i++) {
      const tx = Math.floor(x);
      const ty = Math.floor(y);

      if (tx < 0 || tx >= CFG.MAP_W || ty < 0 || ty >= CFG.MAP_H) break;

      state.visible[ty][tx] = true;
      state.explored[ty][tx] = true;

      if (state.map[ty][tx] === TILE.WALL) break;

      x += Math.cos(rad) * 0.5;
      y += Math.sin(rad) * 0.5;

      if (dist(px, py, tx, ty) > range) break;
    }
  }

  // Ensure player tile is always visible
  state.visible[py][px] = true;
  state.explored[py][px] = true;
}

// =============================================
// ENTITY MANAGEMENT
// =============================================
function getPlayerStats() {
  let atk = state.hero.atk;
  let def = state.hero.def;
  let spd = state.hero.spd;
  let maxHp = state.hero.hp;

  // Level bonus
  const lvlBonus = state.level - 1;
  maxHp += lvlBonus * 5;
  atk += lvlBonus * 2;
  def += lvlBonus * 1;
  spd += lvlBonus * 1;

  // Equipment bonus (5 slots)
  for (const slot of Object.values(state.equipment)) {
    if (!slot) continue;
    if (slot.stat === 'atk') atk += slot.value;
    if (slot.stat === 'def') def += slot.value;
    if (slot.stat === 'spd') spd += slot.value;
  }

  // Buffs
  for (const buff of state.buffs) {
    if (buff.atk) atk += buff.atk;
    if (buff.def) def += buff.def;
    if (buff.spd) spd += buff.spd;
  }

  return { maxHp, atk, def, spd };
}

function getPlayerHP() {
  return state.hero._hp;
}

function playerHeal(amount) {
  const stats = getPlayerStats();
  state.hero._hp = Math.min(stats.maxHp, state.hero._hp + amount);
}

function playerTakeDamage(amount) {
  state.hero._hp -= amount;
  if (state.hero._hp <= 0) {
    state.hero._hp = 0;
    triggerGameOver();
  }
}

function playerFullHeal() {
  const stats = getPlayerStats();
  state.hero._hp = stats.maxHp;
}

// =============================================
// COMBAT SYSTEM
// =============================================
function attackEntity(attacker, defender, isPlayer) {
  const atk = isPlayer ? getPlayerStats().atk : attacker.atk;
  const def = isPlayer ? defender.def : (defender._def || defender.def);

  let damage = Math.max(1, atk - def);

  // Critical hit
  const atkSpd = isPlayer ? getPlayerStats().spd : attacker.spd;
  const defSpd = isPlayer ? defender.spd : (defender._spd || defender.spd);
  const critChance = 0.1 + Math.max(0, (atkSpd - defSpd) * 0.03);
  let isCrit = false;

  if (Math.random() < critChance) {
    damage = Math.floor(damage * 2);
    isCrit = true;
  }

  // Power strike (关羽 ability)
  if (isPlayer && state.powerStrike) {
    damage *= HEROES.guanyu.ability.value;
    state.powerStrike = false;
    isCrit = true; // force crit visuals for power strike
    addMessage(`武圣之力！${HEROES.guanyu.name}打出致命一击！`, 'critical');
  }

  // Apply damage
  if (isPlayer) {
    defender._hp -= damage;
  } else {
    playerTakeDamage(damage);
  }

  // Spawn hit effects
  const fromX = isPlayer ? state.playerX : attacker._x;
  const fromY = isPlayer ? state.playerY : attacker._y;
  const toX = isPlayer ? defender._x : state.playerX;
  const toY = isPlayer ? defender._y : state.playerY;
  spawnSlashEffect(fromX, fromY, toX, toY, damage, isCrit);

  const atkName = isPlayer ? state.hero.name : attacker.name;
  const defName = isPlayer ? defender.name : state.hero.name;

  if (isCrit) {
    addMessage(`💥 暴击！${atkName}对${defName}造成 ${damage} 点伤害！`, 'critical');
  } else {
    addMessage(`${atkName}攻击${defName}，造成 ${damage} 点伤害`, 'combat');
  }

  return damage;
}

function playerAttack(enemy) {
  attackEntity(null, enemy, true);

  if (enemy._hp <= 0) {
    enemyDefeated(enemy);
  }
}

function enemyAttack(playerEnemy) {
  attackEntity(playerEnemy, null, false);

  if (state.hero._hp <= 0) {
    triggerGameOver();
  }
}

function enemyDefeated(enemy) {
  addMessage(`🗡️ ${enemy.name}被击败！`, 'combat');

  // XP gain
  const xpGain = enemy.xp || 10;
  state.xp += xpGain;
  state.kills++;
  addMessage(`获得 ${xpGain} 经验值`, 'info');

  // Check level up
  checkLevelUp();

  // Item drop
  if (enemy.isBoss) {
    // Boss 必掉专属装备
    const bossDef = BOSSES.find(b => b.name === enemy.name);
    if (bossDef && BOSS_DROPS[bossDef.slot]) {
      const droppedItem = deepCopy(BOSS_DROPS[bossDef.slot]);
      state.floorItems.push({ x: enemy._x, y: enemy._y, item: droppedItem });
      addMessage(`📦 ${enemy.name}掉落专属装备：${droppedItem.name}！`, 'item');
    }
  } else {
    const dropChance = enemy.elite ? 0.5 : 0.25;
    const equipChance = enemy.elite ? 0.15 : 0.05;
    if (Math.random() < dropChance) {
      let droppedItem;
      if (Math.random() < equipChance) {
        droppedItem = deepCopy(randPick(ITEMS.equipment));
      } else {
        droppedItem = deepCopy(randPick(ITEMS.consumables));
      }
      state.floorItems.push({ x: enemy._x, y: enemy._y, item: droppedItem });
      addMessage(`📦 ${enemy.name}掉落：${droppedItem.name}！`, 'item');
    }
  }

  // Remove enemy
  state.enemies = state.enemies.filter(e => e !== enemy);
}

function checkLevelUp() {
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level++;
    state.xpToNext = state.level * 25;
    playerFullHeal();
    addMessage(`🎉 升级！达到 Lv.${state.level}！生命值完全恢复！`, 'levelup');
  }
}

function useAbility() {
  if (state.abilityCooldown > 0) {
    addMessage(`技能冷却中...还需 ${state.abilityCooldown} 回合`, 'info');
    return;
  }

  const ability = state.hero.ability;
  state.abilityCooldown = ability.cooldown;

  switch (ability.type) {
    case 'heal': {
      const stats = getPlayerStats();
      const healAmount = Math.floor(stats.maxHp * ability.value);
      playerHeal(healAmount);
      spawnHealEffect(state.playerX, state.playerY);
      addMessage(`✨ 【${ability.name}】恢复 ${healAmount} 点生命值！`, 'ability');
      break;
    }
    case 'power_strike': {
      state.powerStrike = true;
      addMessage(`✨ 【${ability.name}】下次攻击将造成 ${ability.value}倍 伤害！`, 'ability');
      break;
    }
    case 'defense_up': {
      state.buffs.push({
        name: ability.name,
        turns: ability.duration,
        def: getPlayerStats().def * (ability.value - 1),
      });
      addMessage(`✨ 【${ability.name}】防御力翻倍，持续 ${ability.duration} 回合！`, 'ability');
      break;
    }
    case 'aoe': {
      const range = ability.range;
      let hitCount = 0;
      spawnAbilityEffect(state.playerX, state.playerY, '#cc88ff');
      for (const enemy of state.enemies) {
        if (dist(state.playerX, state.playerY, enemy._x, enemy._y) <= range) {
          const damage = Math.floor(getPlayerStats().atk * ability.value) - (enemy._def || enemy.def);
          const actualDmg = Math.max(1, damage);
          enemy._hp -= actualDmg;
          hitCount++;
          spawnSlashEffect(state.playerX, state.playerY, enemy._x, enemy._y, actualDmg, false);
          addMessage(`【${ability.name}】对${enemy.name}造成 ${actualDmg} 点伤害！`, 'ability');
          if (enemy._hp <= 0) {
            enemyDefeated(enemy);
          }
        }
      }
      if (hitCount === 0) {
        addMessage(`【${ability.name}】范围内没有敌人`, 'info');
      } else {
        addMessage(`【${ability.name}】共命中 ${hitCount} 个敌人！`, 'ability');
      }
      break;
    }
  }
}

// =============================================
// ITEM SYSTEM
// =============================================
function pickUpItem() {
  const px = state.playerX;
  const py = state.playerY;

  const itemIndex = state.floorItems.findIndex(fi => fi.x === px && fi.y === py);
  if (itemIndex === -1) {
    addMessage('脚下没有可拾取的物品', 'info');
    return;
  }

  const { item } = state.floorItems[itemIndex];
  state.floorItems.splice(itemIndex, 1);

  if (item.slot) {
    // Equipment - auto equip if better
    const current = state.equipment[item.slot];
    if (!current || item.value > current.value) {
      if (current) {
        addMessage(`卸下 ${current.name}`, 'item');
      }
      state.equipment[item.slot] = item;
      addMessage(`🎒 装备了 ${item.name}！${item.desc}`, 'item');
    } else {
      addMessage(`${item.name}不如当前装备，已丢弃`, 'info');
    }
  } else {
    // Consumable - add to inventory
    if (state.inventory.length >= 12) {
      addMessage('背包已满！', 'info');
      state.floorItems.push({ x: px, y: py, item }); // put it back
      return;
    }
    state.inventory.push(item);
    addMessage(`🎒 获得 ${item.name}：${item.desc}`, 'item');
  }
}

function useInventoryItem(index) {
  if (index < 0 || index >= state.inventory.length) return;

  const item = state.inventory[index];
  state.inventory.splice(index, 1);

  switch (item.type) {
    case 'heal':
      playerHeal(item.value);
      addMessage(`🧪 使用${item.name}，恢复 ${item.value} 点生命`, 'item');
      break;
    case 'heal_full':
      playerFullHeal();
      addMessage(`🧪 使用${item.name}，生命值完全恢复！`, 'item');
      break;
    case 'buff_atk':
      state.buffs.push({ name: item.name, turns: item.duration, atk: item.value });
      addMessage(`💊 使用${item.name}，攻击力+${item.value}，持续${item.duration}回合`, 'item');
      break;
    case 'buff_def':
      state.buffs.push({ name: item.name, turns: item.duration, def: item.value });
      addMessage(`💊 使用${item.name}，防御力+${item.value}，持续${item.duration}回合`, 'item');
      break;
    case 'buff_spd':
      state.buffs.push({ name: item.name, turns: item.duration, spd: item.value });
      addMessage(`💊 使用${item.name}，速度+${item.value}，持续${item.duration}回合`, 'item');
      break;
  }
}

// =============================================
// ENEMY AI
// =============================================
function enemyTurn() {
  for (const enemy of state.enemies) {
    if (state.gameOver) return;

    const ex = enemy._x;
    const ey = enemy._y;
    const d = dist(state.playerX, state.playerY, ex, ey);

    // Check if enemy can see the player
    const detectRange = enemy.detect || 6;
    const canSee = d <= detectRange && hasLineOfSight(ex, ey, state.playerX, state.playerY);

    if (d === 1) {
      // Adjacent: attack!
      enemyAttack(enemy);
    } else if (canSee) {
      // Move toward player
      moveEnemyToward(enemy, state.playerX, state.playerY);
    } else {
      // Wander randomly (30% chance)
      if (Math.random() < 0.3) {
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const [dx, dy] = randPick(dirs);
        moveEnemy(enemy, ex + dx, ey + dy);
      }
    }
  }
}

function moveEnemyToward(enemy, tx, ty) {
  const ex = enemy._x;
  const ey = enemy._y;

  // Calculate direction
  const dx = Math.sign(tx - ex);
  const dy = Math.sign(ty - ey);

  // Try axis-aligned movement, prefer the axis with larger distance
  const candidates = [];
  if (dx !== 0) candidates.push({ dx, dy: 0, dist: Math.abs(tx - (ex + dx)) + Math.abs(ty - ey) });
  if (dy !== 0) candidates.push({ dx: 0, dy, dist: Math.abs(tx - ex) + Math.abs(ty - (ey + dy)) });

  // Sort by best distance
  candidates.sort((a, b) => a.dist - b.dist);

  for (const c of candidates) {
    if (moveEnemy(enemy, ex + c.dx, ey + c.dy)) {
      return;
    }
  }
}

function moveEnemy(enemy, nx, ny) {
  // Check bounds
  if (nx < 0 || nx >= CFG.MAP_W || ny < 0 || ny >= CFG.MAP_H) return false;
  // Check wall
  if (state.map[ny][nx] === TILE.WALL) return false;
  // Check player position
  if (nx === state.playerX && ny === state.playerY) return false;
  // Check other enemies
  if (state.enemies.some(e => e !== enemy && e._x === nx && e._y === ny)) return false;

  enemy._x = nx;
  enemy._y = ny;
  return true;
}

function hasLineOfSight(x1, y1, x2, y2) {
  // Bresenham's line algorithm
  let x = x1;
  let y = y1;
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (x !== x2 || y !== y2) {
    if (state.map[y] && state.map[y][x] === TILE.WALL) return false;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
  }
  return true;
}

// =============================================
// PLAYER MOVEMENT
// =============================================
function playerMove(dx, dy) {
  if (state.gameOver) return;

  const nx = state.playerX + dx;
  const ny = state.playerY + dy;

  // Check bounds
  if (nx < 0 || nx >= CFG.MAP_W || ny < 0 || ny >= CFG.MAP_H) return;
  // Check wall
  if (state.map[ny][nx] === TILE.WALL) return;

  // Check for enemy
  const enemy = state.enemies.find(e => e._x === nx && e._y === ny);
  if (enemy) {
    // Combat!
    playerAttack(enemy);
    if (enemy._hp > 0) {
      enemyAttack(enemy);
    }
    endTurn();
    return;
  }

  // Move player
  state.playerX = nx;
  state.playerY = ny;

  // Check for stairs
  if (state.map[ny][nx] === TILE.STAIRS) {
    addMessage('🔽 发现通往下一层的楼梯！按 F 进入下一层', 'info');
  }

  endTurn();
}

function playerWait() {
  if (state.gameOver) return;
  // Small heal when waiting (1 HP)
  playerHeal(1);
  addMessage('⏳ 等待一回合，恢复1点生命', 'info');
  endTurn();
}

function endTurn() {
  state.turn++;

  // Process buffs
  state.buffs = state.buffs.filter(buff => {
    buff.turns--;
    if (buff.turns <= 0) {
      addMessage(`${buff.name}效果结束`, 'info');
      return false;
    }
    return true;
  });

  // Reduce cooldown
  if (state.abilityCooldown > 0) {
    state.abilityCooldown--;
  }

  // Enemy turn
  enemyTurn();

  // Update FOV
  updateFOV();

  // Render
  render();
  updateUI();
}

function descendStairs() {
  if (state.map[state.playerY][state.playerX] !== TILE.STAIRS) {
    addMessage('没有楼梯可以下去', 'info');
    return;
  }
  nextFloor();
}

// =============================================
// FLOOR PROGRESSION
// =============================================
function generateFloor() {
  const { map, rooms } = generateMap();
  state.map = map;
  state.rooms = rooms;

  // Initialize visibility arrays
  state.visible = [];
  state.explored = [];
  for (let y = 0; y < CFG.MAP_H; y++) {
    state.visible[y] = new Array(CFG.MAP_W).fill(false);
    state.explored[y] = new Array(CFG.MAP_W).fill(false);
  }

  // Place player in first room
  const startRoom = rooms[0];
  state.playerX = startRoom.cx;
  state.playerY = startRoom.cy;

  // Place stairs in last room
  const endRoom = rooms[rooms.length - 1];
  state.map[endRoom.cy][endRoom.cx] = TILE.STAIRS;

  // Place enemies
  state.enemies = [];
  const floorScale = 1 + (state.floor - 1) * 0.3;

  // Determine tier
  let tier;
  if (state.floor <= 3) tier = 'tier1';
  else if (state.floor <= 5) tier = 'tier2';
  else if (state.floor <= 7) tier = 'tier3';
  else tier = 'tier4';

  const templates = ENEMY_TEMPLATES[tier];
  const numEnemies = rand(4, 7) + Math.floor(state.floor / 2);

  for (let i = 0; i < numEnemies; i++) {
    const roomIdx = rand(1, rooms.length - 1); // skip first room
    const room = rooms[roomIdx];
    const ex = rand(room.x + 1, room.x + room.w - 2);
    const ey = rand(room.y + 1, room.y + room.h - 2);

    // Don't place on stairs or player
    if (ex === state.playerX && ey === state.playerY) continue;
    if (state.map[ey][ex] === TILE.STAIRS) continue;
    if (state.map[ey][ex] === TILE.WALL) continue;
    if (state.enemies.some(e => e._x === ex && e._y === ey)) continue;

    const template = randPick(templates);
    const enemy = deepCopy(template);
    enemy._x = ex;
    enemy._y = ey;
    enemy._hp = Math.floor(enemy.hp * floorScale);
    enemy._maxHp = enemy._hp;
    enemy.atk = Math.floor(enemy.atk * floorScale);
    enemy.def = Math.floor(enemy.def * floorScale);
    enemy._def = enemy.def;
    enemy._spd = enemy.spd;
    state.enemies.push(enemy);
  }

  // Place boss
  const boss = BOSSES.find(b => b.floor === state.floor);
  if (boss) {
    // Boss room: a room in the middle
    const bossRoom = rooms[Math.floor(rooms.length / 2)];
    const bx = bossRoom.cx;
    const by = bossRoom.cy;
    // Make sure there's no stairs here
    if (state.map[by][bx] !== TILE.STAIRS) {
      const bossEnemy = deepCopy(boss);
      bossEnemy._x = bx;
      bossEnemy._y = by;
      bossEnemy._hp = Math.floor(boss.hp * floorScale);
      bossEnemy._maxHp = bossEnemy._hp;
      bossEnemy._def = boss.def;
      bossEnemy._spd = boss.spd;
      bossEnemy.isBoss = true;
      bossEnemy.elite = true;
      state.enemies.push(bossEnemy);
      addMessage(`⚠️ ${boss.name} 出现在这一层！`, 'boss');
    }
  }

  // Place items
  state.floorItems = [];
  const numItems = rand(2, 5);
  for (let i = 0; i < numItems; i++) {
    const room = randPick(rooms);
    const ix = rand(room.x + 1, room.x + room.w - 2);
    const iy = rand(room.y + 1, room.y + room.h - 2);
    if (state.map[iy][ix] === TILE.WALL) continue;
    if (ix === state.playerX && iy === state.playerY) continue;

    const isEquip = Math.random() < 0.25;
    const item = isEquip ? deepCopy(randPick(ITEMS.equipment)) : deepCopy(randPick(ITEMS.consumables));
    state.floorItems.push({ x: ix, y: iy, item });
  }

  // Update FOV
  updateFOV();

  addMessage(`🏯 进入第 ${state.floor} 层...`, 'info');
  if (boss) {
    addMessage(`⚠️ Boss ${boss.name} 镇守此层！`, 'boss');
  }
}

function nextFloor() {
  state.floor++;
  if (state.floor > CFG.FLOOR_COUNT) {
    triggerVictory();
    return;
  }
  generateFloor();
  render();
  updateUI();
}

// =============================================
// GAME OVER / VICTORY
// =============================================
function triggerGameOver() {
  state.gameOver = true;
  addMessage(`💀 ${state.hero.name}兵败身亡...`, 'critical');

  document.getElementById('gameover-title').textContent =
    state.floor >= CFG.FLOOR_COUNT ? '霸业未成' : '兵败身亡';

  const statsDiv = document.getElementById('gameover-stats');
  statsDiv.innerHTML = `
    <div>英雄：<span>${state.hero.name}（${state.hero.title}）</span></div>
    <div>等级：<span>Lv.${state.level}</span></div>
    <div>到达层数：<span>第 ${state.floor} 层</span></div>
    <div>击杀敌数：<span>${state.kills}</span></div>
    <div>存活回合：<span>${state.turn}</span></div>
  `;

  document.getElementById('gameover-screen').style.display = 'flex';
}

function triggerVictory() {
  state.gameOver = true;
  addMessage(`🏆 ${state.hero.name}击败吕布，一统天下！`, 'levelup');

  const statsDiv = document.getElementById('victory-stats');
  statsDiv.innerHTML = `
    <div>英雄：<span>${state.hero.name}（${state.hero.title}）</span></div>
    <div>等级：<span>Lv.${state.level}</span></div>
    <div>击杀敌数：<span>${state.kills}</span></div>
    <div>总回合数：<span>${state.turn}</span></div>
  `;

  document.getElementById('victory-screen').style.display = 'flex';
}

// =============================================
// RENDERING
// =============================================
function render() {
  const canvas = state.canvas;
  const ctx = state.ctx;
  const ts = CFG.TILE_SIZE;

  // Calculate viewport (center on player)
  const vw = CFG.VIEW_W;
  const vh = CFG.VIEW_H;
  let vx = state.playerX - Math.floor(vw / 2);
  let vy = state.playerY - Math.floor(vh / 2);
  vx = clamp(vx, 0, CFG.MAP_W - vw);
  vy = clamp(vy, 0, CFG.MAP_H - vh);

  // Store for effects rendering
  state.vx = vx;
  state.vy = vy;

  canvas.width = vw * ts;
  canvas.height = vh * ts;

  // Clear
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw tiles
  for (let ty = 0; ty < vh; ty++) {
    for (let tx = 0; tx < vw; tx++) {
      const mx = vx + tx;
      const my = vy + ty;
      if (mx < 0 || mx >= CFG.MAP_W || my < 0 || my >= CFG.MAP_H) continue;

      const sx = tx * ts;
      const sy = ty * ts;
      const tile = state.map[my][mx];
      const explored = state.explored[my][mx];
      const visible = state.visible[my][mx];

      if (!explored) {
        // Unexplored: solid black
        ctx.fillStyle = '#080810';
        ctx.fillRect(sx, sy, ts, ts);
        continue;
      }

      // Draw tile base
      if (tile === TILE.WALL) {
        ctx.fillStyle = visible ? '#4a3f2f' : '#2a2018';
        ctx.fillRect(sx, sy, ts, ts);
        // Wall texture
        if (visible) {
          ctx.fillStyle = '#5a4f3f';
          ctx.fillRect(sx + 2, sy + 2, ts - 4, 2);
          ctx.fillStyle = '#3a2f1f';
          ctx.fillRect(sx + 2, sy + ts / 2, ts - 4, 2);
        }
      } else {
        ctx.fillStyle = visible ? '#5c4a32' : '#2a2018';
        ctx.fillRect(sx, sy, ts, ts);
        // Floor texture
        if (visible) {
          ctx.fillStyle = '#4a3a25';
          ctx.fillRect(sx + ts / 2, sy + 2, 1, ts - 4);
        }
      }

      // Dim explored but not visible tiles
      if (!visible) {
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(sx, sy, ts, ts);
      }

      if (!visible) continue;

      // Draw stairs
      if (tile === TILE.STAIRS) {
        ctx.fillStyle = '#44cc44';
        ctx.beginPath();
        ctx.moveTo(sx + ts / 2, sy + ts - 4);
        ctx.lineTo(sx + 4, sy + 4);
        ctx.lineTo(sx + ts - 4, sy + 4);
        ctx.closePath();
        ctx.fill();
        // Glow effect
        ctx.fillStyle = 'rgba(68, 204, 68, 0.2)';
        ctx.fillRect(sx, sy, ts, ts);
      }

      // Draw floor items
      for (const fi of state.floorItems) {
        if (fi.x === mx && fi.y === my) {
          // Item glow
          ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
          ctx.fillRect(sx, sy, ts, ts);

          // Diamond shape
          const cx = sx + ts / 2;
          const cy = sy + ts / 2;
          ctx.fillStyle = fi.item.slot ? '#cc88ff' : '#ffd700';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 5);
          ctx.lineTo(cx + 4, cy);
          ctx.lineTo(cx, cy + 5);
          ctx.lineTo(cx - 4, cy);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw enemies
      for (const enemy of state.enemies) {
        if (enemy._x === mx && enemy._y === my) {
          // Enemy base
          ctx.fillStyle = enemy.color;
          ctx.beginPath();
          if (enemy.isBoss) {
            // Boss: larger star shape
            const cx = sx + ts / 2;
            const cy = sy + ts / 2;
            drawStar(ctx, cx, cy, 5, ts / 2 - 2, ts / 4 - 1);
            ctx.fill();
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Boss HP bar
            const hpPct = enemy._hp / enemy._maxHp;
            ctx.fillStyle = '#300';
            ctx.fillRect(sx + 2, sy + 2, ts - 4, 3);
            ctx.fillStyle = '#f00';
            ctx.fillRect(sx + 2, sy + 2, (ts - 4) * hpPct, 3);
          } else {
            // Regular enemy: circle
            ctx.arc(sx + ts / 2, sy + ts / 2, ts / 2 - 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Enemy label
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px "Microsoft YaHei", "SimHei", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(enemy.ch || enemy.name[0], sx + ts / 2, sy + ts / 2);
        }
      }

      // Draw player
      if (state.playerX === mx && state.playerY === my) {
        // Player glow
        ctx.fillStyle = 'rgba(68, 136, 255, 0.2)';
        ctx.fillRect(sx, sy, ts, ts);

        // Player circle
        ctx.fillStyle = state.hero.color;
        ctx.beginPath();
        ctx.arc(sx + ts / 2, sy + ts / 2, ts / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Player label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px "Microsoft YaHei", "SimHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(state.hero.name[0], sx + ts / 2, sy + ts / 2);
      }
    }
  }

  // Draw combat effects (on top of everything)
  drawEffects(ctx, ts, vx, vy, vw, vh);

  // Draw minimap
  drawMinimap();
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
}

function drawMinimap() {
  const mc = state.miniCanvas;
  const mctx = state.miniCtx;
  const scale = CFG.MINIMAP_SCALE;

  mc.width = CFG.MAP_W * scale;
  mc.height = CFG.MAP_H * scale;

  // Background
  mctx.fillStyle = '#080810';
  mctx.fillRect(0, 0, mc.width, mc.height);

  // Draw tiles
  for (let y = 0; y < CFG.MAP_H; y++) {
    for (let x = 0; x < CFG.MAP_W; x++) {
      if (!state.explored[y][x]) continue;

      const sx = x * scale;
      const sy = y * scale;
      const tile = state.map[y][x];
      const visible = state.visible[y][x];

      if (tile === TILE.WALL) {
        mctx.fillStyle = visible ? '#5a4f3f' : '#2a2018';
        mctx.fillRect(sx, sy, scale, scale);
      } else {
        mctx.fillStyle = visible ? '#6a5a42' : '#2a2018';
        mctx.fillRect(sx, sy, scale, scale);
      }

      if (tile === TILE.STAIRS && visible) {
        mctx.fillStyle = '#44cc44';
        mctx.fillRect(sx, sy, scale, scale);
      }
    }
  }

  // Draw items
  for (const fi of state.floorItems) {
    if (state.visible[fi.y] && state.visible[fi.x]) {
      mctx.fillStyle = '#ffd700';
      mctx.fillRect(fi.x * scale, fi.y * scale, scale, scale);
    }
  }

  // Draw enemies
  for (const enemy of state.enemies) {
    if (state.visible[enemy._y] && state.visible[enemy._x]) {
      mctx.fillStyle = enemy.isBoss ? '#ff0000' : enemy.color;
      mctx.fillRect(enemy._x * scale, enemy._y * scale, scale, scale);
    }
  }

  // Draw player
  mctx.fillStyle = '#4488ff';
  mctx.fillRect(state.playerX * scale, state.playerY * scale, scale, scale);
}

// =============================================
// UI UPDATES
// =============================================
function updateUI() {
  const stats = getPlayerStats();
  const hp = state.hero._hp;

  // Floor
  document.getElementById('floor-indicator').textContent = `🏯 第${state.floor}层`;
  document.getElementById('hero-name-display').textContent =
    `${state.hero.emoji} ${state.hero.name}`;
  document.getElementById('level-display').textContent = `Lv.${state.level}`;

  // Stats
  const hpPct = Math.max(0, (hp / stats.maxHp) * 100);
  const xpPct = (state.xp / state.xpToNext) * 100;

  document.getElementById('stats-content').innerHTML = `
    <div class="stat-row"><span class="stat-label">生命值</span><span class="stat-value">${hp}/${stats.maxHp}</span></div>
    <div class="hp-bar-outer"><div class="hp-bar-inner" style="width:${hpPct}%"></div></div>
    <div class="stat-row"><span class="stat-label">经验值</span><span class="stat-value">${state.xp}/${state.xpToNext}</span></div>
    <div class="xp-bar-outer"><div class="xp-bar-inner" style="width:${xpPct}%"></div></div>
    <div class="stat-row"><span class="stat-label">攻击力</span><span class="stat-value">⚔️ ${stats.atk}</span></div>
    <div class="stat-row"><span class="stat-label">防御力</span><span class="stat-value">🛡️ ${stats.def}</span></div>
    <div class="stat-row"><span class="stat-label">速度</span><span class="stat-value">💨 ${stats.spd}</span></div>
    <div class="stat-row"><span class="stat-label">击杀数</span><span class="stat-value">${state.kills}</span></div>
  `;

  // Equipment display (5 slots)
  const eqDiv = document.createElement('div');
  eqDiv.style.marginTop = '4px';
  eqDiv.style.borderTop = '1px solid rgba(255,255,255,0.05)';
  eqDiv.style.paddingTop = '4px';
  const eqSlots = [
    { key: 'headwear', label: '头饰', icon: '👑' },
    { key: 'armor',    label: '衣服', icon: '🛡️' },
    { key: 'pants',    label: '裤子', icon: '👖' },
    { key: 'weapon',   label: '兵器', icon: '⚔️' },
    { key: 'mount',    label: '坐骑', icon: '🐎' },
  ];
  eqDiv.innerHTML = eqSlots.map(s => {
    const item = state.equipment[s.key];
    const name = item ? item.name : '无';
    const color = item ? item.color : '#444';
    return `<div class="equipment-row"><span class="eq-slot">${s.icon} ${s.label}</span><span class="eq-name" style="color:${color}">${name}</span></div>`;
  }).join('');
  const statsContent = document.getElementById('stats-content');
  statsContent.appendChild(eqDiv);

  // Skill
  const cdText = state.abilityCooldown > 0
    ? `<span class="skill-cooldown">冷却中: ${state.abilityCooldown}回合</span>`
    : '<span class="skill-ready">✅ 就绪 [按E使用]</span>';
  document.getElementById('skill-content').innerHTML = `
    <div class="skill-info">
      <strong>${state.hero.ability.name}</strong><br>
      ${state.hero.ability.desc}<br>
      冷却: ${state.hero.ability.cooldown}回合
    </div>
    <div>${cdText}</div>
  `;

  // Active buffs
  if (state.buffs.length > 0) {
    const buffDiv = document.createElement('div');
    buffDiv.style.marginTop = '4px';
    buffDiv.style.fontSize = '11px';
    buffDiv.style.color = '#ffd700';
    buffDiv.innerHTML = state.buffs.map(b => `${b.name}(${b.turns}回合)`).join(' | ');
    document.getElementById('skill-content').appendChild(buffDiv);
  }

  if (state.powerStrike) {
    const psDiv = document.createElement('div');
    psDiv.style.fontSize = '11px';
    psDiv.style.color = '#ff4444';
    psDiv.textContent = '⚡ 武圣就绪！';
    document.getElementById('skill-content').appendChild(psDiv);
  }

  // Inventory
  updateInventoryUI();

  // Messages
  const logDiv = document.getElementById('message-log');
  logDiv.innerHTML = state.messages.slice(0, 50).map(m =>
    `<div class="log-msg ${m.type}">[${m.turn}] ${m.text}</div>`
  ).join('');
}

function updateInventoryUI() {
  const invContent = document.getElementById('inventory-content');
  if (invContent.style.display === 'none') return;

  const consumables = state.inventory;
  if (consumables.length === 0) {
    invContent.innerHTML = '<div class="inv-empty">空空如也</div>';
    return;
  }

  invContent.innerHTML = `
    <div class="inv-section">
      <h4>消耗品 (点击使用)</h4>
      ${consumables.map((item, i) => `
        <div class="inv-item" data-inv-index="${i}" title="${item.desc}">
          <span>${item.name}</span>
          <span style="color:#888;font-size:10px;">${item.desc}</span>
        </div>
      `).join('')}
    </div>
  `;

  // Add click handlers
  invContent.querySelectorAll('.inv-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.invIndex);
      useInventoryItem(idx);
      render();
      updateUI();
    });
  });
}

// =============================================
// INPUT HANDLING
// =============================================
function handleKeyDown(e) {
  if (state.gameOver) return;

  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W':
      e.preventDefault();
      playerMove(0, -1);
      break;
    case 'ArrowDown': case 's': case 'S':
      e.preventDefault();
      playerMove(0, 1);
      break;
    case 'ArrowLeft': case 'a': case 'A':
      e.preventDefault();
      playerMove(-1, 0);
      break;
    case 'ArrowRight': case 'd': case 'D':
      e.preventDefault();
      playerMove(1, 0);
      break;
    case ' ':
      e.preventDefault();
      playerWait();
      break;
    case 'e': case 'E':
      e.preventDefault();
      useAbility();
      enemyTurn();
      updateFOV();
      render();
      updateUI();
      break;
    case 'f': case 'F':
      e.preventDefault();
      if (state.map[state.playerY] && state.map[state.playerY][state.playerX] === TILE.STAIRS) {
        descendStairs();
      } else {
        pickUpItem();
      }
      render();
      updateUI();
      break;
    case 'b': case 'B':
      e.preventDefault();
      toggleInventory();
      break;
    case '1': case '2': case '3': case '4': case '5':
    case '6': case '7': case '8': case '9':
      e.preventDefault();
      const idx = parseInt(e.key) - 1;
      if (idx < state.inventory.length) {
        useInventoryItem(idx);
        render();
        updateUI();
      }
      break;
  }
}

function toggleInventory() {
  const invContent = document.getElementById('inventory-content');
  const invToggle = document.getElementById('inv-toggle');
  if (invContent.style.display === 'none') {
    invContent.style.display = 'block';
    invToggle.textContent = '[收起]';
    updateInventoryUI();
  } else {
    invContent.style.display = 'none';
    invToggle.textContent = '[展开]';
  }
}

// =============================================
// GAME FLOW
// =============================================
function startGame(heroKey) {
  state.heroKey = heroKey;
  state.hero = deepCopy(HEROES[heroKey]);
  state.hero._hp = state.hero.hp;
  state.level = 1;
  state.xp = 0;
  state.xpToNext = 20;
  state.floor = 1;
  state.turn = 0;
  state.kills = 0;
  state.inventory = [];
  state.equipment = { headwear: null, armor: null, pants: null, weapon: null, mount: null };
  state.buffs = [];
  state.powerStrike = false;
  state.abilityCooldown = 0;
  state.gameOver = false;
  state.floorItems = [];
  state.messages = [];

  // Hide/show screens
  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'flex';
  document.getElementById('gameover-screen').style.display = 'none';
  document.getElementById('victory-screen').style.display = 'none';

  generateFloor();
  render();
  updateUI();

  addMessage(`⚔️ ${state.hero.name}（${state.hero.title}）踏上了征程！`, 'info');
  addMessage('WASD/方向键移动 | E技能 | F拾取/下楼 | B背包 | 空格等待', 'info');
}

function resetToMenu() {
  document.getElementById('title-screen').style.display = 'flex';
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('gameover-screen').style.display = 'none';
  document.getElementById('victory-screen').style.display = 'none';
  state.gameOver = true;
}

// =============================================
// INITIALIZATION
// =============================================
function init() {
  // Get canvas elements
  state.canvas = document.getElementById('game-canvas');
  state.ctx = state.canvas.getContext('2d');
  state.miniCanvas = document.getElementById('minimap-canvas');
  state.miniCtx = state.miniCanvas.getContext('2d');

  // Set minimap size
  state.miniCanvas.style.width = CFG.MAP_W * CFG.MINIMAP_SCALE + 'px';
  state.miniCanvas.style.height = CFG.MAP_H * CFG.MINIMAP_SCALE + 'px';

  // Keyboard input
  window.addEventListener('keydown', handleKeyDown);

  // Hero selection click handlers
  document.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('click', () => {
      const heroKey = card.dataset.hero;
      if (heroKey && HEROES[heroKey]) {
        startGame(heroKey);
      }
    });
  });

  // Restart buttons
  document.getElementById('restart-btn').addEventListener('click', () => {
    startGame(state.heroKey);
  });
  document.getElementById('victory-restart-btn').addEventListener('click', () => {
    startGame(state.heroKey);
  });

  // Back to menu buttons
  document.getElementById('back-to-menu-btn').addEventListener('click', resetToMenu);
  document.getElementById('victory-menu-btn').addEventListener('click', resetToMenu);

  // Inventory toggle
  document.getElementById('inv-toggle').addEventListener('click', toggleInventory);

  // Handle window resize
  window.addEventListener('resize', () => {
    if (!state.gameOver && state.hero) {
      render();
    }
  });
}

// Start!
document.addEventListener('DOMContentLoaded', init);
