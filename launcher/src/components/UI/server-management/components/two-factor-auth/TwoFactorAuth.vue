<template>
  <div
    class="2-fa-auth w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-24 grid-rows-14 p-2"
  >
    <span class="top-ttl row-start-1">2 FACTOR AUTHENTICATION</span>
    <!-- <TwoFactorBtn class="row-start-6" btn-name="Setup" @btnClick="enableTwoFactor" /> -->
    <TwoFactorCheckLine
      default-checked="true"
      class="row-start-2"
      check-text="Do you want authentication tokens to be time-based?"
    />
    <TwoFactorCheckLine
      default-checked="false"
      class="row-start-3"
      check-text="Increase the original generation time limit? This will permit a time skew of up to 4 minutes!"
      multi-line="true"
    />
    <TwoFactorCheckLine default-checked="true" class="row-start-5" check-text="Do you want to enable rate-limiting?" />
    <span class="top-ttl row-start-6">2 FACTOR SETUP</span>
  </div>
</template>

<script setup>
// import TwoFactorBtn from "./TwoFactorBtn.vue";
import TwoFactorCheckLine from "./TwoFactorCheckLine.vue";
</script>
<style scoped>
.top-ttl {
  grid-column-start: 1;
  grid-column-end: span full;
  grid-row-end: span 1;
  color: #f5f5f5;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
