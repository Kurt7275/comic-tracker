<template>
  <!-- This page now redirects; profile lives in the modal -->
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirect to shelf and open the profile modal
  router.replace('/shelf').then(() => {
    window.dispatchEvent(new CustomEvent('open-profile-modal'))
  })
})
</script>
