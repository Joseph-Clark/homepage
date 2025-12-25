const { useState, useEffect } = React;


const initialSchedule = [
  [
    {
      date: 'Fri 12/12',
      activity: 'Workout B',
      type: 'lift',
      details: '',
      notes: '',
      completed: false,
      shoulderRehab: true,
    },
    {
      date: 'Sat 12/13',
      activity: 'Hit',
      type: 'tennis',
      details: 'Ball Machine and/or Jeff',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Sun 12/14',
      activity: 'REST DAY',
      type: 'rest',
      details: '',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Mon 12/15',
      activity: 'Active Recovery',
      type: 'active',
      details: 'Mobility/Stretching',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Tue 12/16',
      activity: 'REST DAY',
      type: 'rest',
      details: '',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Wed 12/17',
      activity: 'Tennis Clinic 5:00 PM',
      type: 'tennis',
      details: 'Advanced Live Ball (60 min)',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Thu 12/18',
      activity: 'Workout A',
      type: 'lift',
      details: '',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
  ],
  [
    {
      date: 'Fri 12/19',
      activity: 'Hit',
      type: 'tennis',
      details: 'Jeff/Jeremy or Solo',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Sat 12/20',
      activity: 'Active Recovery',
      type: 'active',
      details: 'Arm Rehab',
      notes: '',
      completed: false,
      shoulderRehab: true,
    },
    {
      date: 'Sun 12/21',
      activity: 'Tennis Clinic 12:00 PM',
      type: 'tennis',
      details: 'Adult Intermediate 3.5+',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Mon 12/22',
      activity: 'Private Lesson',
      type: 'tennis',
      details: 'Private Lesson',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Tue 12/23',
      activity: 'Workout B',
      type: 'lift',
      details: '',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Wed 12/24',
      activity: 'REST DAY',
      type: 'rest',
      details: 'Christmas Eve',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Thu 12/25',
      activity: 'REST DAY',
      type: 'rest',
      details: 'Christmas Day',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
  ],
  [
    {
      date: 'Fri 12/26',
      activity: 'Hit',
      type: 'tennis',
      details: 'Jeff/Jeremy or Solo',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Sat 12/27',
      activity: 'REST DAY',
      type: 'rest',
      details: '',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Sun 12/28',
      activity: 'Hit',
      type: 'tennis',
      details: 'Add session if available',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Mon 12/29',
      activity: 'Workout A',
      type: 'lift',
      details: '',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Tue 12/30',
      activity: 'Active Recovery',
      type: 'active',
      details: 'Mobility/Stretching',
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Wed 12/31',
      activity: 'REST DAY',
      type: 'rest',
      details: "New Year's Eve",
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
    {
      date: 'Thu 1/1',
      activity: 'REST DAY',
      type: 'rest',
      details: "New Year's Day",
      notes: '',
      completed: false,
      shoulderRehab: false,
    },
  ],
];

function TennisCalendar() {
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('tennisCalendarCycle2');
    return saved ? JSON.parse(saved) : initialSchedule;
  });

  const [selectedDay, setSelectedDay] = useState(null);
  const [editText, setEditText] = useState('');
  const [editActivity, setEditActivity] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editType, setEditType] = useState('');
  const [editShoulderRehab, setEditShoulderRehab] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  useEffect(() => {
    localStorage.setItem('tennisCalendarCycle2', JSON.stringify(schedule));
    setLastSaved(new Date());
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  }, [schedule]);

  const getActivityColor = (type) => {
    const colors = {
      tennis: 'day-card-tennis',
      lift: 'day-card-lift',
      rest: 'day-card-rest',
      active: 'day-card-active',
    };
    return colors[type] || '';
  };

  const handleDayClick = (weekIdx, dayIdx) => {
    const day = schedule[weekIdx][dayIdx];
    setSelectedDay({ weekIdx, dayIdx });
    setEditText(day.notes || '');
    setEditActivity(day.activity);
    setEditDetails(day.details);
    setEditType(day.type);
    setEditShoulderRehab(day.shoulderRehab || false);
  };

  const toggleComplete = (weekIdx, dayIdx, e) => {
    e.stopPropagation();
    const newSchedule = JSON.parse(JSON.stringify(schedule));
    newSchedule[weekIdx][dayIdx].completed =
      !newSchedule[weekIdx][dayIdx].completed;
    setSchedule(newSchedule);
  };

  const handleSaveChanges = () => {
    if (selectedDay) {
      const newSchedule = JSON.parse(JSON.stringify(schedule));
      newSchedule[selectedDay.weekIdx][selectedDay.dayIdx] = {
        ...newSchedule[selectedDay.weekIdx][selectedDay.dayIdx],
        activity: editActivity,
        details: editDetails,
        type: editType,
        notes: editText,
        shoulderRehab: editShoulderRehab,
      };
      setSchedule(newSchedule);
      setSelectedDay(null);
      setEditText('');
      setEditActivity('');
      setEditDetails('');
      setEditType('');
      setEditShoulderRehab(false);
    }
  };

  const handleCancel = () => {
    setSelectedDay(null);
    setEditText('');
    setEditActivity('');
    setEditDetails('');
    setEditType('');
    setEditShoulderRehab(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(schedule, null, 2);
    const date = new Date().toISOString().split('T')[0];
    const filename = `tennis_calendar_cycle2_backup_${date}.json`;

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setSchedule(data);
          alert('Calendar imported successfully!');
        } catch (error) {
          alert('Error importing file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the calendar?')) {
      setSchedule(initialSchedule);
      localStorage.removeItem('tennisCalendarCycle2');
      alert('Calendar reset to default!');
    }
  };

  const currentDay = selectedDay
    ? schedule[selectedDay.weekIdx][selectedDay.dayIdx]
    : null;

  const getTimeSince = () => {
    const seconds = Math.floor((new Date() - lastSaved) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  };

  const allDays = schedule.flat();
  const liftDays = allDays.filter((d) => d.type === 'lift');
  const tennisDays = allDays.filter((d) => d.type === 'tennis');
  const restDays = allDays.filter((d) => d.type === 'rest');
  const activeDays = allDays.filter((d) => d.type === 'active');
  const shoulderRehabDays = allDays.filter((d) => d.shoulderRehab);

  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'h1',
      { className: 'header-title' },
      '3-Week Workout + Tennis Schedule - Cycle 2',
    ),
    React.createElement(
      'p',
      { className: 'header-subtitle' },
      'December 12, 2025 - January 1, 2026',
    ),
    React.createElement(
      'p',
      { className: 'header-instructions' },
      'Click any day to edit • Click checkmark to mark complete',
    ),

    React.createElement(
      'div',
      { className: 'controls' },
      React.createElement(
        'div',
        { className: 'button-row' },
        React.createElement(
          'button',
          { onClick: exportData, className: 'btn btn-blue' },
          '📥 Export Backup',
        ),
        React.createElement(
          'label',
          { className: 'btn btn-green' },
          '📤 Import Backup',
          React.createElement('input', {
            type: 'file',
            accept: '.json',
            onChange: handleImport,
            style: { display: 'none' },
          }),
        ),
        React.createElement(
          'button',
          { onClick: handleReset, className: 'btn btn-red' },
          '🔄 Reset Calendar',
        ),
      ),
      React.createElement(
        'div',
        { className: 'save-status' },
        '💾 Last saved: ' + getTimeSince(),
        showSaveNotification &&
          React.createElement(
            'span',
            { className: 'save-notification' },
            '✓ Saved',
          ),
      ),
    ),

    React.createElement(
      'div',
      { className: 'legend' },
      React.createElement(
        'div',
        { className: 'legend-item' },
        React.createElement('div', { className: 'legend-box legend-tennis' }),
        'Tennis',
      ),
      React.createElement(
        'div',
        { className: 'legend-item' },
        React.createElement('div', { className: 'legend-box legend-lift' }),
        'Lift',
      ),
      React.createElement(
        'div',
        { className: 'legend-item' },
        React.createElement('div', { className: 'legend-box legend-rest' }),
        'Rest',
      ),
      React.createElement(
        'div',
        { className: 'legend-item' },
        React.createElement('div', { className: 'legend-box legend-active' }),
        'Active Recovery',
      ),
    ),

    schedule.map((week, weekIndex) =>
      React.createElement(
        'div',
        { key: weekIndex, className: 'week-container' },
        React.createElement(
          'h2',
          { className: 'week-title' },
          `Week ${weekIndex + 1}`,
        ),
        React.createElement(
          'div',
          { className: 'week-grid' },
          week.map((day, dayIndex) =>
            React.createElement(
              'div',
              {
                key: dayIndex,
                className: `day-card ${getActivityColor(day.type)}`,
                onClick: () => handleDayClick(weekIndex, dayIndex),
              },
              day.completed &&
                React.createElement(
                  'div',
                  { className: 'completed-overlay' },
                  React.createElement(
                    'div',
                    { className: 'completed-badge' },
                    '✓',
                  ),
                ),
              React.createElement(
                'button',
                {
                  className: 'complete-btn',
                  onClick: (e) => toggleComplete(weekIndex, dayIndex, e),
                },
                day.completed && '✓',
              ),
              React.createElement('div', { className: 'day-date' }, day.date),
              React.createElement(
                'div',
                { className: 'day-activity' },
                day.activity,
              ),
              day.details &&
                day.type !== 'lift' &&
                React.createElement(
                  'div',
                  { className: 'day-details' },
                  day.details,
                ),
              day.shoulderRehab &&
                React.createElement(
                  'div',
                  { className: 'shoulder-rehab-badge' },
                  '💪',
                ),
            ),
          ),
        ),
      ),
    ),

    selectedDay &&
      React.createElement(
        'div',
        { className: 'modal-overlay' },
        React.createElement(
          'div',
          { className: 'modal' },
          React.createElement(
            'h3',
            { className: 'modal-title' },
            `Edit ${currentDay.date}`,
          ),

          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { className: 'form-label' },
              'Activity Type:',
            ),
            React.createElement(
              'div',
              { className: 'type-buttons' },
              ['tennis', 'lift', 'rest', 'active'].map((type) =>
                React.createElement(
                  'button',
                  {
                    key: type,
                    onClick: () => setEditType(type),
                    className: `type-btn ${editType === type ? `type-btn-active-${type}` : ''}`,
                  },
                  type.charAt(0).toUpperCase() + type.slice(1),
                ),
              ),
            ),
          ),

          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { className: 'form-label' },
              'Activity Title:',
            ),
            React.createElement('input', {
              type: 'text',
              className: 'form-input',
              value: editActivity,
              onChange: (e) => setEditActivity(e.target.value),
              placeholder: 'e.g., Tennis Clinic 5:00 PM, Workout A',
            }),
          ),

          editType !== 'lift' &&
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement(
                'label',
                { className: 'form-label' },
                'Subtitle/Details:',
              ),
              React.createElement('input', {
                type: 'text',
                className: 'form-input',
                value: editDetails,
                onChange: (e) => setEditDetails(e.target.value),
                placeholder: 'e.g., Adult Intermediate, Private Lesson',
              }),
            ),

          (editType === 'lift' || editType === 'active') &&
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement(
                'label',
                { className: 'checkbox-label' },
                React.createElement('input', {
                  type: 'checkbox',
                  className: 'checkbox-input',
                  checked: editShoulderRehab,
                  onChange: (e) => setEditShoulderRehab(e.target.checked),
                }),
                '💪 Include Shoulder Rehab',
              ),
            ),

          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { className: 'form-label' },
              editType === 'lift' ? 'Workout Program:' : 'Notes:',
            ),
            React.createElement('textarea', {
              className: `form-textarea ${editType === 'lift' ? 'form-textarea-lift' : 'form-textarea-normal'}`,
              value: editText,
              onChange: (e) => setEditText(e.target.value),
              placeholder:
                editType === 'lift'
                  ? 'Paste workout here...'
                  : 'Add notes here...',
            }),
          ),

          React.createElement(
            'div',
            { className: 'modal-buttons' },
            React.createElement(
              'button',
              {
                onClick: handleSaveChanges,
                className: 'modal-btn modal-btn-save',
              },
              'Save Changes',
            ),
            React.createElement(
              'button',
              {
                onClick: handleCancel,
                className: 'modal-btn modal-btn-cancel',
              },
              'Cancel',
            ),
          ),
        ),
      ),

    React.createElement(
      'div',
      { className: 'summary' },
      React.createElement('h3', { className: 'summary-title' }, 'Summary'),
      React.createElement(
        'div',
        { className: 'summary-grid' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { className: 'summary-section' },
            `Lifting Sessions: ${liftDays.length}`,
          ),
          React.createElement(
            'ul',
            { className: 'summary-list' },
            liftDays.map((day, idx) =>
              React.createElement(
                'li',
                {
                  key: idx,
                  className: day.completed
                    ? 'summary-list-item-completed'
                    : 'summary-list-item',
                },
                `${day.activity} - ${day.date}${day.completed ? ' ✓' : ''}`,
              ),
            ),
          ),
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { className: 'summary-section' },
            `Tennis Sessions: ${tennisDays.length}`,
          ),
          React.createElement(
            'ul',
            { className: 'summary-list' },
            tennisDays.map((day, idx) =>
              React.createElement(
                'li',
                {
                  key: idx,
                  className: day.completed
                    ? 'summary-list-item-completed'
                    : 'summary-list-item',
                },
                `${day.activity} - ${day.date}${day.completed ? ' ✓' : ''}`,
              ),
            ),
          ),
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { className: 'summary-section' },
            `Rest & Recovery Days: ${restDays.length + activeDays.length} of 21 (${Math.round(((restDays.length + activeDays.length) / 21) * 100)}%)`,
          ),
          React.createElement(
            'p',
            { className: 'summary-subtext' },
            `Rest: ${restDays.length} | Active Recovery: ${activeDays.length}`,
          ),
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            { className: 'summary-section' },
            `Training Days: ${liftDays.length + tennisDays.length} of 21`,
          ),
          React.createElement(
            'p',
            { className: 'summary-subtext' },
            `Tennis: ${tennisDays.length} | Lifting: ${liftDays.length}`,
          ),
        ),
      ),
      React.createElement(
        'div',
        { className: 'summary-divider' },
        React.createElement(
          'p',
          { className: 'summary-subtitle' },
          'Shoulder Rehab Tracking',
        ),
        React.createElement(
          'div',
          { className: 'summary-stats' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'summary-stat-label' },
              'Total Sessions:',
            ),
            React.createElement(
              'p',
              { className: 'summary-stat-value summary-stat-value-orange' },
              shoulderRehabDays.length,
            ),
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'summary-stat-label' },
              'Completed:',
            ),
            React.createElement(
              'p',
              { className: 'summary-stat-value summary-stat-value-green' },
              shoulderRehabDays.filter((d) => d.completed).length,
            ),
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'summary-stat-label' },
              'Dates:',
            ),
            React.createElement(
              'div',
              { className: 'summary-stat-dates' },
              shoulderRehabDays.map((d) => d.date).join(', ') ||
                'None scheduled',
            ),
          ),
        ),
      ),
      React.createElement(
        'div',
        { className: 'summary-divider' },
        React.createElement(
          'p',
          { className: 'summary-subtitle' },
          'Overall Progress',
        ),
        React.createElement(
          'div',
          { className: 'summary-stats' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'summary-stat-label' },
              'Total Sessions:',
            ),
            React.createElement(
              'p',
              { className: 'summary-stat-value' },
              allDays.length,
            ),
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'summary-stat-label' },
              'Completed:',
            ),
            React.createElement(
              'p',
              { className: 'summary-stat-value summary-stat-value-green' },
              allDays.filter((d) => d.completed).length,
            ),
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'summary-stat-label' },
              'Completion Rate:',
            ),
            React.createElement(
              'p',
              { className: 'summary-stat-value summary-stat-value-blue' },
              `${Math.round((allDays.filter((d) => d.completed).length / allDays.length) * 100)}%`,
            ),
          ),
        ),
      ),
    ),
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(TennisCalendar));
