import React, { useEffect, useState } from 'react'
import reactDom from 'react-dom'

import axios from '@util/request'

import Scroll from '@component/scroll'

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
      const data = await axios.post('commapk/getApk.do', { test: '+++' })
      console.log(data)
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
        {list.map((item) => (
          <div key={item} style={{ height: 30 }}>
            {item}
          </div>
        ))}
      </Scroll>
    </div>
  )
}

reactDom.render(<App />, document.querySelector('#root'))
