'use client' // 声明为客户端组件

import React, { useState, useMemo } from 'react'
import { Table, Input, Button, Slider, Form, message } from 'antd'
import { isIncludedInRollout, VariationRange } from '@/utils'

const { TextArea } = Input

const InputOutputTable = () => {
  const [key, setKey] = useState('')
  const [ids, setIds] = useState('')
  const [result, setResult] = useState<any[]>([])
  const [range, setRange] = useState<VariationRange>([0, 0]) // 范围选择器的值

  const idList = useMemo(() => ids.split('\n').map(id => id.trim()).filter(id => id !== ''), [ids])

  // 计算结果
  const handleCalculate = () => {
    if (!key || !ids.trim()) {
      message.error('Key 和 IDs 是必填项！')
      return
    }

    if (idList.length === 0) {
      message.error('请输入有效的 IDs，每行一个')
      return
    }

    const finalRange = range.map(v => v / 100) as VariationRange
    const calculatedResult = idList
      .filter(id => {
        return isIncludedInRollout(id, key, finalRange, undefined, undefined)
      })
      .map((id, index) => ({
        key: index,
        result: id,
      }))
    setResult(calculatedResult)
  }

  const columns = [
    {
      title: `Result (${result.length})`,
      dataIndex: 'result',
      key: 'result',
    },
  ]

  return (
    <div className="p-6 min-w-[600px] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Rollout 计算</h1>

        {/* Form */}
        <Form layout="vertical" onFinish={handleCalculate}>
          {/* Key 输入 */}
          <Form.Item
            label="Key"
            required
            rules={[{ required: true, message: '请输入 Key' }]}
          >
            <Input
              placeholder="请输入 Key"
              value={key}
              onChange={e => setKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          {/* IDs 输入 */}
          <Form.Item
            label={`IDs (${idList.length})`}
            required
            rules={[{ required: true, message: '请输入 IDs，每行一个' }]}
          >
            <TextArea
              placeholder="请输入 IDs，每行一个"
              value={ids}
              onChange={e => setIds(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          {/* 范围选择器 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">范围选择 (0-100%)</label>
            <Slider
              range
              min={0}
              max={100}
              value={range}
              onChange={value => setRange(value as VariationRange)}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-2">
              当前范围: {range[0]}% - {range[1]}%
            </div>
          </div>

          {/* 计算按钮 */}
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            计算
          </Button>
        </Form>

        {/* 结果表格 */}
        <div className="mt-6">
          <Table columns={columns} dataSource={result} className="w-full" pagination={false} />
        </div>
      </div>
    </div>
  )
}

export default InputOutputTable
