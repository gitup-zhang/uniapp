"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  mpHtml();
}
const mpHtml = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
const _sfc_main = {
  __name: "MessageCardUser",
  props: {
    message: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  emits: ["messageClick", "toggleExpanded", "viewDetail"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const LINE_CONFIG = {
      SHORT_LIMIT: 5,
      // 短内容：5行以内
      MEDIUM_LIMIT: 15,
      // 中等内容：5-15行
      PREVIEW_LINES: 3,
      // 预览内容行数
      // 富文本元素行数配置
      IMAGE_LINES: 5,
      // 一张图片占4行
      BR_LINES: 1,
      // <br> 标签占1行
      PARAGRAPH_MIN_LINES: 1,
      // 段落最小行数
      TITLE_MIN_LINES: {
        // 标题最小行数
        h1: 2,
        h2: 1.5,
        h3: 1.5,
        h4: 1,
        h5: 1,
        h6: 1
      },
      LIST_ITEM_MIN_LINES: 1,
      // 列表项最小行数
      BLOCK_MARGIN: 0.5,
      // 块级元素间距
      // 文本行数计算（基于容器宽度和字体大小）
      CHARS_PER_LINE: 28,
      // 每行大约字符数（根据实际UI调整）
      // 容器配置
      CONTAINER_WIDTH: 600,
      // 容器宽度（rpx），用于更精确的计算
      FONT_SIZE: 28,
      // 字体大小（rpx）
      LINE_HEIGHT: 1.8
      // 行高倍数
    };
    function calculateTextLines(text, fontSize = LINE_CONFIG.FONT_SIZE) {
      if (!text || typeof text !== "string")
        return 0;
      const cleanText = text.trim();
      if (!cleanText)
        return 0;
      const lines = cleanText.split(/\n+/);
      let totalLines2 = 0;
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine)
          continue;
        let charWidth = 0;
        for (const char of trimmedLine) {
          if (/[\u4e00-\u9fa5]/.test(char)) {
            charWidth += 2;
          } else {
            charWidth += 1;
          }
        }
        const containerWidthPx = LINE_CONFIG.CONTAINER_WIDTH * 0.5;
        const fontSizePx = fontSize * 0.5;
        const charsPerLine = Math.floor(containerWidthPx / fontSizePx);
        const linesNeeded = Math.ceil(charWidth / charsPerLine);
        totalLines2 += Math.max(linesNeeded, 1);
      }
      return totalLines2;
    }
    function calculateLinesFromHTML(html) {
      if (!html)
        return { totalLines: 0, imageCount: 0 };
      let totalLines2 = 0;
      let imageCount2 = 0;
      const imgMatches = html.match(/<img[^>]*>/g) || [];
      imageCount2 = imgMatches.length;
      totalLines2 += imageCount2 * LINE_CONFIG.IMAGE_LINES;
      const brMatches = html.match(/<br\s*\/?>/gi) || [];
      totalLines2 += brMatches.length * LINE_CONFIG.BR_LINES;
      const pMatches = html.match(/<p[^>]*>(.*?)<\/p>/gis) || [];
      for (const pMatch of pMatches) {
        const pContent = pMatch.replace(/<p[^>]*>|<\/p>/gi, "").replace(/<[^>]*>/g, "");
        const pLines = calculateTextLines(pContent);
        totalLines2 += Math.max(pLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN;
      }
      const divMatches = html.match(/<div[^>]*>(.*?)<\/div>/gis) || [];
      for (const divMatch of divMatches) {
        const divContent = divMatch.replace(/<div[^>]*>|<\/div>/gi, "").replace(/<[^>]*>/g, "");
        const divLines = calculateTextLines(divContent);
        if (divLines > 0) {
          totalLines2 += divLines + LINE_CONFIG.BLOCK_MARGIN;
        }
      }
      for (let i = 1; i <= 6; i++) {
        const titleMatches = html.match(new RegExp(`<h${i}[^>]*>(.*?)</h${i}>`, "gis")) || [];
        for (const titleMatch of titleMatches) {
          const titleContent = titleMatch.replace(new RegExp(`<h${i}[^>]*>|</h${i}>`, "gi"), "").replace(/<[^>]*>/g, "");
          const titleLines = calculateTextLines(titleContent, LINE_CONFIG.FONT_SIZE + 4 * i);
          const minLines = LINE_CONFIG.TITLE_MIN_LINES[`h${i}`] || 1;
          totalLines2 += Math.max(titleLines, minLines) + LINE_CONFIG.BLOCK_MARGIN;
        }
      }
      const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/gis) || [];
      for (const liMatch of liMatches) {
        const liContent = liMatch.replace(/<li[^>]*>|<\/li>/gi, "").replace(/<[^>]*>/g, "");
        const liLines = calculateTextLines(liContent);
        totalLines2 += Math.max(liLines, LINE_CONFIG.LIST_ITEM_MIN_LINES);
      }
      const ulMatches = html.match(/<ul[^>]*>.*?<\/ul>/gis) || [];
      const olMatches = html.match(/<ol[^>]*>.*?<\/ol>/gis) || [];
      totalLines2 += (ulMatches.length + olMatches.length) * LINE_CONFIG.BLOCK_MARGIN;
      const blockquoteMatches = html.match(/<blockquote[^>]*>(.*?)<\/blockquote>/gis) || [];
      for (const blockquoteMatch of blockquoteMatches) {
        const quoteContent = blockquoteMatch.replace(/<blockquote[^>]*>|<\/blockquote>/gi, "").replace(/<[^>]*>/g, "");
        const quoteLines = calculateTextLines(quoteContent);
        totalLines2 += Math.max(quoteLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN;
      }
      const preMatches = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/gis) || [];
      for (const preMatch of preMatches) {
        const codeContent = preMatch.replace(/<pre[^>]*>|<\/pre>/gi, "").replace(/<[^>]*>/g, "");
        const codeLines = codeContent.split(/\n/).length;
        totalLines2 += codeLines + LINE_CONFIG.BLOCK_MARGIN;
      }
      let remainingText = html.replace(/<img[^>]*>/gi, "").replace(/<br\s*\/?>/gi, "").replace(/<p[^>]*>.*?<\/p>/gis, "").replace(/<div[^>]*>.*?<\/div>/gis, "").replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gis, "").replace(/<li[^>]*>.*?<\/li>/gis, "").replace(/<[uo]l[^>]*>.*?<\/[uo]l>/gis, "").replace(/<blockquote[^>]*>.*?<\/blockquote>/gis, "").replace(/<pre[^>]*>.*?<\/pre>/gis, "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
      if (remainingText) {
        const remainingLines = calculateTextLines(remainingText);
        totalLines2 += remainingLines;
      }
      return { totalLines: Math.max(totalLines2, 0.5), imageCount: imageCount2 };
    }
    function truncateTextByLines(text, targetLines) {
      if (!text || targetLines <= 0)
        return "";
      const textLines = calculateTextLines(text);
      if (textLines <= targetLines)
        return text;
      const charsPerLine = LINE_CONFIG.CHARS_PER_LINE;
      const maxChars = Math.floor(targetLines * charsPerLine);
      if (text.length <= maxChars)
        return text;
      let truncated = text.substring(0, maxChars);
      const breakPoints = ["\n", "。", "！", "？", ".", "!", "?", "；", ";", "，", ",", " "];
      for (const breakPoint of breakPoints) {
        const lastIndex = truncated.lastIndexOf(breakPoint);
        if (lastIndex > maxChars * 0.8) {
          truncated = truncated.substring(0, lastIndex + 1);
          break;
        }
      }
      return truncated + "...";
    }
    function cleanHTML(html) {
      if (!html)
        return "";
      return html.replace(/<p[^>]*>\s*<\/p>/gi, "").replace(/<div[^>]*>\s*<\/div>/gi, "").replace(/^\s+/, "").replace(/\s+$/, "").replace(/^(<br\s*\/?>)+/i, "").replace(/(<br\s*\/?>){3,}/gi, "<br><br>").trim();
    }
    function truncateHTMLByLines(html, targetLines) {
      if (!html)
        return "";
      html = cleanHTML(html);
      const currentResult = calculateLinesFromHTML(html);
      if (currentResult.totalLines <= targetLines) {
        return html;
      }
      let truncatedHtml = "";
      let currentLines = 0;
      const htmlSegments = [];
      const segmentRegex = /(<(?:h[1-6]|p|div|img|br|blockquote|pre|[uo]l)[^>]*>[\s\S]*?<\/(?:h[1-6]|p|div|blockquote|pre|[uo]l)>|<(?:img|br)[^>]*\/?>|[^<]+)/gi;
      let match;
      while ((match = segmentRegex.exec(html)) !== null) {
        htmlSegments.push(match[0]);
      }
      for (const segment of htmlSegments) {
        if (currentLines >= targetLines)
          break;
        const trimmedSegment = segment.trim();
        if (!trimmedSegment)
          continue;
        let segmentLines;
        if (trimmedSegment.match(/<img[^>]*>/i)) {
          segmentLines = LINE_CONFIG.IMAGE_LINES;
        } else if (trimmedSegment.match(/<br\s*\/?>/i)) {
          segmentLines = LINE_CONFIG.BR_LINES;
        } else if (trimmedSegment.match(/<[^>]+>/)) {
          const tempResult = calculateLinesFromHTML(trimmedSegment);
          segmentLines = tempResult.totalLines;
        } else {
          segmentLines = calculateTextLines(trimmedSegment);
        }
        if (currentLines + segmentLines <= targetLines) {
          truncatedHtml += trimmedSegment;
          currentLines += segmentLines;
        } else {
          const remainingLines = targetLines - currentLines;
          if (remainingLines > 0) {
            if (trimmedSegment.match(/<p[^>]*>(.*?)<\/p>/is)) {
              const pMatch = trimmedSegment.match(/<p([^>]*)>(.*?)<\/p>/is);
              if (pMatch) {
                const pContent = pMatch[2].replace(/<[^>]*>/g, "");
                const truncatedContent = truncateTextByLines(pContent, remainingLines);
                if (truncatedContent) {
                  truncatedHtml += `<p${pMatch[1]}>${truncatedContent}</p>`;
                }
              }
              break;
            } else if (!trimmedSegment.match(/<[^>]+>/)) {
              const truncatedText = truncateTextByLines(trimmedSegment, remainingLines);
              if (truncatedText) {
                truncatedHtml += truncatedText;
              }
              break;
            }
          }
          break;
        }
      }
      const result = cleanHTML(truncatedHtml);
      return result || html.substring(0, 100) + "...";
    }
    function parseRichTextContent(content) {
      if (!content)
        return { displayContent: "", totalLines: 0, imageCount: 0 };
      let totalLines2 = 0;
      let imageCount2 = 0;
      let displayContent2 = content;
      if (typeof content === "string") {
        displayContent2 = content;
        const result = calculateLinesFromHTML(content);
        totalLines2 = result.totalLines;
        imageCount2 = result.imageCount;
      }
      return { displayContent: displayContent2, totalLines: totalLines2, imageCount: imageCount2 };
    }
    const { displayContent, totalLines, imageCount } = parseRichTextContent(props.message.content || "");
    const contentLevel = common_vendor.computed(() => {
      if (totalLines <= LINE_CONFIG.SHORT_LIMIT) {
        return "short";
      } else if (totalLines <= LINE_CONFIG.MEDIUM_LIMIT) {
        return "medium";
      } else {
        return "long";
      }
    });
    const getDisplayContent = () => {
      if (!displayContent)
        return "";
      let htmlContent = displayContent;
      htmlContent = cleanHTML(htmlContent);
      htmlContent = htmlContent.replace(
        /<img([^>]*?)>/g,
        '<img$1 style="width: 100% !important; max-width: 500rpx !important; height: auto !important; border-radius: 12rpx !important; margin: 16rpx 0 !important; display: block !important; object-fit: cover !important; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1) !important;">'
      );
      if (contentLevel.value === "medium" && !props.message.expanded) {
        const targetLines = LINE_CONFIG.SHORT_LIMIT;
        htmlContent = truncateHTMLByLines(htmlContent, targetLines);
      }
      if (contentLevel.value === "long") {
        const targetLines = LINE_CONFIG.PREVIEW_LINES;
        htmlContent = truncateHTMLByLines(htmlContent, targetLines);
      }
      return cleanHTML(htmlContent);
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const time = new Date(timeStr);
        const now = /* @__PURE__ */ new Date();
        const diff = now - time;
        if (diff < 6e4) {
          return "刚刚";
        } else if (diff < 36e5) {
          return `${Math.floor(diff / 6e4)}分钟前`;
        } else if (diff < 864e5) {
          return `${Math.floor(diff / 36e5)}小时前`;
        } else if (diff < 6048e5) {
          return `${Math.floor(diff / 864e5)}天前`;
        } else {
          const month = String(time.getMonth() + 1).padStart(2, "0");
          const date = String(time.getDate()).padStart(2, "0");
          const hours = String(time.getHours()).padStart(2, "0");
          const minutes = String(time.getMinutes()).padStart(2, "0");
          if (time.getFullYear() === now.getFullYear()) {
            return `${month}-${date} ${hours}:${minutes}`;
          } else {
            return `${time.getFullYear()}-${month}-${date}`;
          }
        }
      } catch (error) {
        return String(timeStr);
      }
    };
    const handleMessageClick = () => {
      emit("messageClick", props.message, props.index);
    };
    const toggleContent = () => {
      emit("toggleExpanded", props.message.id, props.index);
    };
    const viewFullContent = () => {
      emit("viewDetail", props.message);
    };
    const onRichTextLoad = () => {
    };
    const handleRichTextClick = (e) => {
      var _a, _b;
      console.log("Rich text item clicked:", e.detail);
      if (e.detail.node && e.detail.node.name === "img") {
        const imgSrc = (_a = e.detail.node.attrs) == null ? void 0 : _a.src;
        if (imgSrc) {
          const allImages = getAllImageUrls();
          common_vendor.index.previewImage({
            current: imgSrc,
            urls: allImages
          });
        }
      }
      if (e.detail.node && e.detail.node.name === "a") {
        const href = (_b = e.detail.node.attrs) == null ? void 0 : _b.href;
        if (href) {
          console.log("Link clicked:", href);
        }
      }
    };
    const getAllImageUrls = () => {
      const urls = [];
      if (typeof displayContent === "string") {
        const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/g;
        let match;
        while ((match = imgRegex.exec(displayContent)) !== null) {
          urls.push(match[1]);
        }
      }
      return urls;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.message.title || "系统通知"),
        b: common_vendor.t(formatTime(__props.message.send_time || __props.message.created_at)),
        c: __props.message.sender_name
      }, __props.message.sender_name ? {
        d: common_vendor.t(__props.message.sender_name)
      } : {}, {
        e: contentLevel.value === "short"
      }, contentLevel.value === "short" ? {
        f: common_vendor.o(onRichTextLoad),
        g: common_vendor.o(handleRichTextClick),
        h: common_vendor.p({
          content: getDisplayContent(),
          ["lazy-load"]: true,
          selectable: true,
          ["use-anchor"]: true
        })
      } : contentLevel.value === "medium" ? common_vendor.e({
        j: !__props.message.expanded ? 1 : "",
        k: common_vendor.o(onRichTextLoad),
        l: common_vendor.o(handleRichTextClick),
        m: common_vendor.p({
          content: getDisplayContent(),
          ["lazy-load"]: true,
          selectable: true,
          ["use-anchor"]: true
        }),
        n: !__props.message.expanded
      }, !__props.message.expanded ? {} : {}, {
        o: common_vendor.t(__props.message.expanded ? "收起" : "展开"),
        p: __props.message.expanded ? 1 : "",
        q: common_vendor.o(toggleContent)
      }) : {
        r: common_vendor.o(handleRichTextClick),
        s: common_vendor.p({
          content: getDisplayContent(),
          ["lazy-load"]: true,
          selectable: true,
          ["use-anchor"]: true
        }),
        t: common_vendor.o(viewFullContent)
      }, {
        i: contentLevel.value === "medium",
        v: common_vendor.o(handleMessageClick),
        w: __props.message.expanded ? 1 : ""
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-506a9f7c"]]);
wx.createComponent(Component);
