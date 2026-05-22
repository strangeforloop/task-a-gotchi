// task-list.jsx — Task row + list components

function CheckCircle({ checked, color = '#378ADD', onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 26, height: 26, borderRadius: '50%',
      border: `2px solid ${checked ? color : 'rgba(60,60,67,0.22)'}`,
      background: checked ? color : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, padding: 0, cursor: 'pointer',
      transition: 'all 180ms cubic-bezier(.3,.7,.4,1)',
    }}>
      {checked && (
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M3 7.2 5.8 10 11 4.2" fill="none" stroke="#fff"
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function TaskRow({ task, onToggle }) {
  const isOverdue = task.overdue && !task.completed;
  const sourceDot = task.source === 'template' ? '#7F77DD' : '#1D9E75';

  return (
    <div style={{
      position: 'relative',
      background: task.completed ? '#EAF3DE' : isOverdue ? '#FAECE7' : '#fff',
      borderRadius: 14,
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 1px 2px rgba(20,15,5,0.04), 0 0 0 0.5px rgba(20,15,5,0.06)',
      transition: 'background 200ms ease, opacity 240ms ease, transform 240ms ease',
      opacity: task.completed ? 0.62 : 1,
    }}>
      <CheckCircle
        checked={task.completed}
        color={isOverdue ? '#D85A30' : task.completed ? '#639922' : '#378ADD'}
        onClick={() => onToggle(task.id)}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {/* source dot */}
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: sourceDot, flexShrink: 0,
          }} />
          <span style={{
            fontSize: 16, fontWeight: 500, letterSpacing: -0.2,
            color: task.completed ? 'rgba(60,60,67,0.55)' : '#1a1a1a',
            textDecoration: task.completed ? 'line-through' : 'none',
            textDecorationColor: 'rgba(60,60,67,0.4)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{task.title}</span>
        </div>
        {isOverdue && (
          <div style={{
            marginTop: 4, marginLeft: 14,
            fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
            color: '#D85A30',
            textTransform: 'uppercase',
          }}>
            Overdue · from {task.overdueFrom}
          </div>
        )}
      </div>
      {isOverdue && (
        <div style={{
          padding: '4px 8px', borderRadius: 6,
          background: 'rgba(216,90,48,0.12)',
          color: '#D85A30',
          fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
          textTransform: 'uppercase',
          border: '0.5px solid rgba(216,90,48,0.3)',
        }}>
          −{task.overduePoints}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children, color = 'rgba(60,60,67,0.55)' }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 1,
      textTransform: 'uppercase', color,
      padding: '0 4px',
    }}>{children}</div>
  );
}

function TaskList({ tasks, onToggle }) {
  const overdue = tasks.filter(t => t.overdue && !t.completed);
  const today = tasks.filter(t => !t.overdue);
  const completedCount = today.filter(t => t.completed).length;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: '4px 16px 100px',
    }}>
      {overdue.length > 0 && (
        <>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginTop: 6,
          }}>
            <SectionLabel color="#D85A30">⚠ Overdue · {overdue.length}</SectionLabel>
            <span style={{
              fontSize: 11, color: '#D85A30', fontWeight: 600,
            }}>
              −{overdue.reduce((s, t) => s + t.overduePoints, 0)} health
            </span>
          </div>
          {overdue.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </>
      )}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginTop: overdue.length ? 10 : 6,
      }}>
        <SectionLabel>Today · Thu Apr 23</SectionLabel>
        <span style={{
          fontSize: 11, color: 'rgba(60,60,67,0.55)', fontWeight: 600,
        }}>
          {completedCount}/{today.length}
        </span>
      </div>
      {today.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
    </div>
  );
}

Object.assign(window, { TaskList, TaskRow, CheckCircle, SectionLabel });
