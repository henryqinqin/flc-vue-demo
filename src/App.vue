<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-title">
        <div class="header-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        远程医疗管理系统
      </div>
      <div class="header-user">
        <div class="user-avatar">管</div>
        <span class="user-name">管理员</span>
        <button class="logout-btn" title="退出登录" aria-label="退出登录">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          退出
        </button>
      </div>
    </header>

    <div class="app-body">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <div class="nav-item" :class="{ active: isActive('appointments') }" @click="navigateTo('/appointments')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>预约管理</span>
          </div>
          <div class="nav-item" :class="{ active: isActive('schedule') }" @click="navigateTo('/schedule')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
            </svg>
            <span>排班管理</span>
          </div>
          <div class="nav-item has-children" @click="toggleMenu('hospital')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18"/>
              <path d="M5 21V7l8-4v18"/>
              <path d="M19 21V11l-6-4"/>
              <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
            </svg>
            <span>医院管理</span>
            <svg class="arrow" :class="{ expanded: expandedMenus.hospital }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
          <transition name="submenu">
            <div v-if="expandedMenus.hospital" class="nav-submenu">
              <div class="nav-item sub">科室管理</div>
              <div class="nav-item sub">医生管理</div>
            </div>
          </transition>
          <div class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18"/>
              <path d="M9 21V8a3 3 0 0 1 6 0v13"/>
              <path d="M3 8l9-5 9 5"/>
            </svg>
            <span>合作医院</span>
          </div>
          <div class="nav-item has-children" @click="toggleMenu('my')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>我的</span>
            <svg class="arrow" :class="{ expanded: expandedMenus.my }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
          <transition name="submenu">
            <div v-if="expandedMenus.my" class="nav-submenu">
              <div class="nav-item sub">个人信息</div>
              <div class="nav-item sub">修改密码</div>
            </div>
          </transition>
          <div class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span>统计信息</span>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <FlexibleColumnLayout :layout="layout">
          <template #begin>
            <router-view v-if="layout === 'OneColumn'" />
            <router-view v-else name="begin" />
          </template>
          <template #mid>
            <router-view name="mid" />
          </template>
          <template #end>
            <router-view name="end" />
          </template>
        </FlexibleColumnLayout>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FlexibleColumnLayout from './components/FlexibleColumnLayout.vue';

const route = useRoute();
const router = useRouter();
const layout = computed(() => route.meta.layout || 'OneColumn');
const currentModule = computed(() => route.meta.module || 'schedule');

const expandedMenus = reactive({
  hospital: false,
  my: false,
});

function toggleMenu(menu) {
  expandedMenus[menu] = !expandedMenus[menu];
}

function navigateTo(path) {
  router.push(path);
}

function isActive(module) {
  return currentModule.value === module;
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-alt);
}

/* Header */
.app-header {
  height: 60px;
  background: linear-gradient(135deg, #0F766E 0%, #134E4A 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
  z-index: 100;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.header-logo {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo svg {
  width: 20px;
  height: 20px;
  color: var(--primary-light);
}

.header-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-light);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.95;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
  font-size: 13px;
  transition: all var(--transition-fast);
  min-height: 44px;
}

.logout-btn svg {
  width: 16px;
  height: 16px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.logout-btn:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: 2px;
}

/* Main body */
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  flex-shrink: 0;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.nav-menu {
  padding: 16px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  gap: 12px;
  position: relative;
  transition: all var(--transition-fast);
  color: var(--sidebar-text);
  border-left: 3px solid transparent;
  margin: 2px 0;
}

.nav-item:hover {
  background: var(--sidebar-hover);
  color: #fff;
}

.nav-item:focus-visible {
  outline: 2px solid var(--sidebar-accent);
  outline-offset: -2px;
}

.nav-item.active {
  background: var(--sidebar-active);
  color: #fff;
  border-left-color: var(--sidebar-accent);
}

.nav-item.sub {
  padding: 12px 20px 12px 52px;
  font-size: 13px;
  font-weight: 400;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.nav-item:hover .nav-icon,
.nav-item.active .nav-icon {
  opacity: 1;
}

.arrow {
  width: 16px;
  height: 16px;
  margin-left: auto;
  opacity: 0.6;
  transition: transform var(--transition-fast);
}

.arrow.expanded {
  transform: rotate(90deg);
}

.nav-submenu {
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all var(--transition);
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 100px;
}

/* Main content */
.main-content {
  flex: 1;
  overflow: hidden;
  background: var(--bg-alt);
}
</style>
