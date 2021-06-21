import React, { useState } from "react";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  RecoilRoot,
  useRecoilState,
  selector,
} from "recoil";
import {
  getId,
  todoListState,
  todoListFilterState,
  filteredTodoListState,
  todoListStatsState,
} from "./state";
import { replaceItemIndex, removeItemAtIndex } from "./util";

function App() {
  // 获取列表数据 useRecoilValue 直接取值
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      <TodoListStats />
      <TodoListFilters />
      <TodoItemCreator />
      {todoList.map((todoItem) => {
        return <TodoItem key={todoItem.id} item={todoItem}></TodoItem>;
      })}
    </>
  );
}

function TodoListStats() {
  // 获取统计数据
  const { totalNum, totalCompletedNum, totalUncompletedNum, percentCompleted } =
    useRecoilValue(todoListStatsState);
  const formattedPercentCompleted = Math.round(percentCompleted * 100);

  return (
    <ul>
      <li>总数：{totalNum}</li>
      <li>已完成数量：{totalCompletedNum}</li>
      <li>未完成数量：{totalUncompletedNum}</li>
      <li>完成占比：{percentCompleted}</li>
    </ul>
  );
}

function TodoListFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  const updateFilter = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="全部">全部</option>
        <option value="已完成">已完成</option>
        <option value="未完成">未完成</option>
      </select>
    </>
  );
}

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState("");
  // useSetRecoilState 会返回更新数据的函数
  const setTodoList = useSetRecoilState(todoListState);

  // 新增
  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      { id: getId(), text: inputValue, isComplete: false },
    ]);
    setInputValue("");
  };

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange}></input>
      <button onClick={addItem}>add</button>
    </div>
  );
}

function TodoItem({ item }) {
  // 和react的useState返回结果类似
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  // 编辑
  const editItemText = (e) => {
    const newList = replaceItemIndex(todoList, index, {
      ...item,
      text: e.target.value,
    });
    setTodoList(newList);
  };

  // 切换完成
  const toggleItemCompletion = () => {
    const newList = replaceItemIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });
    setTodoList(newList);
  };

  // 删除
  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);
    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

// 需要用 RecoilRoot 组件包裹一层
export default () => (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
