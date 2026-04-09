'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useField } from '@payloadcms/ui'

// 简化版 Markdown 编辑器 - 使用 Payload useField Hook
export const MarkdownEditor: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false)
  
  // 使用 Payload 的 useField Hook 正确注册到表单系统
  const { value, setValue, path } = useField<string>({
    path: 'content',
  })

  // 内部状态用于编辑器显示
  const [editorValue, setEditorValue] = useState<string>('')

  // 同步 Payload 的值到编辑器
  useEffect(() => {
    if (value !== undefined && value !== editorValue) {
      setEditorValue(value || '')
    }
  }, [value])

  // 处理输入变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setEditorValue(newValue)
    // 通过 setValue 通知 Payload 表单系统
    setValue(newValue)
  }, [setValue])

  // 简单的 Markdown 预览转换
  const renderPreview = (text: string) => {
    if (!text) return <p style={{ color: '#999' }}>无内容</p>
    
    return (
      <div style={{ lineHeight: '1.6' }}>
        {text.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>
          if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>
          if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
          if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>
          if (line.startsWith('> ')) return <blockquote key={i}>{line.slice(2)}</blockquote>
          if (line.startsWith('```')) return null
          return <p key={i}>{line}</p>
        })}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ 
        marginBottom: '8px', 
        fontWeight: '600', 
        fontSize: '14px',
        color: '#374151'
      }}>
        Content *
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          style={{
            padding: '6px 12px',
            background: showPreview ? '#3b82f6' : '#f3f4f6',
            color: showPreview ? '#fff' : '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          {showPreview ? '✏️ 编辑' : '👁️ 预览'}
        </button>
      </div>

      {showPreview ? (
        <div style={{
          padding: '16px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          background: '#ffffff',
          lineHeight: '1.6',
          minHeight: '300px'
        }}>
          {renderPreview(editorValue)}
        </div>
      ) : (
        <textarea
          id={`field-${path}`}
          value={editorValue}
          onChange={handleChange}
          placeholder="在此输入 Markdown 内容...
          
支持的语法：
# 标题
**粗体**
*斜体*
`代码`
[链接](url)
- 列表项
> 引用"
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
            fontSize: '14px',
            lineHeight: '1.6',
            resize: 'vertical'
          }}
        />
      )}

      {/* 调试信息 */}
      <div style={{ 
        marginTop: '8px', 
        fontSize: '11px', 
        color: '#9ca3af',
        padding: '8px',
        background: '#f9fafb',
        borderRadius: '4px'
      }}>
        <div>字符数：{editorValue.length}</div>
        <div>路径：{path}</div>
        <div>有值：{editorValue ? '是' : '否'}</div>
      </div>
    </div>
  )
}

export default MarkdownEditor
