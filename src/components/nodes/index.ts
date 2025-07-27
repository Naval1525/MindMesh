import NoteNode from './NoteNode';
import TaskNode from './TaskNode';
import ScheduleNode from './ScheduleNode';
import GoalNode from './GoalNode';
import RoutineNode from './RoutineNode';
import IdeaNode from './IdeaNode';
import LinkNode from './LinkNode';

export const nodeTypes = {
  note: NoteNode,
  task: TaskNode,
  schedule: ScheduleNode,
  goal: GoalNode,
  routine: RoutineNode,
  idea: IdeaNode,
  link: LinkNode,
};