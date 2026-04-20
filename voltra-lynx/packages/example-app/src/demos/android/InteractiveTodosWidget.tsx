import { useState } from '@lynx-js/react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const initialTodos: TodoItem[] = [
  { id: '1', text: 'Review pull requests', completed: false },
  { id: '2', text: 'Update documentation', completed: true },
  { id: '3', text: 'Write unit tests', completed: false },
  { id: '4', text: 'Deploy to staging', completed: false },
  { id: '5', text: 'Team standup meeting', completed: true },
];

export function InteractiveTodosWidget() {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = completedCount / todos.length;

  return (
    <view style={{ flex: 1, padding: 16 }}>
      <text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Interactive Todos Widget
      </text>
      <text style={{ color: '#666', marginBottom: 24 }}>
        Android widget with interactive check/uncheck for todo items.
      </text>

      {/* Widget preview */}
      <view style={{
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
      }}>
        {/* Header */}
        <view style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            My Tasks
          </text>
          <text style={{ color: '#aaa', fontSize: 13 }}>
            {completedCount}/{todos.length}
          </text>
        </view>

        {/* Progress bar */}
        <view style={{
          height: 4,
          backgroundColor: '#333',
          borderRadius: 2,
          marginBottom: 16,
        }}>
          <view style={{
            width: `${progress * 100}%`,
            height: 4,
            backgroundColor: '#34C759',
            borderRadius: 2,
          }} />
        </view>

        {/* Todo list */}
        <view style={{ gap: 8 }}>
          {todos.map((todo) => (
            <view
              key={todo.id}
              bindtap={() => toggleTodo(todo.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: '#2c2c2e',
                borderRadius: 8,
                gap: 10,
              }}
            >
              {/* Checkbox */}
              <view style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: todo.completed ? '#34C759' : '#666',
                backgroundColor: todo.completed ? '#34C759' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {todo.completed && (
                  <text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</text>
                )}
              </view>

              {/* Text */}
              <text style={{
                color: todo.completed ? '#666' : '#fff',
                fontSize: 14,
                textDecorationLine: todo.completed ? 'line-through' : 'none',
                flex: 1,
              }}>
                {todo.text}
              </text>
            </view>
          ))}
        </view>
      </view>

      {/* Reset button */}
      <view
        bindtap={() => setTodos(initialTodos)}
        style={{
          backgroundColor: '#007AFF',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Reset Todos
        </text>
      </view>

      <text style={{ color: '#999', fontSize: 12, marginTop: 12 }}>
        On Android, widget interactions use PendingIntents to trigger state changes via BroadcastReceiver.
      </text>
    </view>
  );
}
