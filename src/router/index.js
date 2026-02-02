import { createRouter, createWebHistory } from 'vue-router';

// Schedule module
import ScheduleMaster from '../views/schedule/Master.vue';
import ScheduleDetail from '../views/schedule/Detail.vue';
import ScheduleObject from '../views/schedule/Object.vue';

// Appointments module
import AppointmentMaster from '../views/appointments/Master.vue';
import AppointmentDetail from '../views/appointments/Detail.vue';

const routes = [
  // Default redirect
  { path: '/', redirect: '/schedule' },

  // ========== SCHEDULE MODULE (排班管理) ==========
  {
    path: '/schedule',
    component: ScheduleMaster,
    meta: { layout: 'OneColumn', module: 'schedule' }
  },
  {
    path: '/schedule/dept/:deptId',
    components: { begin: ScheduleMaster, mid: ScheduleDetail },
    meta: { layout: 'TwoColumnsMidExpanded', module: 'schedule' }
  },
  {
    path: '/schedule/dept/:deptId/disease/:diseaseId',
    components: { begin: ScheduleMaster, mid: ScheduleDetail, end: ScheduleObject },
    meta: { layout: 'ThreeColumnsMidExpanded', module: 'schedule' }
  },

  // ========== APPOINTMENTS MODULE (预约管理) ==========
  {
    path: '/appointments',
    component: AppointmentMaster,
    meta: { layout: 'OneColumn', module: 'appointments' }
  },
  {
    path: '/appointments/:appointmentId',
    components: { begin: AppointmentMaster, mid: AppointmentDetail },
    meta: { layout: 'TwoColumnsMidExpanded', module: 'appointments' }
  },

  // Catch-all redirect
  { path: '/:pathMatch(.*)*', redirect: '/schedule' }
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
