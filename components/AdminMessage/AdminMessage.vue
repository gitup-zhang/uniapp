<template>
  <view class="admin-message-item">
    <!-- 管理员消息 -->
    <view class="admin-message">
      <!-- 管理员头像 -->
      <view class="avatar-wrapper">
        <view class="admin-avatar">
          <text class="avatar-text">管</text>
        </view>
        <view class="admin-badge">
          <text class="badge-text">管理员</text>
        </view>
      </view>

      <!-- 消息内容区域 -->
      <view class="message-content-wrapper">
        <!-- 消息头部 -->
        <view class="message-header">
          <text class="sender-name">{{ message.sender_name || '系统管理员' }}</text>
          <text class="message-time">{{ formatMessageTime(message.send_time) }}</text>
        </view>

        <!-- 消息气泡 -->
        <view 
          class="message-bubble" 
          :class="{ 
            'clickable': contentLevel === 'long'
          }"
          @tap="handleMessageTap"
        >
          <!-- 消息标题 -->
          <view v-if="message.title" class="message-title">
            <text class="title-text">{{ message.title }}</text>
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 富文本内容 -->
            <view v-if="displayContent" class="rich-text-content">
              <rich-text 
                :nodes="getDisplayNodes()" 
                class="rich-text"
                @itemclick="handleRichTextClick"
              ></rich-text>
            </view>
            
            <!-- 展开/收起按钮（中等长度内容） -->
            <view 
              v-if="contentLevel === 'medium'" 
              class="expand-btn"
              @tap.stop="toggleExpand"
            >
              <text class="expand-text">
                {{ isExpanded ? '收起' : '查看全部' }}
              </text>
              <text class="expand-icon" :class="{ 'rotated': isExpanded }">
                ▼
              </text>
            </view>
          </view>

          <!-- 点击查看详情提示（长内容） -->
          <view v-if="contentLevel === 'long'" class="view-detail-hint">
            <text class="hint-text">点击查看详情</text>
            <text class="hint-arrow">›</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['messageClick', 'actionClick', 'markRead'])

// 组件状态
const isExpanded = ref(false)

// 内容行数阈值配置
const LINE_CONFIG = {
  SHORT_LIMIT: 3,      // 短内容：5行以内
  MEDIUM_LIMIT: 15,    // 中等内容：6-15行
  
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
  CHARS_PER_LINE: 20,      // 每行大约字符数（根据实际UI调整）
  
  // 容器配置
  CONTAINER_WIDTH: 600,    // 容器宽度（rpx），用于更精确的计算
  FONT_SIZE: 28,          // 字体大小（rpx）
  LINE_HEIGHT: 1.6,       // 行高倍数
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

// 提取节点中的纯文本内容
function extractTextFromNodes(nodes) {
  if (!Array.isArray(nodes)) return ''
  
  let text = ''
  
  for (const node of nodes) {
    if (typeof node === 'string') {
      text += node
    } else if (node.type === 'text') {
      text += node.text || ''
    } else if (node.children) {
      text += extractTextFromNodes(node.children)
    }
  }
  
  return text
}

// 从HTML字符串计算行数（改进版）
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

// 从富文本节点数组计算行数（改进版）
function calculateLinesFromNodes(nodes) {
  if (!Array.isArray(nodes)) return { totalLines: 0, imageCount: 0 }
  
  let totalLines = 0
  let imageCount = 0
  
  function calculateNodeLines(nodeList) {
    let lines = 0
    
    for (const node of nodeList) {
      if (typeof node === 'string') {
        // 字符串节点
        const textLines = calculateTextLines(node)
        lines += textLines
      } else if (node.type === 'text') {
        // 文本节点
        const textLines = calculateTextLines(node.text || '')
        lines += textLines
      } else if (node.name) {
        const tagName = node.name.toLowerCase()
        
        switch (tagName) {
          case 'img':
            imageCount++
            lines += LINE_CONFIG.IMAGE_LINES
            break
            
          case 'br':
            lines += LINE_CONFIG.BR_LINES
            break
            
          case 'p':
            // 段落 - 计算内容实际行数
            if (node.children) {
              const childLines = calculateNodeLines(node.children)
              lines += Math.max(childLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN
            } else {
              lines += LINE_CONFIG.PARAGRAPH_MIN_LINES + LINE_CONFIG.BLOCK_MARGIN
            }
            break
            
          case 'div':
            // div块 - 计算内容实际行数
            if (node.children) {
              const childLines = calculateNodeLines(node.children)
              if (childLines > 0) {
                lines += childLines + LINE_CONFIG.BLOCK_MARGIN
              }
            }
            break
            
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            // 标题 - 计算内容实际行数，考虑字体大小
            const headingLevel = parseInt(tagName.substring(1))
            const headingFontSize = LINE_CONFIG.FONT_SIZE + 4 * (7 - headingLevel) // 更大的标题字体更大
            
            if (node.children) {
              const headingText = extractTextFromNodes(node.children)
              const headingLines = calculateTextLines(headingText, headingFontSize)
              const minLines = LINE_CONFIG.TITLE_MIN_LINES[tagName] || 1
              lines += Math.max(headingLines, minLines) + LINE_CONFIG.BLOCK_MARGIN
            } else {
              lines += LINE_CONFIG.TITLE_MIN_LINES[tagName] + LINE_CONFIG.BLOCK_MARGIN
            }
            break
            
          case 'li':
            // 列表项 - 计算内容实际行数
            if (node.children) {
              const liLines = calculateNodeLines(node.children)
              lines += Math.max(liLines, LINE_CONFIG.LIST_ITEM_MIN_LINES)
            } else {
              lines += LINE_CONFIG.LIST_ITEM_MIN_LINES
            }
            break
            
          case 'ul':
          case 'ol':
            // 列表容器
            if (node.children) {
              const listLines = calculateNodeLines(node.children)
              lines += listLines + LINE_CONFIG.BLOCK_MARGIN
            }
            break
            
          case 'blockquote':
            // 引用块 - 计算内容实际行数
            if (node.children) {
              const quoteLines = calculateNodeLines(node.children)
              lines += Math.max(quoteLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN
            } else {
              lines += LINE_CONFIG.PARAGRAPH_MIN_LINES + LINE_CONFIG.BLOCK_MARGIN
            }
            break
            
          case 'pre':
            // 代码块 - 按换行符计算
            if (node.children) {
              const codeText = extractTextFromNodes(node.children)
              const codeLines = codeText.split(/\n/).length
              lines += codeLines + LINE_CONFIG.BLOCK_MARGIN
            }
            break
            
          default:
            // 其他元素
            const isInline = ['span', 'strong', 'em', 'b', 'i', 'u', 'small', 'mark', 'del', 'ins', 'sub', 'sup', 'code', 'a'].includes(tagName)
            
            if (node.children) {
              const childLines = calculateNodeLines(node.children)
              if (isInline) {
                lines += childLines // 内联元素不添加额外间距
              } else {
                lines += childLines + (childLines > 0 ? LINE_CONFIG.BLOCK_MARGIN : 0) // 块级元素添加间距
              }
            }
        }
      }
    }
    
    return lines
  }
  
  totalLines = calculateNodeLines(nodes)
  
  return { totalLines: Math.max(totalLines, 0.5), imageCount }
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
  // 如果传入的是富文本节点数组
  else if (Array.isArray(content)) {
    displayContent = content
    const result = calculateLinesFromNodes(content)
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
    return 'medium' // 中等内容：6-15行
  } else {
    return 'long'   // 长内容：15行以上
  }
})

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

// 按行数截取HTML内容（改进版）
function truncateHTMLByLines(html, targetLines) {
  if (!html) return ''
  
  const currentResult = calculateLinesFromHTML(html)
  if (currentResult.totalLines <= targetLines) {
    return html
  }
  
  // 更精确的截取逻辑
  let truncatedHtml = ''
  let currentLines = 0
  
  // 先处理完整的块级元素
  const blockElements = [
    { regex: /<img[^>]*>/gi, lines: LINE_CONFIG.IMAGE_LINES },
    { regex: /<br\s*\/?>/gi, lines: LINE_CONFIG.BR_LINES },
    { regex: /<h[1-6][^>]*>.*?<\/h[1-6]>/gis, lines: null }, // 需要计算内容
    { regex: /<p[^>]*>.*?<\/p>/gis, lines: null }, // 需要计算内容
    { regex: /<blockquote[^>]*>.*?<\/blockquote>/gis, lines: null }, // 需要计算内容
    { regex: /<pre[^>]*>.*?<\/pre>/gis, lines: null }, // 需要计算内容
    { regex: /<[uo]l[^>]*>.*?<\/[uo]l>/gis, lines: null }, // 需要计算内容
  ]
  
  let remainingHtml = html
  let processedHtml = ''
  
  // 逐个处理块级元素
  for (const element of blockElements) {
    const matches = remainingHtml.match(element.regex) || []
    
    for (const match of matches) {
      let elementLines
      
      if (element.lines !== null) {
        elementLines = element.lines
      } else {
        // 计算元素的实际行数
        const tempResult = calculateLinesFromHTML(match)
        elementLines = tempResult.totalLines
      }
      
      if (currentLines + elementLines <= targetLines) {
        processedHtml += match
        currentLines += elementLines
        remainingHtml = remainingHtml.replace(match, '') // 从剩余内容中移除
      } else {
        // 如果是可以部分截取的元素（如段落），尝试部分截取
        if (match.match(/<p[^>]*>.*?<\/p>/is)) {
          const pContent = match.replace(/<p[^>]*>|<\/p>/gi, '')
          const remainingLines = targetLines - currentLines - LINE_CONFIG.BLOCK_MARGIN
          if (remainingLines > 0) {
            const truncatedContent = truncateTextByLines(pContent, remainingLines)
            if (truncatedContent) {
              processedHtml += match.replace(/<p([^>]*)>.*?<\/p>/is, `<p$1>${truncatedContent}</p>`)
              currentLines = targetLines
            }
          }
        }
        break
      }
      
      if (currentLines >= targetLines) break
    }
    
    if (currentLines >= targetLines) break
  }
  
  // 处理剩余的文本内容
  if (currentLines < targetLines && remainingHtml.trim()) {
    const remainingText = remainingHtml.replace(/<[^>]*>/g, '').trim()
    if (remainingText) {
      const remainingLines = targetLines - currentLines
      const truncatedText = truncateTextByLines(remainingText, remainingLines)
      if (truncatedText) {
        processedHtml += truncatedText
      }
    }
  }
  
  return processedHtml || html
}

// 按行数截取富文本节点（改进版）
function truncateNodesByLines(nodes, targetLines) {
  let currentLines = 0
  const result = []
  
  for (const node of nodes) {
    if (currentLines >= targetLines) break
    
    if (typeof node === 'string') {
      // 字符串节点
      const textLines = calculateTextLines(node)
      if (currentLines + textLines <= targetLines) {
        result.push(node)
        currentLines += textLines
      } else {
        const remainingLines = targetLines - currentLines
        if (remainingLines > 0) {
          const truncatedText = truncateTextByLines(node, remainingLines)
          if (truncatedText) {
            result.push(truncatedText)
            currentLines = targetLines
          }
        }
        break
      }
    } else if (node.type === 'text') {
      // 文本节点
      const textLines = calculateTextLines(node.text || '')
      if (currentLines + textLines <= targetLines) {
        result.push(node)
        currentLines += textLines
      } else {
        const remainingLines = targetLines - currentLines
        if (remainingLines > 0) {
          const truncatedText = truncateTextByLines(node.text || '', remainingLines)
          if (truncatedText) {
            result.push({
              ...node,
              text: truncatedText
            })
            currentLines = targetLines
          }
        }
        break
      }
    } else if (node.name) {
      const tagName = node.name.toLowerCase()
      
      // 计算这个节点需要的行数
      const nodeLines = calculateLinesFromNodes([node]).totalLines
      
      if (currentLines + nodeLines <= targetLines) {
        // 完整添加节点
        result.push(node)
        currentLines += nodeLines
      } else {
        // 尝试部分截取（仅对某些可截取的元素）
        const truncatableElements = ['p', 'div', 'li', 'blockquote']
        
        if (truncatableElements.includes(tagName) && node.children) {
          const remainingLines = targetLines - currentLines - (tagName === 'p' ? LINE_CONFIG.BLOCK_MARGIN : 0)
          
          if (remainingLines > 0) {
            const truncatedChildren = truncateNodesByLines(node.children, remainingLines)
            if (truncatedChildren.length > 0) {
              result.push({
                ...node,
                children: truncatedChildren
              })
              currentLines = targetLines
            }
          }
        }
        break
      }
    }
  }
  
  return result
}

// 计算已有节点的行数（用于截取时的辅助计算）
function calculateNodesLines(nodes) {
  const result = calculateLinesFromNodes(nodes)
  return result.totalLines
}

// 获取要显示的富文本节点
const getDisplayNodes = () => {
  if (!displayContent) return []
  
  // 如果是字符串格式的HTML
  if (typeof displayContent === 'string') {
    let htmlContent = displayContent
    
    // 处理图片标签，添加样式
    htmlContent = htmlContent.replace(
      /<img([^>]*?)>/g, 
      '<img$1 style="width: 100% !important; max-width: 500rpx !important; height: auto !important; border-radius: 12rpx !important; margin: 16rpx 0 !important; display: block !important; object-fit: cover !important; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1) !important;">'
    )
    
    // 对于中等长度内容且未展开时，截取内容
    if (contentLevel.value === 'medium' && !isExpanded.value) {
      const targetLines = LINE_CONFIG.SHORT_LIMIT
      htmlContent = truncateHTMLByLines(htmlContent, targetLines)
    }
    
    // 对于长内容，显示摘要
    if (contentLevel.value === 'long') {
      const targetLines = LINE_CONFIG.SHORT_LIMIT
      htmlContent = truncateHTMLByLines(htmlContent, targetLines)
    }
    
    return htmlContent
  }
  
  // 如果是节点数组格式
  if (Array.isArray(displayContent)) {
    // 处理节点数组中的图片
    const processNodes = (nodes) => {
      return nodes.map(node => {
        if (node.name === 'img') {
          return {
            ...node,
            attrs: {
              ...node.attrs,
              style: 'width: 100% !important; max-width: 500rpx !important; height: auto !important; border-radius: 12rpx !important; margin: 16rpx 0 !important; display: block !important; object-fit: cover !important; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1) !important;'
            }
          }
        } else if (node.children) {
          return {
            ...node,
            children: processNodes(node.children)
          }
        }
        return node
      })
    }
    
    let processedContent = processNodes(displayContent)
    
    // 对于中等长度内容的截取处理
    if (contentLevel.value === 'medium' && !isExpanded.value) {
      const targetLines = LINE_CONFIG.SHORT_LIMIT
      return truncateNodesByLines(processedContent, targetLines)
    }
    
    // 对于长内容的摘要处理
    if (contentLevel.value === 'long') {
      const targetLines = LINE_CONFIG.SHORT_LIMIT
      return truncateNodesByLines(processedContent, targetLines)
    }
    
    return processedContent
  }
  
  return []
}

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
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
      // 可以在这里添加链接处理逻辑
    }
  }
}

// 获取所有图片URL
const getAllImageUrls = () => {
  const urls = []
  
  const extractImages = (content) => {
    if (typeof content === 'string') {
      // 从HTML字符串中提取图片
      const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/g
      let match
      while ((match = imgRegex.exec(content)) !== null) {
        urls.push(match[1])
      }
    } else if (Array.isArray(content)) {
      // 从节点数组中提取图片
      const findImages = (nodes) => {
        for (const node of nodes) {
          if (node.name === 'img' && node.attrs?.src) {
            urls.push(node.attrs.src)
          } else if (node.children) {
            findImages(node.children)
          }
        }
      }
      findImages(content)
    }
  }
  
  extractImages(displayContent)
  return urls
}

// 格式化消息时间
const formatMessageTime = (timeStr) => {
  if (!timeStr) return ''
  
  const time = new Date(timeStr)
  const now = new Date()
  
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }
  
  if (isSameDay(time, now)) {
    return `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
  } else {
    return `${time.getMonth() + 1}-${time.getDate()} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
  }
}

// 处理消息点击
const handleMessageTap = () => {
  // 对于长内容，直接跳转到详情页
  if (contentLevel.value === 'long') {
    emit('messageClick', props.message)
    return
  }
  
  // 短内容和中等长度内容不做任何操作，中等长度内容通过专门的展开/收起按钮处理
}

// 处理操作按钮点击
const handleAction = (action) => {
  emit('actionClick', action, props.message)
}
</script>

<style scoped>
.admin-message-item {
  margin-bottom: 24rpx;
  animation: fadeInUp 0.4s ease-out;
}

/* 管理员消息样式 */
.admin-message {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}

/* 管理员头像 */
.avatar-wrapper {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.admin-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.3);
}

.avatar-text {
  font-size: 28rpx;
  font-weight: 700;
  color: white;
}

.admin-badge {
  background: #f59e0b;
  color: white;
  font-size: 18rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.2);
}

.badge-text {
  font-size: 18rpx;
  font-weight: 600;
  color: white;
}

/* 消息内容包装器 */
.message-content-wrapper {
  flex: 1;
  max-width: calc(100% - 120rpx);
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.sender-name {
  font-size: 26rpx;
  color: #334155;
  font-weight: 600;
}

.message-time {
  font-size: 22rpx;
  color: #94a3b8;
}

/* 消息气泡 */
.message-bubble {
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid #f1f5f9;
  position: relative;
  transition: all 0.3s ease;
}

.message-bubble.clickable {
  cursor: pointer;
}

.message-bubble.clickable:hover {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

.message-bubble.clickable:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* 消息标题 */
.message-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f1f5f9;
}

.title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  flex: 1;
}

/* 消息内容 */
.message-content {
  margin-bottom: 16rpx;
}

/* 富文本内容样式 */
.rich-text-content {
  margin-bottom: 16rpx;
}

.rich-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #334155;
  word-break: break-word;
}

/* 富文本内部元素样式 */
.rich-text :deep(p) {
  margin: 12rpx 0;
  line-height: 1.6;
}

.rich-text :deep(h1) {
  font-size: 36rpx;
  font-weight: 700;
  margin: 20rpx 0 16rpx 0;
  color: #1e293b;
}

.rich-text :deep(h2) {
  font-size: 32rpx;
  font-weight: 600;
  margin: 18rpx 0 14rpx 0;
  color: #334155;
}

.rich-text :deep(h3) {
  font-size: 30rpx;
  font-weight: 600;
  margin: 16rpx 0 12rpx 0;
  color: #475569;
}

.rich-text :deep(strong) {
  font-weight: 600;
  color: #1e293b;
}

.rich-text :deep(em) {
  font-style: italic;
  color: #64748b;
}

.rich-text :deep(a) {
  color: #667eea;
  text-decoration: underline;
}

/* 修改图片样式 - 统一宽度，高度自适应 */
.rich-text :deep(img) {
  width: 100%;           /* 统一宽度为容器的100% */
  max-width: 500rpx;     /* 设置最大宽度避免过大 */
  height: auto;          /* 高度自动，保持宽高比 */
  border-radius: 12rpx;
  margin: 16rpx 0;       /* 增加上下间距 */
  display: block;
  object-fit: cover;     /* 确保图片填充方式 */
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

.rich-text :deep(ul), .rich-text :deep(ol) {
  margin: 12rpx 0;
  padding-left: 40rpx;
}

.rich-text :deep(li) {
  margin: 8rpx 0;
  line-height: 1.6;
}

.rich-text :deep(blockquote) {
  margin: 16rpx 0;
  padding: 16rpx 20rpx;
  background: #f8fafc;
  border-left: 6rpx solid #667eea;
  border-radius: 0 8rpx 8rpx 0;
  color: #64748b;
  font-style: italic;
}

.rich-text :deep(code) {
  background: #f1f5f9;
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  font-family: 'Courier New', monospace;
  font-size: 24rpx;
  color: #e11d48;
}

.rich-text :deep(pre) {
  background: #1e293b;
  color: #f1f5f9;
  padding: 20rpx;
  border-radius: 12rpx;
  overflow-x: auto;
  margin: 16rpx 0;
}

.rich-text :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

/* 展开按钮 */
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 16rpx;
  padding: 12rpx;
  background: #f8fafc;
  border-radius: 12rpx;
  border: 2rpx solid #e2e8f0;
  transition: all 0.2s ease;
}

.expand-btn:active {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.expand-text {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 500;
}

.expand-icon {
  font-size: 20rpx;
  color: #667eea;
  transition: transform 0.2s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* 查看详情提示 */
.view-detail-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12rpx;
  margin-top: 16rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 500;
}

.hint-arrow {
  font-size: 20rpx;
  color: #667eea;
}

/* 动画定义 */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .admin-message {
    gap: 16rpx;
  }
  
  .message-bubble {
    padding: 20rpx;
  }
  
  /* 小屏幕下调整图片最大宽度 */
  .rich-text :deep(img) {
    max-width: 400rpx;
  }
}

/* 暗黑模式适配 */
/* @media (prefers-color-scheme: dark) {
  .message-bubble {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
  }
  
  .title-text {
    color: #f1f5f9;
  }
  
  .rich-text {
    color: #cbd5e1;
  }
  
  .sender-name {
    color: #f1f5f9;
  }
  
  .expand-btn {
    background: #334155;
    border-color: #475569;
  }
  
  .view-detail-hint {
    background: rgba(102, 126, 234, 0.1);
  }
  
  .rich-text :deep(h1),
  .rich-text :deep(h2),
  .rich-text :deep(h3) {
    color: #f1f5f9;
  }
  
  .rich-text :deep(strong) {
    color: #f1f5f9;
  }
  
  .rich-text :deep(blockquote) {
    background: #334155;
    color: #94a3b8;
  }
  
  .rich-text :deep(code) {
    background: #334155;
    color: #fca5a5;
  }
  
  .rich-text :deep(pre) {
    background: #0f172a;
  }
  
  
  .rich-text :deep(img) {
    box-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.1);
  }
} */
</style>