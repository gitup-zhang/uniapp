"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "AdminMessage",
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  emits: ["messageClick", "actionClick", "markRead"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isExpanded = common_vendor.ref(false);
    const LINE_CONFIG = {
      SHORT_LIMIT: 3,
      // 短内容：5行以内
      MEDIUM_LIMIT: 15,
      // 中等内容：6-15行
      // 富文本元素行数配置
      IMAGE_LINES: 4,
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
      CHARS_PER_LINE: 20,
      // 每行大约字符数（根据实际UI调整）
      // 容器配置
      CONTAINER_WIDTH: 600,
      // 容器宽度（rpx），用于更精确的计算
      FONT_SIZE: 28,
      // 字体大小（rpx）
      LINE_HEIGHT: 1.6
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
    function extractTextFromNodes(nodes) {
      if (!Array.isArray(nodes))
        return "";
      let text = "";
      for (const node of nodes) {
        if (typeof node === "string") {
          text += node;
        } else if (node.type === "text") {
          text += node.text || "";
        } else if (node.children) {
          text += extractTextFromNodes(node.children);
        }
      }
      return text;
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
    function calculateLinesFromNodes(nodes) {
      if (!Array.isArray(nodes))
        return { totalLines: 0, imageCount: 0 };
      let totalLines2 = 0;
      let imageCount2 = 0;
      function calculateNodeLines(nodeList) {
        let lines = 0;
        for (const node of nodeList) {
          if (typeof node === "string") {
            const textLines = calculateTextLines(node);
            lines += textLines;
          } else if (node.type === "text") {
            const textLines = calculateTextLines(node.text || "");
            lines += textLines;
          } else if (node.name) {
            const tagName = node.name.toLowerCase();
            switch (tagName) {
              case "img":
                imageCount2++;
                lines += LINE_CONFIG.IMAGE_LINES;
                break;
              case "br":
                lines += LINE_CONFIG.BR_LINES;
                break;
              case "p":
                if (node.children) {
                  const childLines = calculateNodeLines(node.children);
                  lines += Math.max(childLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN;
                } else {
                  lines += LINE_CONFIG.PARAGRAPH_MIN_LINES + LINE_CONFIG.BLOCK_MARGIN;
                }
                break;
              case "div":
                if (node.children) {
                  const childLines = calculateNodeLines(node.children);
                  if (childLines > 0) {
                    lines += childLines + LINE_CONFIG.BLOCK_MARGIN;
                  }
                }
                break;
              case "h1":
              case "h2":
              case "h3":
              case "h4":
              case "h5":
              case "h6":
                const headingLevel = parseInt(tagName.substring(1));
                const headingFontSize = LINE_CONFIG.FONT_SIZE + 4 * (7 - headingLevel);
                if (node.children) {
                  const headingText = extractTextFromNodes(node.children);
                  const headingLines = calculateTextLines(headingText, headingFontSize);
                  const minLines = LINE_CONFIG.TITLE_MIN_LINES[tagName] || 1;
                  lines += Math.max(headingLines, minLines) + LINE_CONFIG.BLOCK_MARGIN;
                } else {
                  lines += LINE_CONFIG.TITLE_MIN_LINES[tagName] + LINE_CONFIG.BLOCK_MARGIN;
                }
                break;
              case "li":
                if (node.children) {
                  const liLines = calculateNodeLines(node.children);
                  lines += Math.max(liLines, LINE_CONFIG.LIST_ITEM_MIN_LINES);
                } else {
                  lines += LINE_CONFIG.LIST_ITEM_MIN_LINES;
                }
                break;
              case "ul":
              case "ol":
                if (node.children) {
                  const listLines = calculateNodeLines(node.children);
                  lines += listLines + LINE_CONFIG.BLOCK_MARGIN;
                }
                break;
              case "blockquote":
                if (node.children) {
                  const quoteLines = calculateNodeLines(node.children);
                  lines += Math.max(quoteLines, LINE_CONFIG.PARAGRAPH_MIN_LINES) + LINE_CONFIG.BLOCK_MARGIN;
                } else {
                  lines += LINE_CONFIG.PARAGRAPH_MIN_LINES + LINE_CONFIG.BLOCK_MARGIN;
                }
                break;
              case "pre":
                if (node.children) {
                  const codeText = extractTextFromNodes(node.children);
                  const codeLines = codeText.split(/\n/).length;
                  lines += codeLines + LINE_CONFIG.BLOCK_MARGIN;
                }
                break;
              default:
                const isInline = ["span", "strong", "em", "b", "i", "u", "small", "mark", "del", "ins", "sub", "sup", "code", "a"].includes(tagName);
                if (node.children) {
                  const childLines = calculateNodeLines(node.children);
                  if (isInline) {
                    lines += childLines;
                  } else {
                    lines += childLines + (childLines > 0 ? LINE_CONFIG.BLOCK_MARGIN : 0);
                  }
                }
            }
          }
        }
        return lines;
      }
      totalLines2 = calculateNodeLines(nodes);
      return { totalLines: Math.max(totalLines2, 0.5), imageCount: imageCount2 };
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
      } else if (Array.isArray(content)) {
        displayContent2 = content;
        const result = calculateLinesFromNodes(content);
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
    function truncateHTMLByLines(html, targetLines) {
      if (!html)
        return "";
      const currentResult = calculateLinesFromHTML(html);
      if (currentResult.totalLines <= targetLines) {
        return html;
      }
      let currentLines = 0;
      const blockElements = [
        { regex: /<img[^>]*>/gi, lines: LINE_CONFIG.IMAGE_LINES },
        { regex: /<br\s*\/?>/gi, lines: LINE_CONFIG.BR_LINES },
        { regex: /<h[1-6][^>]*>.*?<\/h[1-6]>/gis, lines: null },
        // 需要计算内容
        { regex: /<p[^>]*>.*?<\/p>/gis, lines: null },
        // 需要计算内容
        { regex: /<blockquote[^>]*>.*?<\/blockquote>/gis, lines: null },
        // 需要计算内容
        { regex: /<pre[^>]*>.*?<\/pre>/gis, lines: null },
        // 需要计算内容
        { regex: /<[uo]l[^>]*>.*?<\/[uo]l>/gis, lines: null }
        // 需要计算内容
      ];
      let remainingHtml = html;
      let processedHtml = "";
      for (const element of blockElements) {
        const matches = remainingHtml.match(element.regex) || [];
        for (const match of matches) {
          let elementLines;
          if (element.lines !== null) {
            elementLines = element.lines;
          } else {
            const tempResult = calculateLinesFromHTML(match);
            elementLines = tempResult.totalLines;
          }
          if (currentLines + elementLines <= targetLines) {
            processedHtml += match;
            currentLines += elementLines;
            remainingHtml = remainingHtml.replace(match, "");
          } else {
            if (match.match(/<p[^>]*>.*?<\/p>/is)) {
              const pContent = match.replace(/<p[^>]*>|<\/p>/gi, "");
              const remainingLines = targetLines - currentLines - LINE_CONFIG.BLOCK_MARGIN;
              if (remainingLines > 0) {
                const truncatedContent = truncateTextByLines(pContent, remainingLines);
                if (truncatedContent) {
                  processedHtml += match.replace(/<p([^>]*)>.*?<\/p>/is, `<p$1>${truncatedContent}</p>`);
                  currentLines = targetLines;
                }
              }
            }
            break;
          }
          if (currentLines >= targetLines)
            break;
        }
        if (currentLines >= targetLines)
          break;
      }
      if (currentLines < targetLines && remainingHtml.trim()) {
        const remainingText = remainingHtml.replace(/<[^>]*>/g, "").trim();
        if (remainingText) {
          const remainingLines = targetLines - currentLines;
          const truncatedText = truncateTextByLines(remainingText, remainingLines);
          if (truncatedText) {
            processedHtml += truncatedText;
          }
        }
      }
      return processedHtml || html;
    }
    function truncateNodesByLines(nodes, targetLines) {
      let currentLines = 0;
      const result = [];
      for (const node of nodes) {
        if (currentLines >= targetLines)
          break;
        if (typeof node === "string") {
          const textLines = calculateTextLines(node);
          if (currentLines + textLines <= targetLines) {
            result.push(node);
            currentLines += textLines;
          } else {
            const remainingLines = targetLines - currentLines;
            if (remainingLines > 0) {
              const truncatedText = truncateTextByLines(node, remainingLines);
              if (truncatedText) {
                result.push(truncatedText);
                currentLines = targetLines;
              }
            }
            break;
          }
        } else if (node.type === "text") {
          const textLines = calculateTextLines(node.text || "");
          if (currentLines + textLines <= targetLines) {
            result.push(node);
            currentLines += textLines;
          } else {
            const remainingLines = targetLines - currentLines;
            if (remainingLines > 0) {
              const truncatedText = truncateTextByLines(node.text || "", remainingLines);
              if (truncatedText) {
                result.push({
                  ...node,
                  text: truncatedText
                });
                currentLines = targetLines;
              }
            }
            break;
          }
        } else if (node.name) {
          const tagName = node.name.toLowerCase();
          const nodeLines = calculateLinesFromNodes([node]).totalLines;
          if (currentLines + nodeLines <= targetLines) {
            result.push(node);
            currentLines += nodeLines;
          } else {
            const truncatableElements = ["p", "div", "li", "blockquote"];
            if (truncatableElements.includes(tagName) && node.children) {
              const remainingLines = targetLines - currentLines - (tagName === "p" ? LINE_CONFIG.BLOCK_MARGIN : 0);
              if (remainingLines > 0) {
                const truncatedChildren = truncateNodesByLines(node.children, remainingLines);
                if (truncatedChildren.length > 0) {
                  result.push({
                    ...node,
                    children: truncatedChildren
                  });
                  currentLines = targetLines;
                }
              }
            }
            break;
          }
        }
      }
      return result;
    }
    const getDisplayNodes = () => {
      if (!displayContent)
        return [];
      if (typeof displayContent === "string") {
        let htmlContent = displayContent;
        htmlContent = htmlContent.replace(
          /<img([^>]*?)>/g,
          '<img$1 style="width: 100% !important; max-width: 500rpx !important; height: auto !important; border-radius: 12rpx !important; margin: 16rpx 0 !important; display: block !important; object-fit: cover !important; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1) !important;">'
        );
        if (contentLevel.value === "medium" && !isExpanded.value) {
          const targetLines = LINE_CONFIG.SHORT_LIMIT;
          htmlContent = truncateHTMLByLines(htmlContent, targetLines);
        }
        if (contentLevel.value === "long") {
          const targetLines = LINE_CONFIG.SHORT_LIMIT;
          htmlContent = truncateHTMLByLines(htmlContent, targetLines);
        }
        return htmlContent;
      }
      if (Array.isArray(displayContent)) {
        const processNodes = (nodes) => {
          return nodes.map((node) => {
            if (node.name === "img") {
              return {
                ...node,
                attrs: {
                  ...node.attrs,
                  style: "width: 100% !important; max-width: 500rpx !important; height: auto !important; border-radius: 12rpx !important; margin: 16rpx 0 !important; display: block !important; object-fit: cover !important; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1) !important;"
                }
              };
            } else if (node.children) {
              return {
                ...node,
                children: processNodes(node.children)
              };
            }
            return node;
          });
        };
        let processedContent = processNodes(displayContent);
        if (contentLevel.value === "medium" && !isExpanded.value) {
          const targetLines = LINE_CONFIG.SHORT_LIMIT;
          return truncateNodesByLines(processedContent, targetLines);
        }
        if (contentLevel.value === "long") {
          const targetLines = LINE_CONFIG.SHORT_LIMIT;
          return truncateNodesByLines(processedContent, targetLines);
        }
        return processedContent;
      }
      return [];
    };
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
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
      const extractImages = (content) => {
        if (typeof content === "string") {
          const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/g;
          let match;
          while ((match = imgRegex.exec(content)) !== null) {
            urls.push(match[1]);
          }
        } else if (Array.isArray(content)) {
          const findImages = (nodes) => {
            var _a;
            for (const node of nodes) {
              if (node.name === "img" && ((_a = node.attrs) == null ? void 0 : _a.src)) {
                urls.push(node.attrs.src);
              } else if (node.children) {
                findImages(node.children);
              }
            }
          };
          findImages(content);
        }
      };
      extractImages(displayContent);
      return urls;
    };
    const formatMessageTime = (timeStr) => {
      if (!timeStr)
        return "";
      const time = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
      };
      if (isSameDay(time, now)) {
        return `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;
      } else {
        return `${time.getMonth() + 1}-${time.getDate()} ${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;
      }
    };
    const handleMessageTap = () => {
      if (contentLevel.value === "long") {
        emit("messageClick", props.message);
        return;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.message.sender_name || "系统管理员"),
        b: common_vendor.t(formatMessageTime(__props.message.send_time)),
        c: __props.message.title
      }, __props.message.title ? {
        d: common_vendor.t(__props.message.title)
      } : {}, {
        e: common_vendor.unref(displayContent)
      }, common_vendor.unref(displayContent) ? {
        f: getDisplayNodes(),
        g: common_vendor.o(handleRichTextClick)
      } : {}, {
        h: contentLevel.value === "medium"
      }, contentLevel.value === "medium" ? {
        i: common_vendor.t(isExpanded.value ? "收起" : "查看全部"),
        j: isExpanded.value ? 1 : "",
        k: common_vendor.o(toggleExpand)
      } : {}, {
        l: contentLevel.value === "long"
      }, contentLevel.value === "long" ? {} : {}, {
        m: contentLevel.value === "long" ? 1 : "",
        n: common_vendor.o(handleMessageTap)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3a7f16d9"]]);
wx.createComponent(Component);
