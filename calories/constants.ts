
import { Difficulty } from './types';

export const DIFFICULTIES: Difficulty[] = [
  { id: '1', label: '失业/迷茫', command: 'run career_fix.sh', localResponse: '每一次跌倒都是为了更有力的弹跳。职业生涯是一场马拉松，暂时的停歇是为了校准方向。' },
  { id: '2', label: '失恋', command: 'rm -rf heartbreak.log', localResponse: '懂得爱自己，是终身浪漫的开始。旧的不去，新的不来，最适合你的人正在路上。' },
  { id: '3', label: '孤独', command: 'connect localhost:alone', localResponse: '孤独是灵魂的增肌期。在无人问津的日子里，你正在长出更坚韧的翅膀。' },
  { id: '4', label: '焦虑', command: 'kill -9 anxiety_process', localResponse: '焦虑是对未来的透支，而当下才是唯一真实的领地。深呼吸，世界依然在你手中。' },
  { id: '5', label: '贫穷', command: 'sudo mount /dev/wealth', localResponse: '暂时的窘迫不代表永恒的匮乏。你的才华和勤奋是这世界上最坚挺的货币。' },
  { id: '6', label: '拖延', command: 'exec start_now', localResponse: '种一棵树最好的时间是十年前，其次是现在。哪怕只走出一小步，也胜过在原地踏步。' },
  { id: '7', label: '否定', command: 'chmod 777 self_confidence', localResponse: '别人眼中的你只是倒影，真正的你由你自己定义。你是这世上独一无二的奇迹。' },
  { id: '8', label: '压力', command: 'decompress --force burden', localResponse: '压力是把铁变成钢的温度。适时的放松不是逃避，而是为了更持久的战斗。' },
  { id: '9', label: '平庸', command: 'upgrade --life-quality', localResponse: '接受平凡但不接受平庸。在平凡的岗位上做到极致，本身就是一种伟大的跨越。' },
  { id: '10', label: '误解', command: 'ping feedback.server', localResponse: '知我者谓我心忧，不知我者谓我何求。你不需要向全世界解释，时间会替你温柔发声。' },
];

export const SYSTEM_ASCII = `
 ██████╗ █████╗ ██╗      ██████╗ ██████╗ ██╗███████╗███████╗
██╔════╝██╔══██╗██║     ██╔═══██╗██╔══██╗██║██╔════╝██╔════╝
██║     ███████║██║     ██║   ██║██████╔╝██║█████╗  ███████╗
██║     ██╔══██║██║     ██║   ██║██╔══██╗██║██╔══╝  ╚════██║
╚██████╗██║  ██║███████╗╚██████╔╝██║  ██║██║███████╗███████║
 ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
`;
