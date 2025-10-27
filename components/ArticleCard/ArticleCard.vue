<template>
  <view class="news-card" @tap="handleClick">
    <view class="card-content">
      <!-- 左侧图片区 -->
      <view class="content-left">
        <image 
          :src="newsData.cover_image_url" 
          mode="aspectFill"
          :lazy-load="true"
          class="news-image"
          @error="handleImageError"
        />
      </view>
      
      <!-- 右侧内容区 -->
      <view class="content-right">
        <view class="news-title">{{ newsData.article_title }}</view>
        
        <view class="news-summary">{{ newsData.brief_content }}</view>
        
        <view class="news-meta">
          <view class="category-tag" v-if="newsData.field_name">
            {{ newsData.field_name }}
          </view>
          <text class="news-source">{{ newsData.article_source || '新闻来源' }}</text>
          <text class="news-divider">·</text>
          <text class="news-time">{{ formatTime(newsData.release_time) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  newsData: {
    type: Object,
    default: () => ({
      article_id: '',
      article_title: '新闻标题',
      brief_content: '新闻内容摘要，这里展示新闻的主要内容概述...',
      cover_image_url: '/static/images/default-news.jpg',
      article_source: '新闻来源',
      release_time: new Date(),
      field_name: '科技',
    })
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.newsData)
}

const handleImageError = () => {
  console.log('图片加载失败')
}

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
</script>

<style lang="scss" scoped>
.news-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  }
}

.card-content {
  display: flex;
  padding: 24rpx;
  gap: 24rpx;
}

.content-left {
  flex-shrink: 0;
  width: 220rpx;
  height: 220rpx;
  border-radius: 12rpx;
  overflow: hidden;
  
  .news-image {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
  }
}

.content-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0; // 防止flex子元素溢出
}

.news-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-summary {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: auto;
  
  .category-tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 500;
    margin-right: 4rpx;
  }
  
  .news-source {
    color: #667eea;
    font-size: 24rpx;
    font-weight: 500;
  }
  
  .news-divider {
    color: #ddd;
    font-size: 24rpx;
  }
  
  .news-time {
    color: #999;
    font-size: 24rpx;
  }
}

.content-right {
  flex-shrink: 0;
  width: 220rpx;
  height: 220rpx;
  border-radius: 12rpx;
  overflow: hidden;
  
  .news-image {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
  }
}

.news-card:active .news-image {
  transform: scale(1.05);
}
</style>