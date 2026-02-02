<template>
  <div class="detail-panel">
    <div class="panel-header">
      <div class="panel-title">
        <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
        <h3>预约详情</h3>
      </div>
      <span class="status-badge" :class="appointment?.status">{{ statusText(appointment?.status) }}</span>
    </div>

    <div v-if="appointment" class="detail-content">
      <section class="info-section">
        <h4>患者信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">姓名</span>
            <span class="value">{{ appointment.patientName }}</span>
          </div>
          <div class="info-item">
            <span class="label">性别</span>
            <span class="value">{{ appointment.gender }}</span>
          </div>
          <div class="info-item">
            <span class="label">年龄</span>
            <span class="value">{{ appointment.age }}岁</span>
          </div>
          <div class="info-item">
            <span class="label">联系电话</span>
            <span class="value">{{ appointment.phone }}</span>
          </div>
        </div>
      </section>

      <section class="info-section">
        <h4>预约信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">预约医生</span>
            <span class="value">{{ appointment.doctor }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约科室</span>
            <span class="value">{{ appointment.department }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约日期</span>
            <span class="value">{{ appointment.date }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约时间</span>
            <span class="value">{{ appointment.time }}</span>
          </div>
        </div>
      </section>

      <section class="info-section">
        <h4>就诊原因</h4>
        <p class="reason-text">{{ appointment.reason }}</p>
      </section>

      <div class="action-buttons">
        <button class="btn btn-primary" v-if="appointment.status === 'pending'" @click="confirmAppointment">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          确认预约
        </button>
        <button class="btn btn-secondary" v-if="appointment.status !== 'cancelled'" @click="cancelAppointment">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          取消预约
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
      </svg>
      <p>请从列表中选择预约</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const appointmentData = {
  1: { id: 1, patientName: '张三', gender: '男', age: 45, phone: '138****1234', doctor: '王主任', department: '神经外科', date: '2026-02-03', time: '09:00', status: 'confirmed', reason: '头痛持续一周，需要进一步检查' },
  2: { id: 2, patientName: '李四', gender: '女', age: 32, phone: '139****5678', doctor: '任神经', department: '神经内科', date: '2026-02-03', time: '10:30', status: 'pending', reason: '经常性眩晕，伴有恶心症状' },
  3: { id: 3, patientName: '王五', gender: '男', age: 58, phone: '137****9012', doctor: '李医生', department: '神经外科', date: '2026-02-03', time: '14:00', status: 'confirmed', reason: '复查，上次手术后复诊' },
  4: { id: 4, patientName: '赵六', gender: '女', age: 28, phone: '136****3456', doctor: '张专家', department: '中医科', date: '2026-02-03', time: '15:30', status: 'cancelled', reason: '睡眠质量差，希望中医调理' },
  5: { id: 5, patientName: '孙七', gender: '男', age: 65, phone: '135****7890', doctor: '陈医师', department: '神经病学中心', date: '2026-02-03', time: '16:00', status: 'pending', reason: '帕金森症状咨询' },
};

const appointment = computed(() => {
  const id = route.params.appointmentId;
  return id ? appointmentData[parseInt(id)] : null;
});

function statusText(status) {
  const map = { confirmed: '已确认', pending: '待确认', cancelled: '已取消' };
  return map[status] || '';
}

function confirmAppointment() {
  if (appointment.value) {
    appointmentData[appointment.value.id].status = 'confirmed';
  }
}

function cancelAppointment() {
  if (appointment.value) {
    appointmentData[appointment.value.id].status = 'cancelled';
  }
}
</script>

<style scoped>
.detail-panel {
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

.status-badge {
  font-size: 12px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-weight: 600;
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

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.info-item .value {
  font-size: 14px;
  color: var(--text);
  font-weight: 600;
}

.reason-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  background: var(--bg-subtle);
  padding: 12px 16px;
  border-radius: var(--radius-md);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 44px;
}

.btn svg {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #fff;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #065F69 100%);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-subtle);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--error-light);
  color: var(--error-dark);
  border-color: var(--error);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 16px;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  opacity: 0.4;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
