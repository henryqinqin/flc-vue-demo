<template>
  <div class="schedule-panel">
    <!-- Panel Header -->
    <div class="panel-header">
      <div class="panel-title">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <h3>排班管理</h3>
      </div>
      <div class="week-nav">
        <button
          class="nav-btn"
          :class="{ disabled: weekOffset <= -4 }"
          :disabled="weekOffset <= -4"
          @click="prevWeek"
          aria-label="上一周"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          上周
        </button>
        <button class="nav-btn current" @click="weekOffset = 0" aria-label="返回本周">本周</button>
        <button
          class="nav-btn"
          :class="{ disabled: weekOffset >= 4 }"
          :disabled="weekOffset >= 4"
          @click="nextWeek"
          aria-label="下一周"
        >
          下周
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Schedule Table -->
    <div class="schedule-table-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th class="time-col">时间</th>
            <th v-for="day in weekDays" :key="day.date" :class="{ today: day.isToday }">
              <div class="day-header">
                <span class="date">{{ day.date }}</span>
                <span class="weekday">{{ day.weekday }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in timeSlots" :key="slot.time">
            <td class="time-col">{{ slot.label }}</td>
            <td
              v-for="day in weekDays"
              :key="day.date"
              class="schedule-cell"
              :class="{ today: day.isToday }"
              @click="handleCellClick(day, slot)"
            >
              <div
                v-if="getSchedule(day.date, slot.time)"
                class="schedule-item"
              >
                <span class="doctor-name">{{ getSchedule(day.date, slot.time).doctor }}</span>
                <button class="remove-btn" @click.stop="removeSchedule(day.date, slot.time)" title="移除">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div v-else class="empty-slot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const diseaseId = computed(() => route.params.diseaseId);
const deptId = computed(() => route.params.deptId);

// Current week offset (0 = this week)
const weekOffset = ref(0);

// Generate week days based on current date
const weekDays = computed(() => {
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}/${today.getDate()}`;
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + (weekOffset.value * 7));

  const days = [];
  const weekdayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    days.push({
      date: dateStr,
      weekday: weekdayNames[i],
      fullDate: date.toISOString().split('T')[0],
      isToday: dateStr === todayStr && weekOffset.value === 0,
    });
  }

  return days;
});

// Time slots
const timeSlots = ref([
  { time: '08:00', label: '8:00-9:00' },
  { time: '09:00', label: '9:00-10:00' },
  { time: '10:00', label: '10:00-11:00' },
  { time: '11:00', label: '11:00-12:00' },
  { time: '12:00', label: '12:00-13:00' },
  { time: '13:00', label: '13:00-14:00' },
  { time: '14:00', label: '14:00-15:00' },
  { time: '15:00', label: '15:00-16:00' },
  { time: '16:00', label: '16:00-17:00' },
  { time: '17:00', label: '17:00-18:00' },
]);

// Demo schedule data
const schedules = ref({
  '2/3_10:00': { doctor: '任神经' },
  '2/4_14:00': { doctor: '王主任' },
  '2/5_09:00': { doctor: '李医生' },
  '2/6_10:00': { doctor: '张专家' },
  '2/7_15:00': { doctor: '陈医师' },
});

function getSchedule(date, time) {
  const key = `${date}_${time}`;
  return schedules.value[key];
}

function removeSchedule(date, time) {
  const key = `${date}_${time}`;
  delete schedules.value[key];
}

function handleCellClick(day, slot) {
  const key = `${day.date}_${slot.time}`;
  if (!schedules.value[key]) {
    const doctors = ['任神经', '王主任', '李医生', '张专家', '陈医师', '刘医生', '周主任', '吴医生'];
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    schedules.value[key] = { doctor: randomDoctor };
  }
}

function prevWeek() {
  if (weekOffset.value > -4) {
    weekOffset.value--;
  }
}

function nextWeek() {
  if (weekOffset.value < 4) {
    weekOffset.value++;
  }
}
</script>

<style scoped>
.schedule-panel {
  height: 100%;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.week-nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  background: var(--bg);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  min-height: 44px;
}

.nav-btn svg {
  width: 16px;
  height: 16px;
}

.nav-btn:hover:not(.disabled) {
  background: var(--bg-subtle);
  border-color: var(--primary-light);
  color: var(--text);
}

.nav-btn:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: 2px;
}

.nav-btn.current {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.nav-btn.current:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #065F69 100%);
}

.nav-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.schedule-table-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 800px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.schedule-table th,
.schedule-table td {
  border: 1px solid var(--border);
  padding: 0;
  text-align: center;
  vertical-align: middle;
}

.schedule-table th {
  background: var(--bg-subtle);
  font-weight: 600;
  color: var(--text);
  height: 60px;
}

.schedule-table th:first-child {
  border-top-left-radius: var(--radius-lg);
}

.schedule-table th:last-child {
  border-top-right-radius: var(--radius-lg);
}

.schedule-table th.today {
  background: var(--primary-100);
}

.day-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
}

.day-header .date {
  font-weight: 700;
  color: var(--text);
  font-size: 15px;
}

.day-header .weekday {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.time-col {
  width: 100px;
  background: var(--bg-subtle);
  font-weight: 600;
  color: var(--text);
  padding: 14px 10px;
}

.schedule-cell {
  min-width: 110px;
  height: 56px;
  cursor: pointer;
  position: relative;
  transition: all var(--transition-fast);
  background: var(--bg);
}

.schedule-cell:hover {
  background: var(--bg-subtle);
}

.schedule-cell.today {
  background: var(--primary-50);
}

.schedule-cell.today:hover {
  background: var(--primary-100);
}

.schedule-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--success-light);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.schedule-item:hover {
  background: #BBF7D0;
  border-color: var(--success);
}

.doctor-name {
  color: var(--success-dark);
  font-size: 13px;
  font-weight: 600;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--success-dark);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.remove-btn svg {
  width: 14px;
  height: 14px;
}

.remove-btn:hover {
  background: var(--error-light);
  color: var(--error);
}

.remove-btn:focus-visible {
  outline: 2px solid var(--error);
  outline-offset: 1px;
}

.empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.empty-slot svg {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

.schedule-cell:hover .empty-slot {
  opacity: 0.6;
}
</style>
