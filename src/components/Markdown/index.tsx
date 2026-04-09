import MarkdownIt from 'markdown-it'
import React from 'react'

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动转换 URL 为链接
  typographer: true, // 优化排版
  breaks: true, // 转换换行符为 <br>
})

// Lexical richText 转换为 HTML
const lexicalToHtml = (content: any): string => {
  if (!content || !content.root || !content.root.children) {
    return ''
  }

  // 渲染文本节点（处理格式）
  const renderTextNode = (node: any): string => {
    let textContent = node.text || ''
    // format 位掩码: 1=bold, 2=italic, 4=code, 8=link
    if (node.format & 1) textContent = `<strong>${textContent}</strong>`
    if (node.format & 2) textContent = `<em>${textContent}</em>`
    if (node.format & 4) textContent = `<code>${textContent}</code>`
    if (node.format & 8 && node.url) textContent = `<a href="${node.url}" target="_blank" rel="noopener">${textContent}</a>`
    return textContent
  }

  const renderNode = (node: any): string => {
    if (node.type === 'paragraph') {
      const text = node.children?.map((child: any) => {
        if (child.type === 'text') {
          return renderTextNode(child)
        }
        return ''
      }).join('')
      return `<p>${text}</p>`
    }
    if (node.type === 'heading') {
      const level = node.tag || 'h1'
      const text = node.children?.map((child: any) => {
        if (child.type === 'text') return renderTextNode(child)
        return ''
      }).join('')
      return `<${level}>${text}</${level}>`
    }
    if (node.type === 'list') {
      const tag = node.listType === 'ordered' ? 'ol' : 'ul'
      const items = node.children?.map((li: any) => {
        const itemText = li.children?.map((child: any) => {
          if (child.type === 'text') return renderTextNode(child)
          if (child.type === 'paragraph') {
            return child.children?.map((c: any) => c.type === 'text' ? renderTextNode(c) : '').join('')
          }
          return ''
        }).join('')
        return `<li>${itemText}</li>`
      }).join('')
      return `<${tag}>${items}</${tag}>`
    }
    if (node.type === 'list-item') {
      // 嵌套列表中的列表项
      const children = node.children?.map((child: any) => {
        if (child.type === 'paragraph') {
          return child.children?.map((c: any) => {
            if (c.type === 'text') return renderTextNode(c)
            return ''
          }).join('')
        }
        if (child.type === 'list') {
          return renderNode(child)
        }
        return ''
      }).join('')
      return `<li>${children}</li>`
    }
    if (node.type === 'quote') {
      const text = node.children?.map((child: any) => {
        if (child.type === 'paragraph') {
          return child.children?.map((c: any) => c.type === 'text' ? renderTextNode(c) : '').join('')
        }
        return ''
      }).join('')
      return `<blockquote>${text}</blockquote>`
    }
    if (node.type === 'linebreak') {
      return '<br/>'
    }
    // 未知节点类型返回空
    return ''
  }

  return content.root.children.map(renderNode).join('')
}

// 自定义渲染选项
interface MarkdownProps {
  content: string | any
  className?: string
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  if (!content) {
    return null
  }

  let html: string

  // 检查是否为 Lexical richText 格式（对象且有 root 属性）
  if (typeof content === 'object' && content !== null && content.root) {
    // 转换为 HTML
    html = lexicalToHtml(content)
  } else if (typeof content === 'string') {
    // Markdown 字符串直接渲染
    html = md.render(content)
  } else {
    // 其他情况尝试转字符串
    html = md.render(String(content))
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// 导出解析函数供其他地方使用
export const parseMarkdown = (content: string): string => {
  if (!content) {
    return ''
  }
  return md.render(content)
}

export default Markdown