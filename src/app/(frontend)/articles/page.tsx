import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import type { Article } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

const categoryLabels: Record<string, string> = {
  finance: '📊 金融投资',
  empire: '🏛️ 帝国史记',
  technology: '💻 信息技术',
  talk: '💭 碎碎念念',
}

const categoryColors: Record<string, string> = {
  finance: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  empire: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  talk: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const { category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const whereCondition: any = {
    status: {
      equals: 'published',
    },
  }

  if (category && categoryLabels[category]) {
    whereCondition.category = {
      equals: category,
    }
  }

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 20,
    overrideAccess: false,
    where: whereCondition,
    sort: '-publishedAt',
  })

  const getCategoryLabel = (value: string): string => {
    return categoryLabels[value] || value
  }

  const getCategoryColor = (value: string): string => {
    return categoryColors[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const currentCategoryLabel = category && categoryLabels[category]

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <div className="flex items-center justify-between">
            <div>
              <h1>📰 文章列表</h1>
              {currentCategoryLabel ? (
                <p className="text-xl">{currentCategoryLabel}</p>
              ) : (
                <p className="text-xl">赛博帝国官方博客文章</p>
              )}
            </div>
            {currentCategoryLabel && (
              <Link
                href="/articles"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                查看全部 →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        {articles.docs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无文章</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.docs.map((article: Article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="block group"
              >
                <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow dark:border-gray-700 bg-white dark:bg-gray-800 h-full">
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                        article.category,
                      )}`}
                    >
                      {getCategoryLabel(article.category)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {article.title}
                  </h2>

                  {article.aiMetadata?.summary && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.aiMetadata.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {article.publishedAt && (
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {article.aiMetadata?.scores?.overall && (
                      <span className="flex items-center gap-1">
                        ⭐ {article.aiMetadata.scores.overall.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {articles.totalPages > 1 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500">
              第 {articles.page} 页 / 共 {articles.totalPages} 页
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category } = await searchParams
  const categoryLabel = category && categoryLabels[category]

  return {
    title: categoryLabel ? `${categoryLabel} | 赛博帝国` : `文章列表 | 赛博帝国`,
    description: categoryLabel
      ? `赛博帝国${categoryLabel}分类文章`
      : '赛博帝国官方博客文章列表',
  }
}
