import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/**
 * Composable for FCL navigation patterns.
 * Provides standardized navigation helpers for Master → Detail → Object flow.
 *
 * @param {Object} config - Navigation configuration
 * @param {string} config.basePath - Base path for this module (e.g., '/schedule', '/appointments')
 * @param {string} config.masterParam - Route param name for master selection (e.g., 'deptId')
 * @param {string} config.detailParam - Route param name for detail selection (e.g., 'diseaseId')
 */
export function useFCLNavigation(config) {
  const router = useRouter();
  const route = useRoute();

  const { basePath, masterParam = 'masterId', detailParam = 'detailId' } = config;

  // Current selections from route params
  const selectedMasterId = computed(() => {
    const id = route.params[masterParam];
    return id ? (isNaN(id) ? id : parseInt(id)) : null;
  });

  const selectedDetailId = computed(() => {
    const id = route.params[detailParam];
    return id ? (isNaN(id) ? id : parseInt(id)) : null;
  });

  // Navigation functions
  function navigateToMaster() {
    router.push(basePath);
  }

  function selectMaster(id) {
    router.push(`${basePath}/${masterParam.replace('Id', '')}/${id}`);
  }

  function selectDetail(id) {
    if (!selectedMasterId.value) return;
    const masterSegment = `${masterParam.replace('Id', '')}/${selectedMasterId.value}`;
    const detailSegment = `${detailParam.replace('Id', '')}/${id}`;
    router.push(`${basePath}/${masterSegment}/${detailSegment}`);
  }

  function goBack() {
    if (selectedDetailId.value) {
      // Go from Object back to Detail
      const masterSegment = `${masterParam.replace('Id', '')}/${selectedMasterId.value}`;
      router.push(`${basePath}/${masterSegment}`);
    } else if (selectedMasterId.value) {
      // Go from Detail back to Master
      router.push(basePath);
    }
  }

  return {
    selectedMasterId,
    selectedDetailId,
    navigateToMaster,
    selectMaster,
    selectDetail,
    goBack,
  };
}
