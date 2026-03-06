import fs from 'fs';
import path from 'path';
import { Milestone, Update, TeamMember, LayerGroup, Achievement } from '@/types';

// 定义数据目录
const DATA_DIR = path.join(process.cwd(), 'src/data');

// 通用读取函数：读取指定目录下所有JSON文件并合并
function readJsonFiles<T>(subDir: string): T[] {
  const dirPath = path.join(DATA_DIR, subDir);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);
  const data: T[] = [];

  files.forEach(file => {
    // Skip files starting with underscore (templates/drafts) or not .json
    if (path.extname(file) === '.json' && !file.startsWith('_')) {
      try {
        const filePath = path.join(dirPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        
        // 如果是数组，解构push；如果是对象，直接push
        if (Array.isArray(jsonData)) {
          // 为数组中的每个对象添加id（如果未提供，使用文件名+索引作为id）
          const itemsWithId = jsonData.map((item, index) => {
             if (!item.id) {
               return { ...item, id: `${path.basename(file, '.json')}_${index}` };
             }
             return item;
          });
          data.push(...itemsWithId);
        } else {
          // 为对象添加id（如果未提供，使用文件名作为id）
          if (!jsonData.id) {
            jsonData.id = path.basename(file, '.json');
          }
          data.push(jsonData);
        }
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
  });

  return data;
}

// 1. 获取所有里程碑
export function getMilestones(): Milestone[] {
  const milestones = readJsonFiles<Milestone>('milestones');
  // 按日期倒序排列
  return milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 2. 获取所有双周进展
export function getUpdates(): Update[] {
  const updates = readJsonFiles<Update>('updates');
  // 按日期倒序排列 (假设日期格式为 "YYYY.MM.DD - ...")
  return updates.sort((a, b) => {
    const dateA = a.date.split(' - ')[0].replace(/\./g, '-');
    const dateB = b.date.split(' - ')[0].replace(/\./g, '-');
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

// 3. 获取所有成果（按层级分组）
export function getAchievements(): LayerGroup[] {
  const rawAchievements = readJsonFiles<Achievement & { layer: string }>('achievements');
  
  // 定义层级结构模板
  const layers: LayerGroup[] = [
    {
      id: "layer03",
      label: "红外测温产业",
      levelName: "示范层",
      color: "primary",
      headerStyle: "bg-primary text-primary-foreground",
      items: [],
    },
    {
      id: "layer02",
      label: "传感行业",
      levelName: "行业层",
      color: "secondary",
      headerStyle: "bg-background text-foreground border-b border-black/10",
      items: [],
    },
    {
      id: "layer01",
      label: "AI能力及协同环境",
      levelName: "基础层",
      color: "accent",
      headerStyle: "bg-foreground text-background",
      items: [],
    },
    {
      id: "layer00",
      label: "未来探索",
      levelName: "未来探索",
      color: "accent",
      headerStyle: "bg-muted text-muted-foreground",
      items: [],
    },
  ];

  // 将扁平的成果数据分配到对应层级
  rawAchievements.forEach(item => {
    const targetLayer = layers.find(l => l.levelName === item.layer);
    if (targetLayer) {
      // 移除临时的 layer 属性，保留 Achievement 类型所需的属性
      const { layer, ...achievementData } = item;
      targetLayer.items.push(achievementData as Achievement);
    }
  });

  // 过滤掉没有项目的层级
  return layers.filter(layer => layer.items.length > 0);
}

// 4. 获取所有生产力成员
export function getTeamMembers(): TeamMember[] {
  const members = readJsonFiles<TeamMember>('team');
  
  // 定义特定的排序顺序
  const order = [
    "晨冲冲", 
    "TRAE", 
    "DeepSeek", 
    "豆包", 
    "StellarFlow", 
    "飞书", 
    "IMA", 
    "Coze", 
    "剪映", 
    "协作伙伴"
  ];
  
  return members.sort((a, b) => {
    const indexA = order.indexOf(a.name);
    const indexB = order.indexOf(b.name);
    // 如果都在列表里，按列表顺序
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // 如果a在列表里，a排前面
    if (indexA !== -1) return -1;
    // 如果b在列表里，b排前面
    if (indexB !== -1) return 1;
    // 都不在列表里，按名称排序
    return a.name.localeCompare(b.name);
  });
}
