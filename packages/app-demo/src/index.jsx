import React, { useEffect, useState } from 'react'
import reactDom from 'react-dom'

import { AiFillGithub } from 'react-icons/ai'

import axios from '@util/request'

import Scroll from '@component/scroll'
import Toast from '@component/toast'
import Popup from '@component/popup'

import './index.less'

const getList = (start) => {
  const list = []
  for (let i = start; i < start + 30; i++) {
    const element = `item${i}`
    list.push(element)
  }

  return list
}

const App = () => {
  const [list, setList] = useState(getList(0))
  const [pullUpLoading, setPullUpLoading] = useState(false)

  useEffect(() => {
    const getApkRes = async () => {
      Toast.loading({ delay: 0, message: '加载中...' })
      const data = await axios.post('commapk/getApk.do', { test: '+++' })
      console.log(data)
      Toast.clear()
    }
    getApkRes()
  }, [])

  const onPullUp = () => {
    setPullUpLoading(true)
    setTimeout(() => {
      const nextList = getList(list.length)
      setList([...list, ...nextList])
      setPullUpLoading(false)
    }, 2000)
  }

  return (
    <div className="container">
      <Scroll pullUpLoading={pullUpLoading} pullUp={onPullUp}>
        <button type="button" onClick={() => Toast.info('info', 2000)}>
          toast info
        </button>
        <button type="button" onClick={() => Toast.success('success', 2000)}>
          toast success
        </button>
        <button type="button" onClick={() => Toast.fail('fail', 2000)}>
          toast fail
        </button>
        <button type="button" onClick={() => Toast.loading({ delay: 0, message: 'loading' })}>
          toast loading
        </button>
        <button
          type="button"
          onClick={() => Toast.show({ delay: 3000, message: '自定义图标', icon: <AiFillGithub /> })}
        >
          toast 自定义
        </button>
        {list.map((item) => (
          <div key={item} style={{ height: 30 }}>
            {item}
          </div>
        ))}
      </Scroll>

      <Popup round position="left" />
    </div>
  )
}

reactDom.render(<App />, document.querySelector('#root'))
