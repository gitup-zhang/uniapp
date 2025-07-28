<template>
  <view class="policy-card" @tap="handleClick">
<!--    <view class="policy-header">
      <view class="policy-level" :class="getLevelClass(policyData.level)">
        <text class="level-icon">{{ getLevelIcon(policyData.level) }}</text>
        <text class="level-text">{{ policyData.level }}</text>
      </view>
      <view class="policy-status" :class="getStatusClass(policyData.status)">
        {{ policyData.status }}
      </view>
    </view> -->
    
    <view class="policy-content">
      <view class="policy-title">{{ policyData.article_title }}</view>
      
      <view class="policy-info">
        <view class="info-row">
          <text class="info-label">发文机关：</text>
          <text class="info-value">{{ policyData.department }}</text>
        </view>
		<!--<view class="info-row">
          <text class="info-label">文号：</text>
          <text class="info-value">{{ policyData.documentNumber }}</text>
        </view> -->
        <view class="info-row">
          <text class="info-label">发布时间：</text>
          <text class="info-value">{{ formatDate(policyData.release_time) }}</text>
        </view>
<!--        <view class="info-row" v-if="policyData.effectiveDate">
          <text class="info-label">生效时间：</text>
          <text class="info-value">{{ formatDate(policyData.effectiveDate) }}</text>
        </view> -->
      </view>
      
      <view class="policy-summary">{{ policyData.brief_content }}</view>
      
      <view class="policy-tags" v-if="policyData.tags && policyData.tags.length">
        <view 
          class="tag-item" 
          v-for="tag in policyData.tags" 
          :key="tag"
        >
          {{ tag }}
        </view>
      </view>
    </view>
    
<!--    <view class="policy-footer">
      <view class="policy-meta">
        <view class="meta-item">
          <text class="icon">📄</text>
          <text class="meta-text">{{ policyData.pageCount || 0 }}页</text>
        </view>
        <view class="meta-item" v-if="policyData.views">
          <text class="icon">👁</text>
          <text class="meta-text">{{ formatNumber(policyData.views) }}次浏览</text>
        </view>
        <view class="meta-item" v-if="policyData.downloads">
          <text class="icon">⬇️</text>
          <text class="meta-text">{{ formatNumber(policyData.downloads) }}次下载</text>
        </view>
      </view>
      
      <view class="action-buttons">
        <view class="action-btn preview-btn" @tap.stop="handlePreview">
          <text class="btn-icon">👁</text>
          <text class="btn-text">预览</text>
        </view>
        <view class="action-btn download-btn" @tap.stop="handleDownload">
          <text class="btn-icon">📥</text>
          <text class="btn-text">下载</text>
        </view>
      </view>
    </view> -->
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义props
const props = defineProps({
  policyData: {
    type: Object,
    default: () => ({
      article_id: '',
      article_title: '政策文件标题',
      department: '发文机关',
      // documentNumber: '文件编号',
      release_time: new Date(),
      // effectiveDate: null,
      brief_content: '政策文件摘要内容...',
      // level: '国家级',
      // status: '现行有效',
      tags: ['经济发展', '税收政策'],
      // pageCount: 10,
      // views: 1234,
      // downloads: 567
    })
  }
})

// 定义emits
const emit = defineEmits(['click', 'preview', 'download'])

// 处理点击事件
const handleClick = () => {
  emit('click', props.policyData)
}

// 处理预览
const handlePreview = () => {
  emit('preview', props.policyData)
}

// 处理下载
const handleDownload = () => {
  emit('download', props.policyData)
}

// 获取级别样式类
const getLevelClass = (level) => {
  const levelMap = {
    '国家级': 'level-national',
    '省级': 'level-provincial', 
    '市级': 'level-city',
    '区县级': 'level-district'
  }
  return levelMap[level] || 'level-default'
}

// 获取级别图标
const getLevelIcon = (level) => {
  const iconMap = {
    '国家级': '🏛️',
    '省级': '🏢',
    '市级': '🏪',
    '区县级': '🏬'
  }
  return iconMap[level] || '📋'
}

// 获取状态样式类
const getStatusClass = (status) => {
  const statusMap = {
    '现行有效': 'status-active',
    '即将生效': 'status-pending',
    '已废止': 'status-abolished',
    '已修订': 'status-revised'
  }
  return statusMap[status] || 'status-default'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}
</script>

<style lang="scss" scoped>
.policy-card {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 1rpx;
  margin-top: 24rpx;
  overflow: hidden;
  border: 2rpx solid #e8e8e8;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(1rpx);
    border-color: #d0d0d0;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-bottom: 1rpx solid #e8e8e8;
}

.policy-level {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
  
  &.level-national {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: #fff;
  }
  
  &.level-provincial {
    background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
    color: #fff;
  }
  
  &.level-city {
    background: linear-gradient(135deg, #45b7d1 0%, #96c93d 100%);
    color: #fff;
  }
  
  &.level-district {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: #fff;
  }
}

.policy-status {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  font-weight: 500;
  
  &.status-active {
    background: #e8f5e8;
    color: #2d8f2d;
  }
  
  &.status-pending {
    background: #fff3cd;
    color: #856404;
  }
  
  &.status-abolished {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.status-revised {
    background: #cce5ff;
    color: #0066cc;
  }
}

.policy-content {
  padding: 24rpx;
}

.policy-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.policy-info {
  margin-bottom: 20rpx;
  
  .info-row {
    display: flex;
    margin-bottom: 8rpx;
    font-size: 26rpx;
    
    .info-label {
      color: #666;
      min-width: 140rpx;
      flex-shrink: 0;
    }
    
    .info-value {
      color: #333;
      flex: 1;
    }
  }
}

.policy-summary {
  font-size: 28rpx;
  color: #555;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.policy-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
  
  .tag-item {
    background: #f0f0f0;
    color: #666;
    padding: 6rpx 12rpx;
    border-radius: 16rpx;
    font-size: 22rpx;
  }
}

.policy-footer {
  padding: 20rpx 24rpx;
  background: #fafafa;
  border-top: 1rpx solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.policy-meta {
  display: flex;
  gap: 24rpx;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6rpx;
    
    .icon {
      font-size: 22rpx;
    }
    
    .meta-text {
      font-size: 22rpx;
      color: #999;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 16rpx;
  
  .action-btn {
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    transition: all 0.3s ease;
    
    &.preview-btn {
      background: #e3f2fd;
      color: #1976d2;
      
      &:active {
        background: #bbdefb;
      }
    }
    
    &.download-btn {
      background: #e8f5e8;
      color: #2e7d32;
      
      &:active {
        background: #c8e6c9;
      }
    }
    
    .btn-icon {
      font-size: 20rpx;
    }
    
    .btn-text {
      font-weight: 500;
    }
  }
}
</style>