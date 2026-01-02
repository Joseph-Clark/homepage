// TEST CODE - Add at the very top of app.js
console.log('=== CHECKING FIREBASE ===');
console.log('firebase available?', typeof firebase !== 'undefined');
console.log('db available?', typeof db !== 'undefined');
console.log('userId available?', typeof userId !== 'undefined');
console.log('========================');



const { useState, useEffect } = React;


const initialSchedule = [
    // Week 1: Jan 2-8, 2025
    [
        { date: 'Fri 1/2', activity: 'Workout B', type: 'lift', details: '', notes: "", completed: false, shoulderRehab: false },
        { date: 'Sat 1/3', activity: 'REST DAY', type: 'rest', details: '', notes: '', completed: false, shoulderRehab: false },
        { date: 'Sun 1/4', activity: 'Active Recovery', type: 'active', details: 'Mobility/Stretching', notes: '', completed: false, shoulderRehab: false },
        { date: 'Mon 1/5', activity: 'Workout A', type: 'lift', details: '', notes: "", completed: false, shoulderRehab: false },
        { date: 'Tue 1/6', activity: 'REST DAY', type: 'rest', details: '', notes: '', completed: false, shoulderRehab: false },
        { date: 'Wed 1/7', activity: 'Hit', type: 'tennis', details: 'Ball Machine/Hit', notes: '', completed: false, shoulderRehab: false },
        { date: 'Thu 1/8', activity: 'Tennis Lesson', type: 'tennis', details: 'Private Lesson', notes: '', completed: false, shoulderRehab: false }
    ],
    // Week 2: Jan 9-15, 2025
    [
        { date: 'Fri 1/9', activity: 'REST DAY', type: 'rest', details: '', notes: '', completed: false, shoulderRehab: false },
        { date: 'Sat 1/10', activity: 'Workout B', type: 'lift', details: '', notes: "", completed: false, shoulderRehab: false },
        { date: 'Sun 1/11', activity: 'Active Recovery', type: 'active', details: 'Mobility/Stretching', notes: '', completed: false, shoulderRehab: false },
        { date: 'Mon 1/12', activity: 'Hit', type: 'tennis', details: 'Ball Machine/Hit', notes: '', completed: false, shoulderRehab: false },
        { date: 'Tue 1/13', activity: 'Tennis Clinic 6:00 PM', type: 'tennis', details: 'Adult Intermediate (Brandon Fisher)', notes: '', completed: false, shoulderRehab: false },
        { date: 'Wed 1/14', activity: 'REST DAY', type: 'rest', details: '', notes: '', completed: false, shoulderRehab: false },
        { date: 'Thu 1/15', activity: 'Workout A', type: 'lift', details: '', notes: "", completed: false, shoulderRehab: false }
    ],
    // Week 3: Jan 16-22, 2025
    [
        { date: 'Fri 1/16', activity: 'Hit', type: 'tennis', details: 'Ball Machine/Hit', notes: '', completed: false, shoulderRehab: false },
        { date: 'Sat 1/17', activity: 'REST DAY', type: 'rest', details: '', notes: '', completed: false, shoulderRehab: false },
        { date: 'Sun 1/18', activity: 'Tennis Clinic 12:00 PM', type: 'tennis', details: 'Adult Intermediate 3.5+ (Evan Abbott)', notes: '', completed: false, shoulderRehab: false },
        { date: 'Mon 1/19', activity: 'Hit', type: 'tennis', details: 'Ball Machine/Hit', notes: '', completed: false, shoulderRehab: false },
        { date: 'Tue 1/20', activity: 'Tennis Clinic 6:00 PM', type: 'tennis', details: 'Adult Intermediate (Brandon Fisher)', notes: '', completed: false, shoulderRehab: false },
        { date: 'Wed 1/21', activity: 'Workout B', type: 'lift', details: '', notes: "", completed: false, shoulderRehab: false },
        { date: 'Thu 1/22', activity: 'REST DAY', type: 'rest', details: '', notes: '', completed: false, shoulderRehab: false }
    ]
];


function TennisCalendar() {
    const [schedule, setSchedule] = useState(initialSchedule);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [editText, setEditText] = useState('');
    const [editActivity, setEditActivity] = useState('');
    const [editDetails, setEditDetails] = useState('');
    const [editType, setEditType] = useState('');
    const [editShoulderRehab, setEditShoulderRehab] = useState(false);
    const [lastSaved, setLastSaved] = useState(new Date());
    const [showSaveNotification, setShowSaveNotification] = useState(false);
    const [syncStatus, setSyncStatus] = useState('Synced');

    // Load data from Firebase on mount
    useEffect(() => {
        loadFromFirebase();
    }, []);

    // Save to Firebase whenever schedule changes
    useEffect(() => {
        if (!loading) {
            saveToFirebase();
        }
    }, [schedule]);

const loadFromFirebase = async () => {
    try {
        setSyncStatus('Loading...');
        
        // Load from the SHARED document
        const docRef = db.collection('calendars').doc(CALENDAR_DOC_ID);
        const doc = await docRef.get();
        
        if (doc.exists) {
            const data = doc.data();
            
            // Reconstruct the nested array structure from flat data
            const reconstructedSchedule = [[], [], []]; // 3 weeks
            data.schedule.forEach(day => {
                reconstructedSchedule[day.weekIndex][day.dayIndex] = day;
            });
            
            setSchedule(reconstructedSchedule);
            setSyncStatus('Synced');
        } else {
            // First time - save initial schedule
            await saveToFirebase();
        }
        setLoading(false);
    } catch (error) {
        console.error('Error loading from Firebase:', error);
        setSyncStatus('Error loading');
        setLoading(false);
    }
};



const saveToFirebase = async () => {
    try {
        setSyncStatus('Saving...');
        
        // Flatten the schedule for Firebase (it doesn't support nested arrays)
        const flatSchedule = schedule.flat().map((day, index) => ({
            ...day,
            weekIndex: Math.floor(index / 7),
            dayIndex: index % 7
        }));
        
        // Save to the SHARED document (not user-specific)
        await db.collection('calendars').doc(CALENDAR_DOC_ID).set({
            schedule: flatSchedule,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        setLastSaved(new Date());
        setSyncStatus('Synced ✓');
        setShowSaveNotification(true);
        setTimeout(() => {
            setShowSaveNotification(false);
            setSyncStatus('Synced');
        }, 2000);
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        setSyncStatus('Error saving');
    }
};



    const getActivityColor = (type) => {
        const colors = {
            tennis: 'day-card-tennis',
            lift: 'day-card-lift',
            rest: 'day-card-rest',
            active: 'day-card-active'
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
        newSchedule[weekIdx][dayIdx].completed = !newSchedule[weekIdx][dayIdx].completed;
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
                shoulderRehab: editShoulderRehab
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

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset the calendar? This will delete all your data.')) {
            setSchedule(initialSchedule);
            await saveToFirebase();
            alert('Calendar reset to default!');
        }
    };

    const currentDay = selectedDay ? schedule[selectedDay.weekIdx][selectedDay.dayIdx] : null;

    const getTimeSince = () => {
        const seconds = Math.floor((new Date() - lastSaved) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    };

    if (loading) {
        return React.createElement('div', { className: 'container', style: { textAlign: 'center', padding: '50px' } },
            React.createElement('h2', null, 'Loading your calendar...'),
            React.createElement('p', null, 'Syncing from cloud ☁️')
        );
    }

    const allDays = schedule.flat();
    const liftDays = allDays.filter(d => d.type === 'lift');
    const tennisDays = allDays.filter(d => d.type === 'tennis');
    const restDays = allDays.filter(d => d.type === 'rest');
    const activeDays = allDays.filter(d => d.type === 'active');
    const shoulderRehabDays = allDays.filter(d => d.shoulderRehab);

    return React.createElement('div', { className: 'container' },
        React.createElement('h1', { className: 'header-title' }, '3-Week Workout + Tennis Schedule - Cycle 3'),
        React.createElement('p', { className: 'header-subtitle' }, 'January 2 - January 22, 2025'),
        React.createElement('p', { className: 'header-instructions' }, 'Click any day to edit • Click checkmark to mark complete'),
        
        React.createElement('div', { className: 'controls' },
            React.createElement('div', { className: 'button-row' },
                React.createElement('button', { onClick: exportData, className: 'btn btn-blue' }, '📥 Export Backup'),
                React.createElement('label', { className: 'btn btn-green' },
                    '📤 Import Backup',
                    React.createElement('input', { type: 'file', accept: '.json', onChange: handleImport, style: { display: 'none' } })
                ),
                React.createElement('button', { onClick: handleReset, className: 'btn btn-red' }, '🔄 Reset Calendar')
            ),
            React.createElement('div', { className: 'save-status' },
                `☁️ ${syncStatus} • Last saved: ${getTimeSince()}`,
                showSaveNotification && React.createElement('span', { className: 'save-notification' }, ' ✓')
            )
        ),

        React.createElement('div', { className: 'legend' },
            React.createElement('div', { className: 'legend-item' },
                React.createElement('div', { className: 'legend-box legend-tennis' }),
                'Tennis'
            ),
            React.createElement('div', { className: 'legend-item' },
                React.createElement('div', { className: 'legend-box legend-lift' }),
                'Lift'
            ),
            React.createElement('div', { className: 'legend-item' },
                React.createElement('div', { className: 'legend-box legend-rest' }),
                'Rest'
            ),
            React.createElement('div', { className: 'legend-item' },
                React.createElement('div', { className: 'legend-box legend-active' }),
                'Active Recovery'
            )
        ),

        schedule.map((week, weekIndex) =>
            React.createElement('div', { key: weekIndex, className: 'week-container' },
                React.createElement('h2', { className: 'week-title' }, `Week ${weekIndex + 1}`),
                React.createElement('div', { className: 'week-grid' },
                    week.map((day, dayIndex) =>
                        React.createElement('div', {
                            key: dayIndex,
                            className: `day-card ${getActivityColor(day.type)}`,
                            onClick: () => handleDayClick(weekIndex, dayIndex)
                        },
                            day.completed && React.createElement('div', { className: 'completed-overlay' },
                                React.createElement('div', { className: 'completed-badge' }, '✓')
                            ),
                            React.createElement('button', {
                                className: 'complete-btn',
                                onClick: (e) => toggleComplete(weekIndex, dayIndex, e)
                            }, day.completed && '✓'),
                            React.createElement('div', { className: 'day-date' }, day.date),
                            React.createElement('div', { className: 'day-activity' }, day.activity),
                            day.details && day.type !== 'lift' && React.createElement('div', { className: 'day-details' }, day.details),
                            day.shoulderRehab && React.createElement('div', { className: 'shoulder-rehab-badge' }, '💪')
                        )
                    )
                )
            )
        ),

        selectedDay && React.createElement('div', { className: 'modal-overlay' },
            React.createElement('div', { className: 'modal' },
                React.createElement('h3', { className: 'modal-title' }, `Edit ${currentDay.date}`),
                
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Activity Type:'),
                    React.createElement('div', { className: 'type-buttons' },
                        ['tennis', 'lift', 'rest', 'active'].map(type =>
                            React.createElement('button', {
                                key: type,
                                onClick: () => setEditType(type),
                                className: `type-btn ${editType === type ? `type-btn-active-${type}` : ''}`
                            }, type.charAt(0).toUpperCase() + type.slice(1))
                        )
                    )
                ),

                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Activity Title:'),
                    React.createElement('input', {
                        type: 'text',
                        className: 'form-input',
                        value: editActivity,
                        onChange: (e) => setEditActivity(e.target.value),
                        placeholder: 'e.g., Tennis Clinic 5:00 PM, Workout A'
                    })
                ),

                editType !== 'lift' && React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Subtitle/Details:'),
                    React.createElement('input', {
                        type: 'text',
                        className: 'form-input',
                        value: editDetails,
                        onChange: (e) => setEditDetails(e.target.value),
                        placeholder: 'e.g., Adult Intermediate, Private Lesson'
                    })
                ),

                (editType === 'lift' || editType === 'active') && React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'checkbox-label' },
                        React.createElement('input', {
                            type: 'checkbox',
                            className: 'checkbox-input',
                            checked: editShoulderRehab,
                            onChange: (e) => setEditShoulderRehab(e.target.checked)
                        }),
                        '💪 Include Shoulder Rehab'
                    )
                ),

                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, editType === 'lift' ? 'Workout Program:' : 'Notes:'),
                    React.createElement('textarea', {
                        className: `form-textarea ${editType === 'lift' ? 'form-textarea-lift' : 'form-textarea-normal'}`,
                        value: editText,
                        onChange: (e) => setEditText(e.target.value),
                        placeholder: editType === 'lift' ? 'Paste workout here...' : 'Add notes here...'
                    })
                ),

                React.createElement('div', { className: 'modal-buttons' },
                    React.createElement('button', { onClick: handleSaveChanges, className: 'modal-btn modal-btn-save' }, 'Save Changes'),
                    React.createElement('button', { onClick: handleCancel, className: 'modal-btn modal-btn-cancel' }, 'Cancel')
                )
            )
        ),

        React.createElement('div', { className: 'summary' },
            React.createElement('h3', { className: 'summary-title' }, 'Summary'),
            React.createElement('div', { className: 'summary-grid' },
                React.createElement('div', null,
                    React.createElement('p', { className: 'summary-section' }, `Lifting Sessions: ${liftDays.length}`),
                    React.createElement('ul', { className: 'summary-list' },
                        liftDays.map((day, idx) =>
                            React.createElement('li', {
                                key: idx,
                                className: day.completed ? 'summary-list-item-completed' : 'summary-list-item'
                            }, `${day.activity} - ${day.date}${day.completed ? ' ✓' : ''}`)
                        )
                    )
                ),
                React.createElement('div', null,
                    React.createElement('p', { className: 'summary-section' }, `Tennis Sessions: ${tennisDays.length}`),
                    React.createElement('ul', { className: 'summary-list' },
                        tennisDays.map((day, idx) =>
                            React.createElement('li', {
                                key: idx,
                                className: day.completed ? 'summary-list-item-completed' : 'summary-list-item'
                            }, `${day.activity} - ${day.date}${day.completed ? ' ✓' : ''}`)
                        )
                    )
                ),
                React.createElement('div', null,
                    React.createElement('p', { className: 'summary-section' },
                        `Rest & Recovery Days: ${restDays.length + activeDays.length} of 21 (${Math.round(((restDays.length + activeDays.length) / 21) * 100)}%)`
                    ),
                    React.createElement('p', { className: 'summary-subtext' }, `Rest: ${restDays.length} | Active Recovery: ${activeDays.length}`)
                ),
                React.createElement('div', null,
                    React.createElement('p', { className: 'summary-section' }, `Training Days: ${liftDays.length + tennisDays.length} of 21`),
                    React.createElement('p', { className: 'summary-subtext' }, `Tennis: ${tennisDays.length} | Lifting: ${liftDays.length}`)
                )
            ),
            React.createElement('div', { className: 'summary-divider' },
                React.createElement('p', { className: 'summary-subtitle' }, 'Shoulder Rehab Tracking'),
                React.createElement('div', { className: 'summary-stats' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'summary-stat-label' }, 'Total Sessions:'),
                        React.createElement('p', { className: 'summary-stat-value summary-stat-value-orange' }, shoulderRehabDays.length)
                    ),
                    React.createElement('div', null,
                        React.createElement('p', { className: 'summary-stat-label' }, 'Completed:'),
                        React.createElement('p', { className: 'summary-stat-value summary-stat-value-green' },
                            shoulderRehabDays.filter(d => d.completed).length
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('p', { className: 'summary-stat-label' }, 'Dates:'),
                        React.createElement('div', { className: 'summary-stat-dates' },
                            shoulderRehabDays.map(d => d.date).join(', ') || 'None scheduled'
                        )
                    )
                )
            ),
            React.createElement('div', { className: 'summary-divider' },
                React.createElement('p', { className: 'summary-subtitle' }, 'Overall Progress'),
                React.createElement('div', { className: 'summary-stats' },
                    React.createElement('div', null,
                        React.createElement('p', { className: 'summary-stat-label' }, 'Total Sessions:'),
                        React.createElement('p', { className: 'summary-stat-value' }, allDays.length)
                    ),
                    React.createElement('div', null,
                        React.createElement('p', { className: 'summary-stat-label' }, 'Completed:'),
                        React.createElement('p', { className: 'summary-stat-value summary-stat-value-green' },
                            allDays.filter(d => d.completed).length
                        )
                    ),
                    React.createElement('div', null,
                        React.createElement('p', { className: 'summary-stat-label' }, 'Completion Rate:'),
                        React.createElement('p', { className: 'summary-stat-value summary-stat-value-blue' },
                            `${Math.round((allDays.filter(d => d.completed).length / allDays.length) * 100)}%`
                        )
                    )
                )
            )
        )
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(TennisCalendar));