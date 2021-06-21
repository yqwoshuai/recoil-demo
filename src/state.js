import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  RecoilRoot,
  useRecoilState,
  selector,
} from "recoil";

// 数据id
let id = 0;
export function getId() {
  return id++;
}

// 数据列表
export const todoListState = atom({
  key: "todoListState",
  default: [],
});

// 数据筛选
export const todoListFilterState = atom({
  key: "todoListFilterState",
  default: "全部",
});

// 计算筛选后的数据
export const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch (filter) {
      case "已完成":
        return list.filter((item) => item.isComplete);
      case "未完成":
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});

// 计算统计数据
export const todoListStatsState = selector({
  key: "todoListStatsState",
  get: ({ get }) => {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum;

    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    };
  },
});
