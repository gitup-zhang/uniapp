<template>
  <view 
    class="message-item"
    :class="{ 'expanded': message.expanded }"
  >
    <!-- 消息卡片 -->
    <view class="message-card" @tap="handleMessageClick">
      <!-- 装饰线条 -->
      <view class="decoration-line"></view>
      
      <!-- 消息头部 -->
      <view class="message-header">
        <view class="message-icon">
          <text class="icon-text">📢</text>
        </view>
        <view class="header-content">
          <view class="title-line">
            <text class="message-title">{{ message.title || '系统通知' }}</text>
            <!-- 时间移到右上角 -->
            <text class="message-time">{{ formatTime(message.send_time || message.created_at) }}</text>
          </view>
          <!-- 发送者信息（如果有） -->
          <view v-if="message.sender_name" class="sender-info">
            <text class="sender-name">{{ message.sender_name }}</text>
          </view>
        </view>
      </view>

      <!-- 消息内容区域 -->
      <view class="message-body">
        <!-- 短内容直接显示 -->
        <view v-if="contentLevel === 'short'" class="content-wrapper">
          <mp-html 
            :content="getDisplayContent()"
            :lazy-load="true"
            :selectable="true"
            :use-anchor="true"
            class="rich-text"
            @load="onRichTextLoad"
            @itemclick="handleRichTextClick"
          />
        </view>

        <!-- 中等长度内容可折叠 -->
        <view v-else-if="contentLevel === 'medium'" class="content-wrapper">
          <mp-html 
            :content="getDisplayContent()"
            :lazy-load="true"
            :selectable="true"
            :use-anchor="true"
            :class="{ 'content-collapsed': !message.expanded }"
            class="rich-text"
            @load="onRichTextLoad"
            @itemclick="handleRichTextClick"
          />
          
          <!-- 折叠/展开控制 -->
          <view class="toggle-section">
            <view class="fade-mask" v-if="!message.expanded"></view>
            <view class="toggle-btn" @tap.stop="toggleContent">
              <text class="toggle-text">{{ message.expanded ? '收起' : '展开' }}</text>
              <view class="toggle-icon" :class="{ 'rotated': message.expanded }">
                <text class="icon-arrow">▼</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 超长内容显示预览 -->
        <view v-else class="content-wrapper">
          <mp-html 
            :content="getDisplayContent()"
            :lazy-load="true"
            :selectable="true"
            :use-anchor="true"
            class="rich-text content-preview"
            @itemclick="handleRichTextClick"
          />
          
          <view class="action-section">
            <view class="detail-btn" @tap.stop="viewFullContent">
              <view class="btn-content">
                <text class="btn-text">查看完整内容</text>
                <view class="btn-arrow">
                  <text class="arrow-icon">→</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted, nextTick } from 'vue'
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'

// 组件属性
const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

// 组件事件
const emit = defineEmits(['messageClick', 'toggleExpanded', 'viewDetail'])

// 内容行数阈值配置（复刻案例的配置）
const LINE_CONFIG = {
  SHORT_LIMIT: 5,      // 短内容：5行以内
  MEDIUM_LIMIT: 15,    // 中等内容：5-15行
  PREVIEW_LINES: 5,    // 预览内容行数
  
  // 富文本元素行数配置
  IMAGE_LINES: 4,      // 一张图片占4行
  BR_LINES: 1,         // <br> 标签占1行
  PARAGRAPH_MIN_LINES: 1,  // 段落最小行数
  TITLE_MIN_LINES: {       // 标题最小行数
    h1: 2,
    h2: 1.5,
    h3: 1.5,
    h4: 1,
    h5: 1,
    h6: 1
  },
  LIST_ITEM_MIN_LINES: 1,  // 列表项最小行数
  BLOCK_MARGIN: 0.5,       // 块级元素间距
  
  // 文本行数计算（基于容器宽度和字体大小）
  CHARS_PER_LINE: 28,      // 每行大约字符数（根据实际UI调整）
  
  // 容器配置
  CONTAINER_WIDTH: 600,    // 容器宽度（rpx），用于更精确的计算
  FONT_SIZE: 28,          // 字体大小（rpx）
  LINE_HEIGHT: 1.8,       // 行高倍数
}

// 优先级文本映射
const PRIORITY_MAP = {
  'high': '重要',
  'medium': '普通',
  'low': '一般',
  'urgent': '紧急'
}

// 计算文本内容的实际行数
function calculateTextLines(text, fontSize = LINE_CONFIG.FONT_SIZE) {
  if (!text || typeof text !== 'string') return 0
  
  const cleanText = text.trim()
  if (!cleanText) return 0
  
  // 按换行符分割
  const lines = cleanText.split(/\n+/)
  let totalLines = 0
  
  // 计算每个段落的行数
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue
    
    // 简单估算：基于字符数和容器宽度
    // 考虑中英文字符宽度差异（中文字符约为英文字符的2倍宽）
    let charWidth = 0
    for (const char of trimmedLine) {
      // 简单判断中文字符
      if (/[\u4e00-\u9fa5]/.test(char)) {
        charWidth += 2 // 中文字符占2个字符宽度
      } else {
        charWidth += 1 // 英文字符占1个字符宽度
      }
    }
    
    // 根据容器宽度和字体大小计算每行能容纳的字符数
    const containerWidthPx = LINE_CONFIG.CONTAINER_WIDTH * 0.5 // rpx转px的近似比例
    const fontSizePx = fontSize * 0.5
    const charsPerLine = Math.floor(containerWidthPx / fontSizePx)
    
    // 计算该段落需要的行数
    const linesNeeded = Math.ceil(charWidth / charsPerLine)
    totalLines += Math.max(linesNeeded, 1) // 至少占1行
  }
  
  return totalLines
}

// 从HTML字符串计算行数
function calculateLinesFromHTML(html) {
  if (!html) return { totalLines: 0, imageCount: 0 }
  
  let totalLines = 0
  let imageCount = 0
  
  // 计算图片数量
  const imgMatches = html.match(/<img[^>]*>/g) || []
  imageCount = imgMatches.length
  totalLines += imageCount * LINE_CONFIG.IMAGE_LINES
  
  // 计算换行标签
  const brMatches = html.match(/<br\s*\/?>/gi) || []
  totalLines += brMatches.length * LINE_CONFIG.BR_LINES
  
  // 计算段落及其内容
  const pMatches = html.match(/<p[^>]*>(.*?)<\/p>/gis) || []
  for (const pMatch of pMatches) {
    const pContent = pMatch.replace(/<p[^>]*>|<\/p>/gi, '').replace(/<[^>]*>/g, '')
    const pLines = calculateTextLines(pContent)
    totalLines += Math.max(pLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN
  }
  
  // 计算div块及其内容
  const divMatches = html.match(/<div[^>]*>(.*?)<\/div>/gis) || []
  for (const divMatch of divMatches) {
    const divContent = divMatch.replace(/<div[^>]*>|<\/div>/gi, '').replace(/<[^>]*>/g, '')
    const divLines = calculateTextLines(divContent)
    if (divLines > 0) {
      totalLines += divLines + LINE_CONFIG.BLOCK_MARGIN
    }
  }
  
  // 计算标题及其内容
  for (let i = 1; i <= 6; i++) {
    const titleMatches = html.match(new RegExp(`<h${i}[^>]*>(.*?)</h${i}>`, 'gis')) || []
    for (const titleMatch of titleMatches) {
      const titleContent = titleMatch.replace(new RegExp(`<h${i}[^>]*>|</h${i}>`, 'gi'), '').replace(/<[^>]*>/g, '')
      const titleLines = calculateTextLines(titleContent, LINE_CONFIG.FONT_SIZE + 4 * i) // 标题字体更大
      const minLines = LINE_CONFIG.TITLE_MIN_LINES[`h${i}`] || 1
      totalLines += Math.max(titleLines, minLines) + LINE_CONFIG.BLOCK_MARGIN
    }
  }
  
  // 计算列表项及其内容
  const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/gis) || []
  for (const liMatch of liMatches) {
    const liContent = liMatch.replace(/<li[^>]*>|<\/li>/gi, '').replace(/<[^>]*>/g, '')
    const liLines = calculateTextLines(liContent)
    totalLines += Math.max(liLines, LINE_CONFIG.LIST_ITEM_MIN_LINES)
  }
  
  // 计算列表容器的间距
  const ulMatches = html.match(/<ul[^>]*>.*?<\/ul>/gis) || []
  const olMatches = html.match(/<ol[^>]*>.*?<\/ol>/gis) || []
  totalLines += (ulMatches.length + olMatches.length) * LINE_CONFIG.BLOCK_MARGIN
  
  // 计算引用块及其内容
  const blockquoteMatches = html.match(/<blockquote[^>]*>(.*?)<\/blockquote>/gis) || []
  for (const blockquoteMatch of blockquoteMatches) {
    const quoteContent = blockquoteMatch.replace(/<blockquote[^>]*>|<\/blockquote>/gi, '').replace(/<[^>]*>/g, '')
    const quoteLines = calculateTextLines(quoteContent)
    totalLines += Math.max(quoteLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN
  }
  
  // 计算代码块及其内容
  const preMatches = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gis) || []
  for (const preMatch of preMatches) {
    const codeContent = preMatch.replace(/<pre[^>]*>|<\/pre>/gi, '').replace(/<[^>]*>/g, '')
    const codeLines = codeContent.split(/\n/).length
    totalLines += codeLines + LINE_CONFIG.BLOCK_MARGIN
  }
  
  // 计算其他内联文本内容（排除已处理的标签）
  let remainingText = html
    .replace(/<img[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<p[^>]*>.*?<\/p>/gis, '')
    .replace(/<div[^>]*>.*?<\/div>/gis, '')
    .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gis, '')
    .replace(/<li[^>]*>.*?<\/li>/gis, '')
    .replace(/<[uo]l[^>]*>.*?<\/[uo]l>/gis, '')
    .replace(/<blockquote[^>]*>.*?<\/blockquote>/gis, '')
    .replace(/<pre[^>]*>.*?<\/pre>/gis, '')
    .replace(/<[^>]*>/g, '') // 移除所有剩余标签
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
  
  if (remainingText) {
    const remainingLines = calculateTextLines(remainingText)
    totalLines += remainingLines
  }
  
  return { totalLines: Math.max(totalLines, 0.5), imageCount }
}

// 按行数截取文本内容
function truncateTextByLines(text, targetLines) {
  if (!text || targetLines <= 0) return ''
  
  const textLines = calculateTextLines(text)
  if (textLines <= targetLines) return text
  
  // 估算需要保留的字符数
  const charsPerLine = LINE_CONFIG.CHARS_PER_LINE
  const maxChars = Math.floor(targetLines * charsPerLine)
  
  if (text.length <= maxChars) return text
  
  // 截取文本，尽量在合适的位置断开
  let truncated = text.substring(0, maxChars)
  
  // 尝试在标点符号或空格处断开
  const breakPoints = ['\n', '。', '！', '？', '.', '!', '?', '；', ';', '，', ',', ' ']
  
  for (const breakPoint of breakPoints) {
    const lastIndex = truncated.lastIndexOf(breakPoint)
    if (lastIndex > maxChars * 0.8) { // 只在靠近末尾时断开
      truncated = truncated.substring(0, lastIndex + 1)
      break
    }
  }
  
  return truncated + '...'
}

// 清理HTML内容，移除空白标签和多余空格
function cleanHTML(html) {
  if (!html) return ''
  
  return html
    // 移除空的段落和div
    .replace(/<p[^>]*>\s*<\/p>/gi, '')
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    // 移除多余的空白字符
    .replace(/^\s+/, '')
    .replace(/\s+$/, '')
    // 移除开头的空行
    .replace(/^(<br\s*\/?>)+/i, '')
    // 合并多个连续的换行
    .replace(/(<br\s*\/?>){3,}/gi, '<br><br>')
    .trim()
}

// 按行数截取HTML内容
function truncateHTMLByLines(html, targetLines) {
  if (!html) return ''
  
  // 先清理HTML
  html = cleanHTML(html)
  
  const currentResult = calculateLinesFromHTML(html)
  if (currentResult.totalLines <= targetLines) {
    return html
  }
  
  // 按顺序处理HTML内容，保持原始顺序
  let truncatedHtml = ''
  let currentLines = 0
  let processedLength = 0
  
  // 创建一个简单的HTML解析器来按顺序处理内容
  const htmlSegments = []
  
  // 分割HTML为段落和其他元素
  const segmentRegex = /(<(?:h[1-6]|p|div|img|br|blockquote|pre|[uo]l)[^>]*>[\s\S]*?<\/(?:h[1-6]|p|div|blockquote|pre|[uo]l)>|<(?:img|br)[^>]*\/?>|[^<]+)/gi
  
  let match
  while ((match = segmentRegex.exec(html)) !== null) {
    htmlSegments.push(match[0])
  }
  
  // 按顺序处理每个段落
  for (const segment of htmlSegments) {
    if (currentLines >= targetLines) break
    
    const trimmedSegment = segment.trim()
    if (!trimmedSegment) continue
    
    // 计算当前段落的行数
    let segmentLines
    
    if (trimmedSegment.match(/<img[^>]*>/i)) {
      segmentLines = LINE_CONFIG.IMAGE_LINES
    } else if (trimmedSegment.match(/<br\s*\/?>/i)) {
      segmentLines = LINE_CONFIG.BR_LINES
    } else if (trimmedSegment.match(/<[^>]+>/)) {
      // HTML标签内容
      const tempResult = calculateLinesFromHTML(trimmedSegment)
      segmentLines = tempResult.totalLines
    } else {
      // 纯文本内容
      segmentLines = calculateTextLines(trimmedSegment)
    }
    
    // 检查是否可以完整添加这个段落
    if (currentLines + segmentLines <= targetLines) {
      truncatedHtml += trimmedSegment
      currentLines += segmentLines
    } else {
      // 尝试部分截取
      const remainingLines = targetLines - currentLines
      
      if (remainingLines > 0) {
        // 对于段落标签，尝试截取内容
        if (trimmedSegment.match(/<p[^>]*>(.*?)<\/p>/is)) {
          const pMatch = trimmedSegment.match(/<p([^>]*)>(.*?)<\/p>/is)
          if (pMatch) {
            const pContent = pMatch[2].replace(/<[^>]*>/g, '')
            const truncatedContent = truncateTextByLines(pContent, remainingLines)
            if (truncatedContent) {
              truncatedHtml += `<p${pMatch[1]}>${truncatedContent}</p>`
            }
          }
          break
        }
        // 对于纯文本，直接截取
        else if (!trimmedSegment.match(/<[^>]+>/)) {
          const truncatedText = truncateTextByLines(trimmedSegment, remainingLines)
          if (truncatedText) {
            truncatedHtml += truncatedText
          }
          break
        }
      }
      break
    }
  }
  
  // 最终清理结果
  const result = cleanHTML(truncatedHtml)
  return result || html.substring(0, 100) + '...'
}

// 解析富文本内容，计算总行数
function parseRichTextContent(content) {
  if (!content) return { displayContent: '', totalLines: 0, imageCount: 0 }
  
  let totalLines = 0
  let imageCount = 0
  let displayContent = content
  
  // 如果传入的是字符串格式的富文本HTML
  if (typeof content === 'string') {
    displayContent = content
    const result = calculateLinesFromHTML(content)
    totalLines = result.totalLines
    imageCount = result.imageCount
  }
  
  return { displayContent, totalLines, imageCount }
}

// 解析富文本内容并计算行数
const { displayContent, totalLines, imageCount } = parseRichTextContent(props.message.content || '')

// 计算内容级别
const contentLevel = computed(() => {
  if (totalLines <= LINE_CONFIG.SHORT_LIMIT) {
    return 'short'  // 短内容：5行以内
  } else if (totalLines <= LINE_CONFIG.MEDIUM_LIMIT) {
    return 'medium' // 中等内容：5-15行
  } else {
    return 'long'   // 长内容：15行以上
  }
})

// 获取要显示的富文本内容
const getDisplayContent = () => {
  if (!displayContent) return ''
  
  let htmlContent = displayContent
  
  // 先清理HTML内容
  htmlContent = cleanHTML(htmlContent)
  
  // 处理图片标签，添加样式
  htmlContent = htmlContent.replace(
    /<img([^>]*?)>/g, 
    '<img$1 style="width: 100% !important; max-width: 500rpx !important; height: auto !important; border-radius: 12rpx !important; margin: 16rpx 0 !important; display: block !important; object-fit: cover !important; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1) !important;">'
  )
  
  // 对于中等长度内容且未展开时，截取内容
  if (contentLevel.value === 'medium' && !props.message.expanded) {
    const targetLines = LINE_CONFIG.SHORT_LIMIT
    htmlContent = truncateHTMLByLines(htmlContent, targetLines)
  }
  
  // 对于长内容，显示摘要
  if (contentLevel.value === 'long') {
    const targetLines = LINE_CONFIG.PREVIEW_LINES
    htmlContent = truncateHTMLByLines(htmlContent, targetLines)
  }
  
  // 最终清理，确保没有空白开头
  return cleanHTML(htmlContent)
}

// 获取优先级文本
const getPriorityText = (priority) => {
  return PRIORITY_MAP[priority] || priority
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  
  try {
    const time = new Date(timeStr)
    const now = new Date()
    const diff = now - time
    
    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`
    } else {
      const month = String(time.getMonth() + 1).padStart(2, '0')
      const date = String(time.getDate()).padStart(2, '0')
      const hours = String(time.getHours()).padStart(2, '0')
      const minutes = String(time.getMinutes()).padStart(2, '0')
      
      if (time.getFullYear() === now.getFullYear()) {
        return `${month}-${date} ${hours}:${minutes}`
      } else {
        return `${time.getFullYear()}-${month}-${date}`
      }
    }
  } catch (error) {
    return String(timeStr)
  }
}

// 消息点击处理
const handleMessageClick = () => {
  emit('messageClick', props.message, props.index)
}

// 切换内容展开/折叠
const toggleContent = () => {
  emit('toggleExpanded', props.message.id, props.index)
}

// 查看完整内容
const viewFullContent = () => {
  emit('viewDetail', props.message)
}

// 富文本加载完成事件
const onRichTextLoad = () => {
  // 富文本加载完成后可以进行更精确的行数计算
}

// 处理富文本中的点击事件
const handleRichTextClick = (e) => {
  console.log('Rich text item clicked:', e.detail)
  
  // 处理图片点击预览
  if (e.detail.node && e.detail.node.name === 'img') {
    const imgSrc = e.detail.node.attrs?.src
    if (imgSrc) {
      // 获取所有图片URL用于预览
      const allImages = getAllImageUrls()
      uni.previewImage({
        current: imgSrc,
        urls: allImages
      })
    }
  }
  
  // 处理链接点击
  if (e.detail.node && e.detail.node.name === 'a') {
    const href = e.detail.node.attrs?.href
    if (href) {
      // 处理链接跳转
      console.log('Link clicked:', href)
    }
  }
}

// 获取所有图片URL
const getAllImageUrls = () => {
  const urls = []
  
  if (typeof displayContent === 'string') {
    // 从HTML字符串中提取图片
    const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/g
    let match
    while ((match = imgRegex.exec(displayContent)) !== null) {
      urls.push(match[1])
    }
  }
  
  return urls
}
</script>

<style scoped>
/* 消息项动画 */
.message-item {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30rpx);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 消息卡片 */
.message-card {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(239, 68, 68, 0.08);
  border: 2rpx solid rgba(239, 68, 68, 0.05);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 40rpx rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.1);
}

/* 装饰线条 */
.decoration-line {
  height: 6rpx;
  background: linear-gradient(90deg, #ef4444 0%, #f87171 50%, #fca5a5 100%);
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: flex-start;
  padding: 32rpx 32rpx 16rpx;
  position: relative;
}

.message-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  border: 3rpx solid rgba(239, 68, 68, 0.1);
  flex-shrink: 0;
}

.icon-text {
  font-size: 32rpx;
}

.header-content {
  flex: 1;
}

.title-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.message-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  letter-spacing: 0.5rpx;
  flex: 1;
}

.message-time {
  font-size: 22rpx;
  color: #9ca3af;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.sender-info {
  margin-top: 4rpx;
}

.sender-name {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
}

/* 消息内容 */
.message-body {
  padding: 0 32rpx 32rpx;
}

.content-wrapper {
  position: relative;
}

/* 富文本样式 */
.rich-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
  word-break: break-word;
}

/* 富文本内部样式调整 */
.rich-text :deep(p) {
  margin: 0 0 16rpx 0;
  line-height: 1.8;
}

.rich-text :deep(div) {
  margin: 0 0 12rpx 0;
  line-height: 1.8;
}

.rich-text :deep(h1),
.rich-text :deep(h2),
.rich-text :deep(h3),
.rich-text :deep(h4),
.rich-text :deep(h5),
.rich-text :deep(h6) {
  margin: 24rpx 0 16rpx 0;
  font-weight: 600;
  line-height: 1.4;
}

.rich-text :deep(h1) { font-size: 36rpx; }
.rich-text :deep(h2) { font-size: 34rpx; }
.rich-text :deep(h3) { font-size: 32rpx; }
.rich-text :deep(h4) { font-size: 30rpx; }
.rich-text :deep(h5) { font-size: 28rpx; }
.rich-text :deep(h6) { font-size: 26rpx; }

.rich-text :deep(ul),
.rich-text :deep(ol) {
  margin: 16rpx 0;
  padding-left: 32rpx;
}

.rich-text :deep(li) {
  margin: 8rpx 0;
  line-height: 1.8;
}

.rich-text :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 16rpx 0;
  border-radius: 12rpx;
  /* 图片固定占据4行高度的视觉空间 */
  min-height: calc(1.8em * 4);
  object-fit: cover;
  display: block;
}

.rich-text :deep(a) {
  color: #ef4444;
  text-decoration: underline;
}

.rich-text :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.rich-text :deep(em) {
  font-style: italic;
}

.rich-text :deep(blockquote) {
  margin: 16rpx 0;
  padding: 16rpx 24rpx;
  background: #f9fafb;
  border-left: 6rpx solid #ef4444;
  border-radius: 0 8rpx 8rpx 0;
}

.rich-text :deep(code) {
  background: #f3f4f6;
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  font-family: 'Courier New', monospace;
  font-size: 26rpx;
}

.rich-text :deep(pre) {
  background: #1f2937;
  color: #f9fafb;
  padding: 20rpx;
  border-radius: 12rpx;
  margin: 16rpx 0;
  overflow-x: auto;
}

.rich-text :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16rpx 0;
}

.rich-text :deep(th),
.rich-text :deep(td) {
  border: 1rpx solid #e5e7eb;
  padding: 12rpx;
  text-align: left;
}

.rich-text :deep(th) {
  background: #f9fafb;
  font-weight: 600;
}

/* 折叠状态的内容 */
.content-collapsed {
  overflow: hidden;
  max-height: calc(1.8em * 5); /* 5行的高度 */
  position: relative;
}

/* 切换按钮区域 */
.toggle-section {
  position: relative;
  margin-top: 32rpx;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 100%;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(239, 68, 68, 0.2);
  padding: 24rpx 32rpx;
  border-radius: 40rpx;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8rpx 24rpx rgba(239, 68, 68, 0.15),
    0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}

/* 悬浮态光效 */
.toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(239, 68, 68, 0.1), 
    transparent
  );
  transition: left 0.6s ease;
}

.toggle-btn:active::before {
  left: 100%;
}

/* 点击态效果 */
.toggle-btn:active {
  transform: translateY(2rpx) scale(0.98);
  box-shadow: 
    0 4rpx 12rpx rgba(239, 68, 68, 0.2),
    0 1rpx 3rpx rgba(0, 0, 0, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

/* 文字样式 */
.toggle-text {
  font-size: 28rpx;
  color: #ef4444;
  font-weight: 600;
  letter-spacing: 0.5rpx;
  z-index: 2;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-btn:active .toggle-text {
  color: #dc2626;
}

/* 图标容器 */
.toggle-icon {
  width: 44rpx;
  height: 44rpx;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.3);
}

/* 旋转动画 */
.toggle-icon.rotated {
  transform: rotate(180deg);
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

/* 箭头图标 */
.icon-arrow {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  transition: transform 0.3s ease;
  line-height: 1;
}

/* 激活态图标效果 */
.toggle-btn:active .toggle-icon {
  transform: scale(0.9);
  box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.4);
}

.toggle-btn:active .toggle-icon.rotated {
  transform: rotate(180deg) scale(0.9);
}

/* 渐变遮罩 */
.fade-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80rpx;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 30%,
    rgba(255, 255, 255, 0.8) 70%,
    white 100%
  );
  pointer-events: none;
  border-radius: 0 0 12rpx 12rpx;
}

/* 预览内容 */
.content-preview {
  margin-bottom: 24rpx;
}

/* 操作区域 */
.action-section {
  display: flex;
  justify-content: center;
}

.detail-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50rpx;
  padding: 20rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.detail-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.4);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.btn-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.detail-btn:active .btn-arrow {
  transform: translateX(4rpx);
}

.arrow-icon {
  font-size: 24rpx;
  color: white;
  font-weight: bold;
}

/* 消息状态栏 */
.message-status {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
  flex-wrap: wrap;
}

.priority-tag {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.priority-high, .priority-urgent {
  background: #fee2e2;
  color: #dc2626;
  border: 1rpx solid #fecaca;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
  border: 1rpx solid #fed7aa;
}

.priority-low {
  background: #ecfdf5;
  color: #059669;
  border: 1rpx solid #a7f3d0;
}

.category-tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  border: 1rpx solid #e5e7eb;
}

.priority-text, .category-text {
  font-size: 22rpx;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .message-header {
    padding: 24rpx 24rpx 12rpx;
  }
  
  .message-body {
    padding: 0 24rpx 24rpx;
  }
  
  .message-icon {
    width: 64rpx;
    height: 64rpx;
    margin-right: 16rpx;
  }
  
  .icon-text {
    font-size: 28rpx;
  }
  
  .message-title {
    font-size: 30rpx;
  }
  
  .rich-text {
    font-size: 26rpx;
  }
  
  .toggle-btn {
    padding: 20rpx 24rpx;
  }
  
  .toggle-text {
    font-size: 26rpx;
  }
  
  .toggle-icon {
    width: 36rpx;
    height: 36rpx;
  }
  
  .icon-arrow {
    font-size: 20rpx;
  }
  
  .fade-mask {
    height: 60rpx;
  }
  
  .content-collapsed {
    max-height: calc(1.8em * 5);
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .message-card {
    background: #1f2937;
    border-color: rgba(239, 68, 68, 0.2);
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  }
  
  .message-title {
    color: #f9fafb;
  }
  
  .rich-text {
    color: #d1d5db;
  }
  
  .rich-text :deep(strong) {
    color: #f9fafb;
  }
  
  .rich-text :deep(blockquote) {
    background: #374151;
    color: #d1d5db;
  }
  
  .rich-text :deep(code) {
    background: #374151;
    color: #d1d5db;
  }
  
  .rich-text :deep(th) {
    background: #374151;
  }
  
  .rich-text :deep(th),
  .rich-text :deep(td) {
    border-color: #4b5563;
  }
  
  .message-time, .sender-name {
    color: #9ca3af;
  }
  
  .message-icon {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 100%);
    border-color: rgba(239, 68, 68, 0.2);
  }
  
  .toggle-btn {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 100%);
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 
      0 8rpx 24rpx rgba(0, 0, 0, 0.3),
      0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  }
  
  .toggle-btn:active {
    background: linear-gradient(135deg, #3c2626 0%, #4a2c2c 100%);
    border-color: rgba(239, 68, 68, 0.4);
  }
  
  .fade-mask {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(31, 41, 55, 0.3) 30%,
      rgba(31, 41, 55, 0.8) 70%,
      #1f2937 100%
    );
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .message-item {
    animation: none;
  }
  
  .message-card,
  .detail-btn,
  .toggle-btn,
  .toggle-icon,
  .toggle-text,
  .icon-arrow {
    transition: none;
  }
  
  .toggle-btn::before {
    display: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .toggle-btn {
    border-width: 4rpx;
    border-color: #ef4444;
    background: #fef2f2;
  }
  
  .toggle-text {
    color: #dc2626;
    font-weight: 700;
  }
}
</style>