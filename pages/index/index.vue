<template>
  <view class="container">
    <CustomNavbar />
    <!-- 页面内容 -->
	<showInforVue></showInforVue>
  </view>
</template>

<script setup>
import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
import showInforVue from '../../components/show-infor/show-infor.vue';
</script>

<style>
.container {
  padding: 0;
  margin: 0;
}
</style>