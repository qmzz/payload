import type { CollectionConfig } from 'payload'
import type { Field } from 'payload'

import { authenticated } from '../../access/authenticated'

// 自定义 Markdown 字段类型
const markdownField: Field = {
  name: 'content',
  type: 'textarea', // 保留 textarea 作为底层类型
  required: true,
  admin: {
    components: {
      Field: '@/components/MarkdownEditor',
    },
    description: '支持 Markdown 语法：标题、粗体、斜体、代码、链接、列表等',
  },
  // 自定义验证：处理空值和类型检查
  validate: (val) => {
    // 处理 null、undefined 和空字符串
    if (val === null || val === undefined || val === '') {
      return true // 让 required 验证来处理空值
    }
    if (typeof val === 'string') {
      return true
    }
    return '内容必须是字符串'
  },
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // 公开读取
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: '内容管理',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    markdownField,
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: '📊 金融投资',
          value: 'finance',
        },
        {
          label: '🏛️ 帝国史记',
          value: 'empire',
        },
        {
          label: '💻 信息技术',
          value: 'technology',
        },
        {
          label: '💭 碎碎念念',
          value: 'talk',
        },
      ],
      required: true,
      defaultValue: 'talk',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: '📝 草稿',
          value: 'draft',
        },
        {
          label: '✅ 已发布',
          value: 'published',
        },
        {
          label: '🗄️ 已归档',
          value: 'archived',
        },
      ],
      defaultValue: 'draft',
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'aiMetadata',
      type: 'group',
      admin: {
        readOnly: true, // 只读，由 AI 自动填充
      },
      fields: [
        {
          name: 'scores',
          type: 'group',
          fields: [
            {
              name: 'readability',
              type: 'number',
              min: 0,
              max: 100,
              label: '可读性评分',
            },
            {
              name: 'informativeness',
              type: 'number',
              min: 0,
              max: 100,
              label: '信息量评分',
            },
            {
              name: 'structure',
              type: 'number',
              min: 0,
              max: 100,
              label: '结构评分',
            },
            {
              name: 'engagement',
              type: 'number',
              min: 0,
              max: 100,
              label: '吸引力评分',
            },
            {
              name: 'accuracy',
              type: 'number',
              min: 0,
              max: 100,
              label: '准确性评分',
            },
            {
              name: 'overall',
              type: 'number',
              min: 0,
              max: 100,
              label: '总体评分',
            },
          ],
        },
        {
          name: 'recommendedTags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
          maxRows: 10,
          label: '推荐标签',
        },
        {
          name: 'summary',
          type: 'textarea',
          admin: {
            rows: 3,
          },
          label: '摘要',
        },
        {
          name: 'optimizedTitle',
          type: 'text',
          label: '优化标题',
        },
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
          label: '封面图片',
        },
      ],
    },
    {
      name: 'qaReport',
      type: 'group',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'passed',
          type: 'checkbox',
          required: true,
          label: 'QA 检查通过',
        },
        {
          name: 'issues',
          type: 'json',
          admin: {
            description: 'QA 检查发现的问题',
          },
          label: '问题详情',
        },
        {
          name: 'checkedAt',
          type: 'date',
          label: '检查时间',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 10,
  },
  timestamps: true,
}
