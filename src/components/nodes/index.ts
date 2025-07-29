import NoteNode from './NoteNode';
import TaskNode from './TaskNode';
import ScheduleNode from './ScheduleNode';
import GoalNode from './GoalNode';
import RoutineNode from './RoutineNode';
import IdeaNode from './IdeaNode';
import LinkNode from './LinkNode';
import ClusterNode from './ClusterNode';
import DiagramNode from './DiagramNode';

export const nodeTypes = {
  note: NoteNode,
  task: TaskNode,
  schedule: ScheduleNode,
  goal: GoalNode,
  routine: RoutineNode,
  idea: IdeaNode,
  link: LinkNode,
  cluster: ClusterNode,
  rect: DiagramNode,
  circle: DiagramNode,
  diamond: DiagramNode,
  server: DiagramNode,
  database: DiagramNode,
  cloud: DiagramNode,
};