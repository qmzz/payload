import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import type { Article } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  // 获取最新文章
  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 6,
    overrideAccess: false,
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
  })

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
    <div className="pt-24 pb-24">
      {/* Hero Section */}
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="text-5xl font-bold mb-4">🏛️ 赛博帝国</h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300">
            记录帝国建设历程 · 分享金融投资洞察
          </p>
        </div>
      </div>

      {/* 最新文章 */}
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">📌 最新文章</h2>
          <Link
            href="/articles"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            查看全部 →
          </Link>
        </div>

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

                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {article.title}
                  </h3>

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
      </div>

      {/* 分类导航 */}
      <div className="container mt-16">
        <h2 className="text-3xl font-bold mb-8">📂 文章分类</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/articles?category=finance"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow dark:border-gray-700 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-lg">金融投资</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              A 股、港股、美股市场分析
            </p>
          </Link>

          <Link
            href="/articles?category=empire"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow dark:border-gray-700 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
          >
            <div className="text-3xl mb-2">🏛️</div>
            <h3 className="font-bold text-lg">帝国史记</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              赛博帝国建设历程
            </p>
          </Link>

          <Link
            href="/articles?category=technology"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow dark:border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
          >
            <div className="text-3xl mb-2">💻</div>
            <h3 className="font-bold text-lg">信息技术</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              AI、自动化、开发技术
            </p>
          </Link>

          <Link
            href="/articles?category=talk"
            className="p-6 border rounded-lg hover:shadow-md transition-shadow dark:border-gray-700 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
          >
            <div className="text-3xl mb-2">💭</div>
            <h3 className="font-bold text-lg">碎碎念念</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              个人随笔与思考
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `赛博帝国 · 首页`,
    description: '记录帝国建设历程 · 分享金融投资洞察',
  }
}
