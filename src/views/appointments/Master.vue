<template>
  <div class="list-panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <h3>预约列表</h3>
      </div>
      <span class="panel-count">{{ appointments.length }} 条预约</span>
    </div>
    <ul class="item-list" role="listbox" aria-label="预约列表">
      <li
        v-for="item in appointments"
        :key="item.id"
        :class="{ active: selectedId === item.id }"
        :aria-selected="selectedId === item.id"
        role="option"
        tabindex="0"
        @click="selectItem(item)"
        @keydown.enter="selectItem(item)"
        @keydown.space.prevent="selectItem(item)"
      >
        <div class="item-icon" :class="item.status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="item-content">
          <span class="item-name">{{ item.patientName }}</span>
          <span class="item-sub">{{ item.time }} · {{ item.doctor }}</span>
        </div>
        <span class="status-badge" :class="item.status">{{ statusText(item.status) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const appointments = ref([
  { id: 1, patientName: '张三', doctor: '王主任', time: '09:00', status: 'confirmed' },
  { id: 2, patientName: '李四', doctor: '任神经', time: '10:30', status: 'pending' },
  { id: 3, patientName: '王五', doctor: '李医生', time: '14:00', status: 'confirmed' },
  { id: 4, patientName: '赵六', doctor: '张专家', time: '15:30', status: 'cancelled' },
  { id: 5, patientName: '孙七', doctor: '陈医师', time: '16:00', status: 'pending' },
]);

const selectedId = computed(() => {
  return route.params.appointmentId ? parseInt(route.params.appointmentId) : null;
});

function selectItem(item) {
  router.push(`/appointments/${item.id}`);
}

function statusText(status) {
  const map = { confirmed: '已确认', pending: '待确认', cancelled: '已取消' };
  return map[status] || status;
}
</script>

<style scoped>
.list-panel {
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

.panel-count {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg);
  padding: 4px 10px;
  border-radius: var(--radius-md);
  font-weight: 500;
}

.item-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  flex: 1;
  overflow-y: auto;
}

.item-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text);
  transition: all var(--transition-fast);
  margin-bottom: 4px;
}

.item-list li:hover {
  background: var(--bg-subtle);
}

.item-list li:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: -2px;
}

.item-list li.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.item-icon.confirmed { background: var(--success-light); }
.item-icon.pending { background: var(--warning-light); }
.item-icon.cancelled { background: var(--error-light); }

.item-icon svg {
  width: 20px;
  height: 20px;
}

.item-icon.confirmed svg { color: var(--success); }
.item-icon.pending svg { color: var(--warning); }
.item-icon.cancelled svg { color: var(--error); }

.item-list li.active .item-icon {
  background: rgba(255, 255, 255, 0.2);
}

.item-list li.active .item-icon svg {
  color: #fff;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.item-list li.active .item-sub {
  color: rgba(255, 255, 255, 0.8);
}

.status-badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  flex-shrink: 0;
}

.status-badge.confirmed {
  background: var(--success-light);
  color: var(--success-dark);
}

.status-badge.pending {
  background: var(--warning-light);
  color: var(--warning-dark);
}

.status-badge.cancelled {
  background: var(--error-light);
  color: var(--error-dark);
}

.item-list li.active .status-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
</style>
