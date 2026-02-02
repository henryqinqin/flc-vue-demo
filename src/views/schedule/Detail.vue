<template>
  <div class="disease-panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <h3>病种列表</h3>
      </div>
      <span class="panel-count">{{ diseases.length }} 个病种</span>
    </div>
    <ul class="disease-list" role="listbox" aria-label="病种列表">
      <li
        v-for="disease in diseases"
        :key="disease.id"
        :class="{ active: selectedDiseaseId === disease.id }"
        :aria-selected="selectedDiseaseId === disease.id"
        role="option"
        tabindex="0"
        @click="selectDisease(disease)"
        @keydown.enter="selectDisease(disease)"
        @keydown.space.prevent="selectDisease(disease)"
      >
        <div class="disease-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l2 2"/>
          </svg>
        </div>
        <span class="disease-name">{{ disease.name }}</span>
        <svg v-if="selectedDiseaseId === disease.id" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Demo data - 病种列表 (按科室分组)
const diseasesByDept = {
  1: [ // 神经外科
    { id: 1, name: '脑肿瘤' },
    { id: 2, name: '三叉神经痛' },
    { id: 3, name: '脑血管病' },
    { id: 4, name: '脊髓肿瘤' },
  ],
  2: [ // 神经内科
    { id: 5, name: '帕金森病' },
    { id: 6, name: '癫痫' },
    { id: 7, name: '脑梗塞' },
    { id: 8, name: '头痛' },
  ],
  3: [ // 神经外科学中心
    { id: 9, name: '功能神经外科' },
    { id: 10, name: '神经重症' },
  ],
  4: [ // 神经病学中心
    { id: 11, name: '运动障碍病' },
    { id: 12, name: '认知障碍' },
  ],
  5: [ // 中医科
    { id: 13, name: '针灸推拿' },
    { id: 14, name: '中药调理' },
  ],
};

const deptId = computed(() => route.params.deptId ? parseInt(route.params.deptId) : 1);
const diseases = computed(() => diseasesByDept[deptId.value] || []);
const selectedDiseaseId = computed(() => {
  return route.params.diseaseId ? parseInt(route.params.diseaseId) : null;
});

function selectDisease(disease) {
  router.push(`/schedule/dept/${deptId.value}/disease/${disease.id}`);
}
</script>

<style scoped>
.disease-panel {
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

.disease-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  flex: 1;
  overflow-y: auto;
}

.disease-list li {
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

.disease-list li:last-child {
  margin-bottom: 0;
}

.disease-list li:hover {
  background: var(--bg-subtle);
}

.disease-list li:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: -2px;
}

.disease-list li.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.disease-list li.active:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #065F69 100%);
}

.disease-icon {
  width: 36px;
  height: 36px;
  background: var(--success-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.disease-icon svg {
  width: 18px;
  height: 18px;
  color: var(--success);
}

.disease-list li.active .disease-icon {
  background: rgba(255, 255, 255, 0.2);
}

.disease-list li.active .disease-icon svg {
  color: #fff;
}

.disease-name {
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
