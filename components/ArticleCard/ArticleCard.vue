<template>
  <view class="news-card" @tap="handleClick">
    <view class="news-image-container">
      <image 
        :src="newsData.image" 
        mode="aspectFill"
        :lazy-load="true"
        class="news-image"
        @error="handleImageError"
      />
      <view class="image-overlay"></view>
      <view class="category-tag" v-if="newsData.category">
        {{ newsData.category }}
      </view>
    </view>
    
    <view class="news-content">
      <view class="news-meta">
        <text class="news-source">{{ newsData.source || '新闻来源' }}</text>
        <text class="news-time">{{ formatTime(newsData.publishTime) }}</text>
      </view>
      
      <view class="news-title">{{ newsData.title }}</view>
      
      <view class="news-summary">{{ newsData.summary }}</view>
      
      <view class="news-footer">
        <view class="news-stats">
          <view class="stat-item" v-if="newsData.views">
            <text class="icon">👁</text>
            <text class="stat-text">{{ formatNumber(newsData.views) }}</text>
          </view>
          <view class="stat-item" v-if="newsData.likes">
            <text class="icon">❤️</text>
            <text class="stat-text">{{ formatNumber(newsData.likes) }}</text>
          </view>
          <view class="stat-item" v-if="newsData.comments">
            <text class="icon">💬</text>
            <text class="stat-text">{{ formatNumber(newsData.comments) }}</text>
          </view>
        </view>
        <view class="read-more">
          <text>阅读全文</text>
          <text class="arrow">→</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义props
const props = defineProps({
  newsData: {
    type: Object,
    default: () => ({
      id: '',
      title: '新闻标题',
      summary: '新闻内容摘要，这里展示新闻的主要内容概述...',
      image: '/static/images/default-news.jpg',
      source: '新闻来源',
      publishTime: new Date(),
      category: '科技',
      views: 1234,
      likes: 89,
      comments: 23
    })
  }
})

// 定义emits
const emit = defineEmits(['click'])

// 处理点击事件
const handleClick = () => {
  emit('click', props.newsData)
}

// 处理图片加载失败
const handleImageError = () => {
  console.log('图片加载失败')
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const now = new Date()
  const publishTime = new Date(time)
  const diff = now - publishTime
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return publishTime.toLocaleDateString()
  }
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
.news-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.12);
  }
}

.news-image-container {
  position: relative;
  width: 100%;
  height: 400rpx;
  overflow: hidden;
  
  .news-image {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 60%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
  
  .category-tag {
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: 500;
    backdrop-filter: blur(10rpx);
  }
}

.news-content {
  padding: 24rpx;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  
  .news-source {
    color: #667eea;
    font-size: 24rpx;
    font-weight: 500;
  }
  
  .news-time {
    color: #999;
    font-size: 24rpx;
  }
}

.news-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-summary {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.news-stats {
  display: flex;
  gap: 24rpx;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    .icon {
      font-size: 24rpx;
    }
    
    .stat-text {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.read-more {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #667eea;
  font-size: 26rpx;
  font-weight: 500;
  
  .arrow {
    transition: transform 0.3s ease;
  }
}

.news-card:active .read-more .arrow {
  transform: translateX(4rpx);
}

.news-card:active .news-image {
  transform: scale(1.02);
}
</style>