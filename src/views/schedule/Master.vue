<template>
  <div class="department-panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 21h18"/>
          <path d="M5 21V7l8-4v18"/>
          <path d="M19 21V11l-6-4"/>
        </svg>
        <h3>科室列表</h3>
      </div>
      <span class="panel-count">{{ departments.length }} 个科室</span>
    </div>
    <ul class="department-list" role="listbox" aria-label="科室列表">
      <li
        v-for="dept in departments"
        :key="dept.id"
        :class="{ active: selectedDeptId === dept.id }"
        :aria-selected="selectedDeptId === dept.id"
        role="option"
        tabindex="0"
        @click="selectDepartment(dept)"
        @keydown.enter="selectDepartment(dept)"
        @keydown.space.prevent="selectDepartment(dept)"
      >
        <div class="dept-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
            <line x1="12" y1="9" x2="12" y2="15"/>
          </svg>
        </div>
        <span class="dept-name">{{ dept.name }}</span>
        <svg v-if="selectedDeptId === dept.id" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Demo data - 科室列表
const departments = ref([
  { id: 1, name: '神经外科' },
  { id: 2, name: '神经内科' },
  { id: 3, name: '神经外科学中心' },
  { id: 4, name: '神经病学中心' },
  { id: 5, name: '中医科 - 传统中医治疗' },
]);

const selectedDeptId = computed(() => {
  return route.params.deptId ? parseInt(route.params.deptId) : null;
});

function selectDepartment(dept) {
  router.push(`/schedule/dept/${dept.id}`);
}
</script>

<style scoped>
.department-panel {
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

.department-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  flex: 1;
  overflow-y: auto;
}

.department-list li {
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

.department-list li:last-child {
  margin-bottom: 0;
}

.department-list li:hover {
  background: var(--bg-subtle);
}

.department-list li:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: -2px;
}

.department-list li.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.department-list li.active:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #065F69 100%);
}

.dept-icon {
  width: 36px;
  height: 36px;
  background: var(--primary-50);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.dept-icon svg {
  width: 18px;
  height: 18px;
  color: var(--primary);
}

.department-list li.active .dept-icon {
  background: rgba(255, 255, 255, 0.2);
}

.department-list li.active .dept-icon svg {
  color: #fff;
}

.dept-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.check-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-left: 8px;
  opacity: 0.9;
}
</style>
