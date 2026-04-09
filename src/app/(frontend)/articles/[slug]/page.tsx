import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Markdown from '@/components/Markdown'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Article {
  id: string
  title: string
  slug: string
  content: any
  category: string
  status: string
  publishedAt: string
  aiMetadata?: {
    summary?: string
    scores?: {
      readability?: number
      informativeness?: number
      structure?: number
      engagement?: number
      accuracy?: number
      overall?: number
    }
    recommendedTags?: Array<{ tag: string }>
    optimizedTitle?: string
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  if (articles.docs.length === 0) {
    notFound()
  }

  const article = articles.docs[0]

  const getCategoryLabel = (value: string): string => {
    const labels: Record<string, string> = {
      finance: '📊 金融投资',
      empire: '🏛️ 帝国史记',
      technology: '💻 信息技术',
      talk: '💭 碎碎念念',
    }
    return labels[value] || value
  }

  const getCategoryColor = (value: string): string => {
    const colors: Record<string, string> = {
      finance: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      empire: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      talk: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    }
    return colors[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    <article className="pt-24 pb-24">
      <div className="container max-w-4xl">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link
            href="/articles"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← 返回文章列表
          </Link>
        </div>

        {/* 文章头部 */}
        <header className="mb-8">
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                article.category,
              )}`}
            >
              {getCategoryLabel(article.category)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center gap-4 text-gray-500">
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            )}
          </div>
        </header>

        {/* AI 摘要 */}
        {article.aiMetadata?.summary && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              📝 AI 摘要
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{article.aiMetadata.summary}</p>
          </div>
        )}

        {/* AI 评分 */}
        {article.aiMetadata?.scores && (
          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
              ⭐ AI 评分
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {article.aiMetadata.scores.overall?.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">总体</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {article.aiMetadata.scores.readability?.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">可读性</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {article.aiMetadata.scores.informativeness?.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">信息量</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {article.aiMetadata.scores.structure?.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">结构</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {article.aiMetadata.scores.engagement?.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">吸引力</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {article.aiMetadata.scores.accuracy?.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">准确性</div>
              </div>
            </div>
          </div>
        )}

        {/* 推荐标签 */}
        {article.aiMetadata?.recommendedTags && article.aiMetadata.recommendedTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {article.aiMetadata.recommendedTags.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{item.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 文章内容 */}
        <div className="prose dark:prose-invert max-w-none">
          <Markdown content={article.content} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const article = articles.docs[0]

  if (!article) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: `${article.title} | 赛博帝国`,
    description: article.aiMetadata?.summary || `阅读"${article.title}"`,
  }
}
